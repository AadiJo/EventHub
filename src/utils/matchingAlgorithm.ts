import { Event } from '../types/Event';
import { User } from '../contexts/AuthContext';
import { getMLPreferenceWeights, recordInteraction } from './mlPreferenceLearning';

// Mock events data - in a real app, this would come from an API
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Animal Shelter Volunteer Day',
    description: 'Help care for rescued animals and assist with adoption events. Perfect for animal lovers!',
    category: 'Animal Rights',
    location: 'Downtown Animal Shelter',
    date: '2024-02-15',
    time: '10:00',
    maxAttendees: 20,
    currentAttendees: 8,
    hostId: 'host1',
    hostName: 'Sarah Johnson',
    createdAt: '2024-01-20T10:00:00Z',
    tags: ['volunteering', 'animals', 'community']
  },
  {
    id: '2',
    title: 'Vegan Cooking Workshop',
    description: 'Learn to cook delicious plant-based meals with local chefs. All skill levels welcome!',
    category: 'Vegan',
    location: 'Community Kitchen',
    date: '2024-02-18',
    time: '14:00',
    maxAttendees: 15,
    currentAttendees: 12,
    hostId: 'host2',
    hostName: 'Mike Chen',
    createdAt: '2024-01-18T15:30:00Z',
    tags: ['vegan', 'cooking', 'education']
  },
  {
    id: '3',
    title: 'Pride Parade Planning Meeting',
    description: 'Join us in organizing this year\'s Pride Parade. Help make it the best celebration yet!',
    category: 'Pride',
    location: 'LGBTQ+ Community Center',
    date: '2024-02-20',
    time: '19:00',
    maxAttendees: 30,
    currentAttendees: 18,
    hostId: 'host3',
    hostName: 'Alex Rivera',
    createdAt: '2024-01-15T12:00:00Z',
    tags: ['pride', 'lgbtq', 'community', 'planning']
  },
  {
    id: '4',
    title: 'Texas Hunting Club Meeting',
    description: 'Monthly meeting for hunting enthusiasts. Discuss conservation, safety, and upcoming hunts.',
    category: 'Hunting',
    location: 'Wildlife Conservation Center',
    date: '2024-02-22',
    time: '18:30',
    maxAttendees: 25,
    currentAttendees: 15,
    hostId: 'host4',
    hostName: 'Jake Thompson',
    createdAt: '2024-01-22T09:00:00Z',
    tags: ['hunting', 'conservation', 'outdoor', 'texas']
  },
  {
    id: '5',
    title: 'Environmental Cleanup Drive',
    description: 'Help clean up local parks and waterways. Make a difference for our environment!',
    category: 'Environmental',
    location: 'Riverside Park',
    date: '2024-02-25',
    time: '09:00',
    maxAttendees: 40,
    currentAttendees: 22,
    hostId: 'host5',
    hostName: 'Emma Wilson',
    createdAt: '2024-01-25T14:20:00Z',
    tags: ['environment', 'cleanup', 'volunteering', 'outdoor']
  },
  {
    id: '6',
    title: 'Tech Startup Networking',
    description: 'Connect with fellow entrepreneurs and tech professionals. Share ideas and opportunities.',
    category: 'Technology',
    location: 'Innovation Hub',
    date: '2024-02-28',
    time: '17:00',
    maxAttendees: 50,
    currentAttendees: 35,
    hostId: 'host6',
    hostName: 'David Park',
    createdAt: '2024-01-28T11:15:00Z',
    tags: ['networking', 'technology', 'startup', 'business']
  },
  {
    id: '7',
    title: 'Art Gallery Opening',
    description: 'Experience contemporary art from local artists. Wine and cheese reception included.',
    category: 'Art',
    location: 'Modern Art Gallery',
    date: '2024-03-01',
    time: '18:00',
    maxAttendees: 60,
    currentAttendees: 28,
    hostId: 'host7',
    hostName: 'Lisa Martinez',
    createdAt: '2024-01-30T16:45:00Z',
    tags: ['art', 'gallery', 'culture', 'networking']
  },
  {
    id: '8',
    title: 'Fitness Bootcamp',
    description: 'High-intensity workout session for all fitness levels. Bring water and towel!',
    category: 'Fitness',
    location: 'Central Park',
    date: '2024-03-03',
    time: '07:00',
    maxAttendees: 30,
    currentAttendees: 20,
    hostId: 'host8',
    hostName: 'Carlos Rodriguez',
    createdAt: '2024-02-01T08:30:00Z',
    tags: ['fitness', 'workout', 'outdoor', 'health']
  },
  {
    id: '9',
    title: 'Live Music Concert',
    description: 'Local indie bands performing original music. Food trucks and drinks available.',
    category: 'Music',
    location: 'Downtown Music Hall',
    date: '2024-03-05',
    time: '20:00',
    maxAttendees: 200,
    currentAttendees: 150,
    hostId: 'host9',
    hostName: 'Jordan Kim',
    createdAt: '2024-02-03T12:15:00Z',
    tags: ['music', 'concert', 'live', 'entertainment']
  },
  {
    id: '10',
    title: 'Science Fair',
    description: 'Interactive science exhibits and experiments for all ages. Learn while having fun!',
    category: 'Science',
    location: 'Science Museum',
    date: '2024-03-08',
    time: '10:00',
    maxAttendees: 100,
    currentAttendees: 45,
    hostId: 'host10',
    hostName: 'Dr. Maria Santos',
    createdAt: '2024-02-05T14:20:00Z',
    tags: ['science', 'education', 'experiments', 'family']
  }
];

