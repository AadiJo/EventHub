// NLP-based Event Categorization System
// This module automatically categorizes events based on their title, description, and tags

// Comprehensive keyword mapping for each category
const categoryKeywords: Record<string, string[]> = {
  'Vegan': [
    'vegan', 'plant-based', 'vegetarian', 'cruelty-free', 'animal-free', 'dairy-free',
    'meat-free', 'plant protein', 'veggie', 'herbivore', 'compassionate', 'ethical eating'
  ],
  'Vegetarian': [
    'vegetarian', 'veggie', 'lacto-ovo', 'pescatarian', 'flexitarian', 'meatless',
    'plant-based', 'vegetable', 'herbivore', 'lactose', 'dairy', 'eggs'
  ],
  'Environmental': [
    'environment', 'climate', 'sustainability', 'green', 'eco-friendly', 'carbon',
    'renewable', 'conservation', 'pollution', 'recycling', 'sustainable', 'earth',
    'nature', 'wildlife', 'biodiversity', 'clean energy', 'zero waste'
  ],
  'Animal Rights': [
    'animal', 'animals', 'animal rights', 'animal welfare', 'rescue', 'adoption',
    'cruelty-free', 'animal shelter', 'pet', 'wildlife', 'conservation', 'animal care',
    'animal protection', 'animal advocacy', 'foster', 'animal rescue'
  ],
  'Hunting': [
    'hunting', 'hunt', 'game', 'wildlife', 'outdoor', 'rifle', 'bow', 'archery',
    'deer', 'duck', 'hunting season', 'conservation', 'wildlife management', 'game reserve'
  ],
  'Fishing': [
    'fishing', 'fish', 'angling', 'catch', 'bait', 'rod', 'reel', 'lake', 'river',
    'ocean', 'marine', 'fisherman', 'angling', 'fly fishing', 'deep sea'
  ],
  'Outdoor Sports': [
    'outdoor', 'hiking', 'camping', 'climbing', 'rock climbing', 'mountain', 'trail',
    'adventure', 'backpacking', 'trekking', 'outdoor gear', 'wilderness', 'nature sports'
  ],
  'Fitness': [
    'fitness', 'workout', 'exercise', 'gym', 'training', 'strength', 'cardio',
    'yoga', 'pilates', 'crossfit', 'running', 'cycling', 'swimming', 'health',
    'muscle', 'endurance', 'flexibility', 'bootcamp'
  ],
  'Art': [
    'art', 'painting', 'drawing', 'sculpture', 'gallery', 'exhibition', 'artist',
    'creative', 'visual arts', 'fine arts', 'artwork', 'canvas', 'brush', 'studio',
    'artistic', 'craft', 'design', 'illustration'
  ],
  'Music': [
    'music', 'concert', 'band', 'musician', 'song', 'performance', 'live music',
    'gig', 'venue', 'sound', 'audio', 'instrument', 'guitar', 'piano', 'drums',
    'vocal', 'singing', 'composer', 'music festival'
  ],
  'Technology': [
    'tech', 'technology', 'programming', 'coding', 'software', 'app', 'development',
    'AI', 'artificial intelligence', 'machine learning', 'data', 'computer', 'digital',
    'startup', 'innovation', 'tech meetup', 'hackathon', 'coding bootcamp'
  ],
  'Science': [
    'science', 'research', 'experiment', 'laboratory', 'scientist', 'discovery',
    'innovation', 'STEM', 'physics', 'chemistry', 'biology', 'astronomy', 'space',
    'scientific method', 'hypothesis', 'theory', 'science fair'
  ],
  'LGBTQ+': [
    'lgbtq', 'lgbt', 'pride', 'gay', 'lesbian', 'transgender', 'bisexual', 'queer',
    'inclusive', 'diversity', 'equality', 'rights', 'community', 'support', 'ally'
  ],
  'Pride': [
    'pride', 'lgbtq', 'lgbt', 'gay pride', 'pride parade', 'celebration', 'diversity',
    'inclusive', 'equality', 'rights', 'community', 'support', 'ally', 'rainbow'
  ],
  'Social Justice': [
    'social justice', 'justice', 'equality', 'rights', 'activism', 'protest',
    'advocacy', 'civil rights', 'human rights', 'fairness', 'equity', 'discrimination',
    'inclusion', 'diversity', 'change', 'reform'
  ],
  'Community Service': [
    'volunteer', 'volunteering', 'community service', 'service', 'help', 'charity',
    'nonprofit', 'giving back', 'community', 'outreach', 'service project', 'donation',
    'fundraising', 'social good', 'impact'
  ],
  'Education': [
    'education', 'learning', 'teaching', 'school', 'university', 'college', 'course',
    'workshop', 'seminar', 'training', 'knowledge', 'study', 'academic', 'student',
    'teacher', 'tutor', 'mentor', 'skill development'
  ],
  'Cooking': [
    'cooking', 'chef', 'recipe', 'kitchen', 'culinary', 'food', 'cook', 'baking',
    'meal', 'ingredient', 'cuisine', 'restaurant', 'catering', 'food preparation',
    'culinary arts', 'gourmet', 'homemade'
  ],
  'Gardening': [
    'gardening', 'garden', 'plant', 'plants', 'growing', 'vegetable', 'herb',
    'flower', 'greenhouse', 'compost', 'soil', 'seed', 'harvest', 'organic',
    'sustainable gardening', 'urban farming'
  ],
  'Photography': [
    'photography', 'photo', 'camera', 'photographer', 'shooting', 'lens', 'image',
    'picture', 'photoshoot', 'portrait', 'landscape', 'digital', 'film', 'studio',
    'photography workshop', 'photo walk'
  ],
  'Travel': [
    'travel', 'trip', 'journey', 'vacation', 'destination', 'tourism', 'explore',
    'adventure', 'backpacking', 'sightseeing', 'culture', 'international', 'local',
    'travel guide', 'wanderlust', 'nomad'
  ],
  'Culture': [
    'culture', 'cultural', 'heritage', 'tradition', 'custom', 'festival', 'celebration',
    'cultural exchange', 'diversity', 'multicultural', 'ethnic', 'cultural event',
    'heritage', 'traditional', 'folklore'
  ],
  'Religion': [
    'religion', 'religious', 'faith', 'spiritual', 'church', 'temple', 'mosque',
    'synagogue', 'prayer', 'worship', 'spirituality', 'meditation', 'bible',
    'religious study', 'faith community'
  ],
  'Politics': [
    'politics', 'political', 'government', 'election', 'vote', 'democracy',
    'policy', 'activism', 'campaign', 'civic', 'public service', 'debate',
    'political discussion', 'civic engagement'
  ],
  'Business': [
    'business', 'entrepreneur', 'startup', 'company', 'corporate', 'professional',
    'networking', 'commerce', 'industry', 'market', 'finance', 'investment',
    'business development', 'entrepreneurship'
  ],
  'Networking': [
    'networking', 'network', 'professional', 'connection', 'meetup', 'business',
    'career', 'industry', 'professional development', 'contacts', 'relationship',
    'business networking', 'professional community'
  ],
  'Volunteering': [
    'volunteer', 'volunteering', 'service', 'help', 'charity', 'nonprofit',
    'community', 'giving back', 'outreach', 'service project', 'donation',
    'fundraising', 'social good', 'impact', 'volunteer work'
  ],
  'Charity': [
    'charity', 'donation', 'fundraising', 'nonprofit', 'cause', 'help', 'support',
    'giving', 'philanthropy', 'charitable', 'benefit', 'fundraiser', 'charity event'
  ],
  'Sports': [
    'sports', 'athletic', 'team', 'game', 'competition', 'tournament', 'league',
    'athlete', 'sporting', 'physical activity', 'team sports', 'individual sports',
    'sports club', 'sports event'
  ],
  'Gaming': [
    'gaming', 'game', 'video game', 'gamer', 'esports', 'console', 'pc gaming',
    'board game', 'card game', 'strategy', 'multiplayer', 'gaming tournament',
    'gaming community', 'game night'
  ],
  'Books': [
    'book', 'books', 'reading', 'literature', 'author', 'novel', 'book club',
    'library', 'bookstore', 'literary', 'book discussion', 'reading group',
    'book review', 'literature', 'storytelling'
  ],
  'Movies': [
    'movie', 'film', 'cinema', 'theater', 'film festival', 'director', 'actor',
    'film screening', 'movie night', 'cinema', 'film discussion', 'movie club',
    'film production', 'documentary'
  ],
  'Theater': [
    'theater', 'theatre', 'play', 'drama', 'performance', 'stage', 'actor',
    'actress', 'production', 'theatrical', 'drama club', 'theater group',
    'stage performance', 'theater arts'
  ],
  'Dance': [
    'dance', 'dancing', 'dancer', 'choreography', 'ballet', 'contemporary',
    'hip hop', 'salsa', 'ballroom', 'dance class', 'dance performance',
    'dance studio', 'dance workshop', 'dance community'
  ]
};

