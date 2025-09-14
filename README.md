# Event Hub 🎉

**Event Hub** is a modern, intelligent event matching platform that connects people through meaningful experiences. Built with React, TypeScript, and powered by AI-driven matching algorithms, Event Hub helps users discover events that align with their interests and preferences.

## ✨ Features

### 🎯 Smart Event Matching
- **AI-Powered Recommendations**: Advanced matching algorithm that learns from user preferences
- **Personalized Event Discovery**: Get events tailored to your interests and past interactions
- **ML Insights**: Machine learning insights to help you discover new interests

### 🎨 Modern User Experience
- **Dark/Light Theme**: Seamless theme switching with persistent preferences
- **Responsive Design**: Beautiful UI that works on all devices
- **Intuitive Navigation**: Clean, modern interface built with Tailwind CSS

### 🔐 User Management
- **Secure Authentication**: User registration and login system
- **Profile Management**: Customizable user profiles with preferences
- **Event History**: Track your event participation and preferences

### 📅 Event Management
- **Create Events**: Easy event creation with detailed information
- **Join/Leave Events**: Simple event participation management
- **Event Categories**: Organized events by categories and tags
- **Location & Time**: Comprehensive event details with maps and scheduling

### 🧠 Intelligent Features
- **NLP Categorization**: Automatic event categorization using natural language processing
- **Preference Learning**: System learns from your interactions to improve recommendations
- **Smart Filtering**: Advanced filtering options for event discovery

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AadiJo/EventHub.git
   cd EventHub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to see the application.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── auth/            # Authentication components
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── CreateEvent.tsx  # Event creation form
│   ├── Dashboard.tsx    # Main dashboard with events
│   ├── LandingPage.tsx  # Homepage
│   ├── MLInsights.tsx   # Machine learning insights
│   ├── Navbar.tsx       # Navigation component
│   └── Profile.tsx      # User profile management
├── contexts/            # React contexts
│   ├── AuthContext.tsx  # Authentication state
│   └── ThemeContext.tsx # Theme management
├── types/               # TypeScript type definitions
│   └── Event.ts         # Event-related types
└── utils/               # Utility functions
    ├── matchingAlgorithm.ts    # Event matching logic
    ├── mlPreferenceLearning.ts # ML preference learning
    └── nlpCategorization.ts   # NLP categorization
```

## 🛠️ Technologies Used

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **State Management**: React Context API
- **Build Tool**: Create React App

## 🎯 Key Components

### Dashboard
The main hub where users can:
- View personalized event recommendations
- Browse all available events
- Join/leave events
- Access ML insights

### Event Creation
Comprehensive event creation with:
- Event details (title, description, category)
- Location and timing information
- Attendee limits and tags
- Automatic categorization

### Smart Matching
Advanced algorithm that considers:
- User preferences and interests
- Past event interactions
- Event categories and tags
- Location proximity

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=your_api_url_here
```

### Theme Configuration
The app supports both light and dark themes. Theme preferences are stored in localStorage and persist across sessions.

## 📱 Responsive Design

Event Hub is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- Built with ❤️ using React and TypeScript
- Icons provided by [Lucide React](https://lucide.dev/)
- Styling powered by [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

For support or questions, please open an issue on GitHub or contact the development team.

---

**Event Hub** - Connecting hearts through meaningful events. 💖