// ML-Enhanced AI Matching Algorithm
export const getMatchedEvents = (user: User): Event[] => {
  if (!user.preferences || user.preferences.length === 0) {
    return mockEvents.slice(0, 3); // Return first 3 events if no preferences
  }

  // Get ML-enhanced preference weights
  const mlWeights = getMLPreferenceWeights(user.id);
  
  const scoredEvents = mockEvents.map(event => {
    let score = 0;
    
    // ML-enhanced category matching (highest weight)
    const categoryWeight = mlWeights[event.category] || 1.0;
    if (user.preferences.includes(event.category)) {
      score += 10 * categoryWeight; // Apply ML weight multiplier
    }
    
    // ML-enhanced tag matching
    event.tags.forEach(tag => {
      const tagWeight = mlWeights[tag] || 0.5;
      if (user.preferences.some(pref => 
        pref.toLowerCase().includes(tag.toLowerCase()) || 
        tag.toLowerCase().includes(pref.toLowerCase())
      )) {
        score += 3 * tagWeight;
      }
    });
    
    // Keyword matching in description with ML weights
    user.preferences.forEach(pref => {
      const prefWeight = mlWeights[pref] || 1.0;
      if (event.description.toLowerCase().includes(pref.toLowerCase()) ||
          event.title.toLowerCase().includes(pref.toLowerCase())) {
        score += 2 * prefWeight;
      }
    });
    
    // Enhanced special matching rules with ML weights
    if (user.preferences.includes('Vegan') && 
        (event.tags.includes('vegan') || event.title.toLowerCase().includes('vegan'))) {
      score += 8 * (mlWeights['Vegan'] || 1.0);
    }
    
    if (user.preferences.includes('Animal Rights') && 
        (event.category === 'Animal Rights' || event.tags.includes('animals'))) {
      score += 8 * (mlWeights['Animal Rights'] || 1.0);
    }
    
    if (user.preferences.includes('Pride') && 
        (event.tags.includes('pride') || event.tags.includes('lgbtq'))) {
      score += 8 * (mlWeights['Pride'] || 1.0);
    }
    
    if (user.preferences.includes('Hunting') && 
        (event.tags.includes('hunting') || event.title.toLowerCase().includes('hunting'))) {
      score += 8 * (mlWeights['Hunting'] || 1.0);
    }
    
    if (user.preferences.includes('Environmental') && 
        (event.category === 'Environmental' || event.tags.includes('environment'))) {
      score += 8 * (mlWeights['Environmental'] || 1.0);
    }
    
    // Boost score for newly discovered preferences
    if (mlWeights[event.category] && mlWeights[event.category] > 1.5) {
      score += 5; // Bonus for strong ML-learned preferences
    }
    
    return { event, score };
  });
  
  // Sort by score and return top matches
  return scoredEvents
    .sort((a, b) => b.score - a.score)
    .filter(item => item.score > 0)
    .slice(0, 8) // Show more events with ML enhancement
    .map(item => item.event);
};

export const getAllEvents = (): Event[] => {
  return mockEvents;
};

// Function to handle event interactions for ML learning
export const handleEventInteraction = (
  userId: string,
  eventId: string,
  action: 'join' | 'view' | 'skip' | 'leave'
): void => {
  const event = mockEvents.find(e => e.id === eventId);
  if (!event) return;
  
  recordInteraction(userId, eventId, action, {
    category: event.category,
    tags: event.tags,
    title: event.title,
    description: event.description
  });
  
  console.log(`ML Learning: User ${userId} ${action} event "${event.title}" (${event.category})`);
};

// Function to join an event and update ML preferences
export const joinEvent = (userId: string, eventId: string): boolean => {
  const event = mockEvents.find(e => e.id === eventId);
  if (!event || event.currentAttendees >= event.maxAttendees) {
    return false;
  }
  
  // Update event attendance
  event.currentAttendees += 1;
  
  // Record positive interaction for ML learning
  handleEventInteraction(userId, eventId, 'join');
  
  return true;
};

// Function to leave an event and update ML preferences
export const leaveEvent = (userId: string, eventId: string): boolean => {
  const event = mockEvents.find(e => e.id === eventId);
  if (!event || event.currentAttendees <= 0) {
    return false;
  }
  
  // Update event attendance
  event.currentAttendees -= 1;
  
  // Record negative interaction for ML learning
  handleEventInteraction(userId, eventId, 'leave');
  
  return true;
};