// Categorize an event based on its content
export const categorizeEvent = (
  title: string,
  description: string,
  tags: string[]
): string => {
  const content = `${title} ${description} ${tags.join(' ')}`.toLowerCase();
  
  const categoryScores: Record<string, number> = {};
  
  // Score each category based on keyword matches
  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    let score = 0;
    
    keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      
      // Exact match gets higher score
      if (content.includes(keywordLower)) {
        score += 2;
      }
      
      // Partial match gets lower score
      if (content.includes(keywordLower.split(' ')[0])) {
        score += 1;
      }
    });
    
    categoryScores[category] = score;
  });
  
  // Find the category with the highest score
  const bestCategory = Object.entries(categoryScores)
    .sort(([, a], [, b]) => b - a)[0];
  
  // If no strong match found, use contextual inference
  if (!bestCategory || bestCategory[1] === 0) {
    return inferCategoryFromContext(title, description, tags);
  }
  
  return bestCategory[0];
};

// Get multiple category suggestions based on content
export const getCategorySuggestions = (
  title: string,
  description: string,
  tags: string[]
): string[] => {
  const content = `${title} ${description} ${tags.join(' ')}`.toLowerCase();
  
  const categoryScores: Record<string, number> = {};
  
  // Score each category
  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    let score = 0;
    
    keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      
      if (content.includes(keywordLower)) {
        score += 2;
      }
      
      if (content.includes(keywordLower.split(' ')[0])) {
        score += 1;
      }
    });
    
    categoryScores[category] = score;
  });
  
  // Return top 3 categories with scores > 0
  return Object.entries(categoryScores)
    .filter(([, score]) => score > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([category]) => category);
};

