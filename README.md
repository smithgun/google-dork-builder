# GDork - Advanced Google Dork Builder

🔍 A powerful web application for building and executing Google dorks for security research and content discovery.

## Features

- **Visual Dork Builder**: Intuitive interface for creating complex Google search queries
- **Template Library**: Pre-built dork templates for common security research tasks
- **Risk Assessment**: Automatic risk level evaluation for dork queries
- **Search History**: Track and reuse previous searches
- **Save & Export**: Save your custom dorks for future use
- **Real-time Validation**: Instant feedback on dork syntax and effectiveness

## Project Structure

```
GDork/
├── interface/
│   ├── server.js              # Express server
│   ├── package.json           # Server dependencies
│   ├── client/                # React frontend
│   │   ├── src/
│   │   │   ├── components/    # React components
│   │   │   │   ├── DorkBuilder.js    # Main dork builder component
│   │   │   │   ├── CategoryView.js   # Category-based view
│   │   │   │   ├── Documentation.js  # Help and documentation
│   │   │   │   └── ...
│   │   │   └── App.js         # Main application component
│   │   ├── public/            # Static assets
│   │   └── package.json       # Client dependencies
│   └── data/
│       └── search-history.json # Search history storage
```

## Technologies Used

- **Frontend**: React.js, Tailwind CSS, Lucide React (icons)
- **Backend**: Node.js, Express.js
- **HTTP Client**: Axios
- **Routing**: React Router
- **Build Tool**: Create React App

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/GDork.git
   cd GDork
   ```

2. **Install server dependencies**:
   ```bash
   cd interface
   npm install
   ```

3. **Install client dependencies**:
   ```bash
   cd client
   npm install
   ```

4. **Start the development server**:
   ```bash
   # In the interface directory
   npm start
   
   # In a new terminal, start the client
   cd client
   npm start
   ```

5. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## Usage

### Building Dorks

1. **Template Approach**: Choose from pre-built templates for common scenarios
2. **Manual Building**: Use the visual operator builder to create custom dorks
3. **Component System**: Add multiple operators and combine them logically

### Risk Levels

- 🟢 **Low**: Safe for general use
- 🟡 **Medium**: Use with caution
- 🟠 **High**: May find sensitive data
- 🔴 **Critical**: High security risk - use responsibly

### Example Dorks

- `site:example.com filetype:pdf` - Find PDF files on a specific domain
- `inurl:admin OR inurl:login` - Find admin panels and login pages
- `intitle:"index of" site:example.com` - Find directory listings
- `filetype:env OR filetype:config` - Find configuration files

## Security & Ethics

⚠️ **Important**: This tool is designed for legitimate security research and content discovery. Always ensure you have proper authorization before using dorks on systems you don't own.

### Responsible Use Guidelines

- Only use on systems you own or have explicit permission to test
- Respect robots.txt and website terms of service
- Don't use for malicious purposes or unauthorized access
- Be mindful of the impact on target systems
- Follow applicable laws and regulations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This tool is provided for educational and legitimate security research purposes only. The developers are not responsible for any misuse of this software. Users are solely responsible for ensuring their usage complies with applicable laws and regulations.

## Support

If you find this project helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🤝 Contributing to the codebase

---

**Happy Dorking! 🔍**
