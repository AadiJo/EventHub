// ML Preference Learning System
// This module handles machine learning for user preferences based on event interactions

export interface UserInteraction {
  userId: string;
  eventId: string;
  action: 'join' | 'view' | 'skip' | 'leave';
  timestamp: string;
  eventData: {
    category: string;
    tags: string[];
    title: string;
    description: string;
  };
}

// Store user preference weights (in a real app, this would be in a database)
const userPreferenceWeights: Record<string, Record<string, number>> = {};

// Store user interaction history
const userInteractionHistory: UserInteraction[] = [];

// Initialize ML model for a user with their initial preferences
export const initializeMLModel = (userId: string, preferences: string[]): void => {
  // Initialize weights for user's explicit preferences
  userPreferenceWeights[userId] = {};
  
  preferences.forEach(pref => {
    userPreferenceWeights[userId][pref] = 1.0; // Base weight for explicit preferences
  });
  
  console.log(`ML Model initialized for user ${userId} with preferences:`, preferences);
};

// Record a user interaction for ML learning
export const recordInteraction = (
  userId: string,
  eventId: string,
  action: 'join' | 'view' | 'skip' | 'leave',
  eventData: {
    category: string;
    tags: string[];
    title: string;
    description: string;
  }
): void => {
  const interaction: UserInteraction = {
    userId,
    eventId,
    action,
    timestamp: new Date().toISOString(),
    eventData
  };
  
  userInteractionHistory.push(interaction);
  
  // Update preference weights based on interaction
  updatePreferenceWeights(userId, action, eventData);
  
  console.log(`ML Learning: Recorded ${action} interaction for user ${userId} with event ${eventId}`);
};

// Update preference weights based on user interactions
const updatePreferenceWeights = (
  userId: string,
  action: 'join' | 'view' | 'skip' | 'leave',
  eventData: {
    category: string;
    tags: string[];
    title: string;
    description: string;
  }
): void => {
  if (!userPreferenceWeights[userId]) {
    userPreferenceWeights[userId] = {};
  }
  
  const weights = userPreferenceWeights[userId];
  
  // Define weight changes based on action type
  const weightChanges: Record<string, number> = {
    'join': 0.3,      // Strong positive signal
    'view': 0.1,      // Weak positive signal
    'skip': -0.1,     // Weak negative signal
    'leave': -0.2     // Strong negative signal
  };
  
  const change = weightChanges[action] || 0;
  
  // Update category weight
  const category = eventData.category;
  weights[category] = (weights[category] || 0.5) + change;
  
  // Update tag weights
  eventData.tags.forEach(tag => {
    weights[tag] = (weights[tag] || 0.3) + (change * 0.5); // Tags have less weight than categories
  });
  
  // Discover new preferences from positive interactions
  if (action === 'join' || action === 'view') {
    discoverNewPreferences(userId, eventData);
  }
  
  // Ensure weights stay within reasonable bounds
  Object.keys(weights).forEach(key => {
    weights[key] = Math.max(0.1, Math.min(3.0, weights[key]));
  });
};

// Discover new preferences from user interactions
const discoverNewPreferences = (
  userId: string,
  eventData: {
    category: string;
    tags: string[];
    title: string;
    description: string;
  }
): void => {
  const weights = userPreferenceWeights[userId];
  
  // If user interacts positively with a category they haven't explicitly selected,
  // gradually increase its weight
  if (!weights[eventData.category] || weights[eventData.category] < 0.8) {
    weights[eventData.category] = (weights[eventData.category] || 0.3) + 0.05;
  }
  
  // Similar for tags
  eventData.tags.forEach(tag => {
    if (!weights[tag] || weights[tag] < 0.5) {
      weights[tag] = (weights[tag] || 0.2) + 0.02;
    }
  });
};

// Get ML-enhanced preference weights for a user
export const getMLPreferenceWeights = (userId: string): Record<string, number> => {
  return userPreferenceWeights[userId] || {};
};

// Get user interaction statistics
export const getUserInteractionStats = (userId: string): {
  totalInteractions: number;
  joinCount: number;
  viewCount: number;
  skipCount: number;
  leaveCount: number;
  topCategories: Array<{ category: string; weight: number }>;
  discoveredPreferences: string[];
} => {
  const userInteractions = userInteractionHistory.filter(i => i.userId === userId);
  const weights = getMLPreferenceWeights(userId);
  
  const stats = {
    totalInteractions: userInteractions.length,
    joinCount: userInteractions.filter(i => i.action === 'join').length,
    viewCount: userInteractions.filter(i => i.action === 'view').length,
    skipCount: userInteractions.filter(i => i.action === 'skip').length,
    leaveCount: userInteractions.filter(i => i.action === 'leave').length,
    topCategories: [] as Array<{ category: string; weight: number }>,
    discoveredPreferences: [] as string[]
  };
  
  // Get top categories by weight
  stats.topCategories = Object.entries(weights)
    .filter(([key, weight]) => weight > 0.8)
    .map(([category, weight]) => ({ category, weight }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5);
  
  // Find discovered preferences (high weight items not in original preferences)
  stats.discoveredPreferences = Object.entries(weights)
    .filter(([key, weight]) => weight > 1.2)
    .map(([category]) => category)
    .slice(0, 3);
  
  return stats;
};

// Reset ML model for a user (useful for testing or user preference reset)
export const resetMLModel = (userId: string): void => {
  delete userPreferenceWeights[userId];
  // Remove user's interaction history
  const index = userInteractionHistory.findIndex(i => i.userId === userId);
  if (index !== -1) {
    userInteractionHistory.splice(index, 1);
  }
};