// Infer category from context when no direct keyword matches
const inferCategoryFromContext = (
  title: string,
  description: string,
  tags: string[]
): string => {
  const content = `${title} ${description} ${tags.join(' ')}`.toLowerCase();
  
  // Context-based inference rules
  if (content.includes('volunteer') || content.includes('help') || content.includes('service')) {
    return 'Community Service';
  }
  
  if (content.includes('learn') || content.includes('teach') || content.includes('education')) {
    return 'Education';
  }
  
  if (content.includes('food') || content.includes('cook') || content.includes('meal')) {
    return 'Cooking';
  }
  
  if (content.includes('outdoor') || content.includes('nature') || content.includes('park')) {
    return 'Outdoor Sports';
  }
  
  if (content.includes('art') || content.includes('creative') || content.includes('design')) {
    return 'Art';
  }
  
  if (content.includes('music') || content.includes('sound') || content.includes('concert')) {
    return 'Music';
  }
  
  if (content.includes('tech') || content.includes('computer') || content.includes('digital')) {
    return 'Technology';
  }
  
  if (content.includes('health') || content.includes('fitness') || content.includes('exercise')) {
    return 'Fitness';
  }
  
  if (content.includes('business') || content.includes('professional') || content.includes('career')) {
    return 'Business';
  }
  
  if (content.includes('social') || content.includes('community') || content.includes('group')) {
    return 'Community Service';
  }
  
  // Default fallback
  return 'Community Service';
};