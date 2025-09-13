import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getMatchedEvents, getAllEvents, joinEvent, leaveEvent, handleEventInteraction } from '../utils/matchingAlgorithm';
import { Event } from '../types/Event';
import { Calendar, MapPin, Users, Clock, Heart, Filter, UserPlus, UserMinus } from 'lucide-react';
import MLInsights from './MLInsights';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [joinedEvents, setJoinedEvents] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  
  if (!user) {
    return <div>Loading...</div>;
  }

  const matchedEvents = getMatchedEvents(user);
  const allEvents = getAllEvents();
  const eventsToShow = showAllEvents ? allEvents : matchedEvents;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleJoinEvent = async (eventId: string) => {
    if (!user) return;
    
    setRefreshing(true);
    const success = joinEvent(user.id, eventId);
    
    if (success) {
      setJoinedEvents(prev => new Set(Array.from(prev).concat(eventId)));
      // Record view interaction for ML learning
      handleEventInteraction(user.id, eventId, 'view');
    }
    
    setRefreshing(false);
  };

  const handleLeaveEvent = async (eventId: string) => {
    if (!user) return;
    
    setRefreshing(true);
    const success = leaveEvent(user.id, eventId);
    
    if (success) {
      setJoinedEvents(prev => {
        const newSet = new Set(Array.from(prev));
        newSet.delete(eventId);
        return newSet;
      });
    }
    
    setRefreshing(false);
  };

  const handleViewEvent = (eventId: string) => {
    if (!user) return;
    // Record view interaction for ML learning
    handleEventInteraction(user.id, eventId, 'view');
  };

  const EventCard: React.FC<{ event: Event }> = ({ event }) => {
    const isJoined = joinedEvents.has(event.id);
    const isFull = event.currentAttendees >= event.maxAttendees;

    return (
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => handleViewEvent(event.id)}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {event.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {event.description}
              </p>
            </div>
            <div className="flex items-center ml-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                {event.category}
              </span>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Calendar className="h-4 w-4 mr-2" />
              {formatDate(event.date)}
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Clock className="h-4 w-4 mr-2" />
              {formatTime(event.time)}
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <MapPin className="h-4 w-4 mr-2" />
              {event.location}
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Users className="h-4 w-4 mr-2" />
              {event.currentAttendees}/{event.maxAttendees} attendees
            </div>
          </div>

          {event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {event.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Hosted by {event.hostName}
            </div>
            <div className="flex gap-2">
              {isJoined ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLeaveEvent(event.id);
                  }}
                  disabled={refreshing}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  <UserMinus className="h-4 w-4 mr-2" />
                  Leave
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoinEvent(event.id);
                  }}
                  disabled={refreshing || isFull}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {isFull ? 'Full' : 'Join'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover events that match your interests
          </p>
        </div>

        <MLInsights />

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">
              {showAllEvents ? 'All Events' : 'Recommended Events'}
            </span>
          </div>
          <button
            onClick={() => setShowAllEvents(!showAllEvents)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showAllEvents ? 'Show Recommended' : 'Show All Events'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventsToShow.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {eventsToShow.length === 0 && (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No events found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {showAllEvents 
                ? 'There are no events available at the moment.' 
                : 'Try updating your preferences to see more recommended events.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;