# Spring

Spring is a social activity discovery application that helps users find and join activities near them. With a modern, intuitive interface inspired by popular dating apps, Spring makes finding group activities as simple as swiping through cards.

## Features

- **Activity Discovery**: Swipe through activity cards to find interesting events
- **Activity Management**: Create and manage your own activities
- **Saved Activities**: Keep track of activities you're interested in
- **Intuitive Gestures**: Swipe right to join, left to skip, up for details
- **Detailed Views**: Get comprehensive information about each activity
- **Modern UI**: Clean, iOS-style interface with proper spacing and animations

## Technology Stack

- **React Native**: Core framework for cross-platform development
- **Expo**: Development toolchain
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Navigation management
- **React Native Gesture Handler**: Gesture controls
- **Supabase**: Backend database and authentication

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/spring.git
cd spring
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on a simulator or scan the QR code with the Expo Go app on your device.

## Usage

- **Discover Activities**: Browse through activity cards on the Discover tab
- **Save Interesting Activities**: Activities you're interested in will appear in the Saved tab
- **Create Activities**: Use the Activities tab to create and manage your events
- **View Details**: Swipe up on any card to see complete details about the activity
- **Join Activities**: Swipe right on an activity to join

## Project Structure

```
spring/
├── app/
│   ├── components/         # Reusable UI components
│   ├── context/            # React contexts (auth, etc.)
│   ├── navigation/         # Navigation configuration
│   ├── screens/            # Screen components
│   ├── utils/              # Utility functions
│   └── MenuItems/          # SVG icons for menu items
├── assets/                 # Static assets
├── SFSymbolsItems/         # SF Symbols as SVG
├── App.tsx                 # Main application component
└── ...                     # Configuration files
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- SF Symbols by Apple for the icon designs
- Unsplash for sample images 