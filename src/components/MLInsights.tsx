import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserInteractionStats } from '../utils/mlPreferenceLearning';
import { Brain, TrendingUp, Eye, UserPlus, UserMinus, Target, Lightbulb } from 'lucide-react';

const MLInsights: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const stats = getUserInteractionStats(user.id);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          AI Learning Insights
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
          <div className="flex items-center">
            <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Views</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
            {stats.viewCount}
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4">
          <div className="flex items-center">
            <UserPlus className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">Joined</span>
          </div>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
            {stats.joinCount}
          </p>
        </div>

        <div className="bg-red-50 dark:bg-red-900 rounded-lg p-4">
          <div className="flex items-center">
            <UserMinus className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
            <span className="text-sm font-medium text-red-800 dark:text-red-200">Left</span>
          </div>
          <p className="text-2xl font-bold text-red-900 dark:text-red-100 mt-1">
            {stats.leaveCount}
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
            <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Total</span>
          </div>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
            {stats.totalInteractions}
          </p>
        </div>
      </div>

      {stats.topCategories.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <Target className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Top Interest Categories
            </h3>
          </div>
          <div className="space-y-2">
            {stats.topCategories.map(({ category, weight }, index) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">{category}</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (weight / 3) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                    {weight.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.discoveredPreferences.length > 0 && (
        <div>
          <div className="flex items-center mb-3">
            <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Discovered Interests
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.discoveredPreferences.map((preference) => (
              <span
                key={preference}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
              >
                {preference}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            These are interests we've learned about you based on your event interactions!
          </p>
        </div>
      )}

      {stats.totalInteractions === 0 && (
        <div className="text-center py-8">
          <Brain className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Start Exploring Events
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            As you view and join events, our AI will learn your preferences and provide personalized insights.
          </p>
        </div>
      )}
    </div>
  );
};

export default MLInsights;