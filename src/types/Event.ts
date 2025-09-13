export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  time: string;
  maxAttendees: number;
  currentAttendees: number;
  hostId: string;
  hostName: string;
  createdAt: string;
  tags: string[];
}

export interface CreateEventData {
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  time: string;
  maxAttendees: number;
  tags: string[];
}