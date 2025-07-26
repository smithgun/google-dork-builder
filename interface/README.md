# GDork - Google Dork OSINT Tool

A comprehensive web application for Open Source Intelligence (OSINT) gathering using Google Dorks. This tool provides a user-friendly interface for discovering information through advanced Google search techniques.

## Features

- **Pre-built Dork Categories**: Organized collection of Google dorks for different use cases
  - File Types (PDF, DOC, XLS, etc.)
  - Vulnerabilities (Admin panels, SQL errors, etc.)
  - Sensitive Information (Passwords, confidential docs, etc.)
  - Server Information (Apache, Nginx, IIS, etc.)
  - Cameras & IoT devices

- **Dork Builder**: Interactive tool to create custom Google dorks
  - Visual operator selection
  - Real-time dork construction
  - Exclude terms functionality
  - Copy and execute features

- **Search History**: Track and manage your search history
  - Export search history to JSON
  - Filter and search through past queries
  - Reopen previous searches

- **Modern UI/UX**: Clean, responsive design with intuitive navigation
  - Dark/light theme support
  - Mobile-friendly interface
  - Real-time search and filtering

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. **Clone the repository or navigate to the project directory**

2. **Install server dependencies**
   ```bash
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend React app on `http://localhost:3000`

### Production Build

1. **Build the client**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## Usage

### Dashboard
- Browse pre-built dork categories
- Search through available dorks
- Filter by category
- Execute searches directly from the interface

### Dork Builder
- Use the interactive builder to create custom dorks
- Add multiple operators (site:, filetype:, inurl:, etc.)
- Preview your dork in real-time
- Copy or execute built dorks

### Search History
- View all your previous searches
- Export search history for documentation
- Reopen previous searches in new tabs

## Security & Ethics

**Important**: This tool is designed for legitimate security research and defensive purposes only. Users must:

- Only use this tool for authorized security testing
- Respect website terms of service and robots.txt
- Follow applicable laws and regulations
- Use responsibly and ethically

## Technical Architecture

### Backend (Node.js/Express)
- RESTful API for dork management
- Search history tracking
- Static file serving for production

### Frontend (React)
- Modern React with hooks
- Tailwind CSS for styling
- Responsive design
- Real-time search and filtering

### Key API Endpoints
- `GET /api/dorks` - Get all dork categories
- `GET /api/dorks/:category` - Get specific category
- `POST /api/search` - Execute search and track history
- `POST /api/custom-dork` - Create custom dork

## File Structure

```
GDork/
├── server.js              # Express server
├── package.json           # Server dependencies
├── client/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   ├── public/
│   └── package.json       # Client dependencies
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Disclaimer

This tool is for educational and authorized security testing purposes only. Users are responsible for ensuring their use complies with applicable laws and regulations. The authors assume no responsibility for misuse of this tool.