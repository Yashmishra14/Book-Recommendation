# BookWorld - React Frontend

A modern, responsive React frontend for the Book Recommendation System built with React 18, Tailwind CSS, and Framer Motion.

## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive design with dark theme
- **Smart Search**: Real-time search with suggestions and filters
- **AI Recommendations**: Get personalized book suggestions
- **Interactive Components**: Smooth animations and transitions
- **Mobile Responsive**: Optimized for all devices
- **Performance Optimized**: Code splitting, lazy loading, and caching

## 🛠️ Technologies

- **React 18** - Modern React with hooks
- **React Router 6** - Client-side routing
- **Framer Motion** - Animations and transitions
- **React Query** - Data fetching and caching
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons

## 📦 Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm start
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
client/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/          # Reusable components
│   │   ├── BookCard.js
│   │   ├── Navbar.js
│   │   ├── Footer.js
│   │   └── SearchBar.js
│   ├── pages/              # Page components
│   │   ├── Home.js
│   │   ├── Search.js
│   │   ├── Recommend.js
│   │   └── BookDetail.js
│   ├── services/           # API services
│   │   └── api.js
│   ├── hooks/              # Custom hooks
│   │   ├── useDebounce.js
│   │   └── useLocalStorage.js
│   ├── utils/              # Utility functions
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── App.js              # Main App component
│   ├── index.js            # Entry point
│   └── index.css           # Global styles
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## 🎨 Components

### BookCard
Displays book information with image, title, author, and optional rating/votes.

### SearchBar
Smart search input with real-time suggestions and debounced search.

### Navbar
Responsive navigation with mobile menu and active state indicators.

### Footer
Site footer with links and information.

## 📱 Pages

### Home
Landing page with hero section, features, and popular books.

### Search
Book search page with filters, pagination, and grid/list view options.

### Recommend
AI-powered book recommendation page with search and suggestions.

### BookDetail
Individual book detail page with recommendations and additional information.

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the client directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

### Tailwind CSS
The project uses Tailwind CSS for styling. Configuration is in `tailwind.config.js`.

### API Integration
API calls are handled through the `services/api.js` file using Axios.

## 🚀 Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Development Server
The development server runs on `http://localhost:3000` by default.

### Hot Reloading
The app supports hot reloading for fast development.

## 🎯 Performance

- **Code Splitting**: Lazy loading of components
- **Data Caching**: React Query for API caching
- **Image Optimization**: Lazy loading and fallbacks
- **Bundle Optimization**: Webpack optimizations
- **Debounced Search**: Optimized search performance

## 📱 Responsive Design

The app is fully responsive and optimized for:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large screens (1280px+)

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Colors**: Dark theme with primary and accent colors
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React for consistent iconography

## 🔄 State Management

- **React Query**: Server state management and caching
- **React Hooks**: Local state management
- **URL State**: React Router for navigation state

## 🧪 Testing

The project includes testing setup with React Testing Library.

## 📦 Build

The production build creates optimized static files in the `build` directory.

## 🚀 Deployment

The built files can be served by any static file server or integrated with the Flask backend.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
