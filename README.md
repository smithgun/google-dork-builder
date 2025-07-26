# GDork - Advanced Google Dork Builder

🔍 A powerful, modern web application for building and executing Google dorks for security research and content discovery.

![GitHub Stars](https://img.shields.io/github/stars/smithgun/google-dork-builder?style=social)
![GitHub Forks](https://img.shields.io/github/forks/smithgun/google-dork-builder?style=social)
![GitHub Issues](https://img.shields.io/github/issues/smithgun/google-dork-builder)
![GitHub License](https://img.shields.io/github/license/smithgun/google-dork-builder)

## ✨ Features

### 🎯 **Enhanced Visual Dork Builder**
- **Intuitive drag-and-drop interface** for creating complex Google search queries
- **Component-based system** - Add, remove, and modify operators easily
- **Real-time preview** with syntax highlighting
- **Smart operator suggestions** based on category filtering

### 📚 **Template Library (8 Enhanced Templates)**
- 🛡️ **Admin Panel Finder** - Discover admin interfaces and login pages
- 📁 **Directory Listing** - Find open directory listings
- 🗄️ **Exposed Databases** - Locate exposed database files
- ⚙️ **Configuration Files** - Find config and environment files
- 📜 **Log Files** - Discover log files with sensitive information
- 💾 **Backup Files** - Locate backup files and archives
- 📧 **Email Lists** - Find email addresses and contact information
- 📹 **Camera/IoT Devices** - Discover exposed camera and IoT interfaces

### 🔍 **Advanced Features**
- **Risk Assessment System** - Color-coded risk levels (Low, Medium, High, Critical)
- **Search History Tracking** - Save and reuse previous searches
- **Dork Validation** - Real-time syntax checking and suggestions
- **Export/Import Functionality** - Save custom dorks locally
- **Professional UI/UX** - Clean, modern interface with Tailwind CSS
- **Quick Operator Access** - Sidebar with frequently used operators

### 📊 **Use Case Examples**
- **Security Research** - Find vulnerabilities in public websites
- **Content Discovery** - Discover hidden or exposed content
- **Competitive Analysis** - Research competitor websites and documents

## 🏗️ Project Structure

```
GDork/
├── interface/
│   ├── server.js              # Express.js backend server
│   ├── package.json           # Server dependencies & scripts
│   ├── client/                # React.js frontend application
│   │   ├── src/
│   │   │   ├── components/    # React components
│   │   │   │   ├── DorkBuilder.js        # 🎯 Main enhanced dork builder
│   │   │   │   ├── DorkBuilderTest.js    # 📝 Original clean version
│   │   │   │   ├── CategoryView.js       # 📂 Category-based view
│   │   │   │   ├── Documentation.js      # 📖 Help documentation
│   │   │   │   ├── DorkDashboard.js      # 📊 Main dashboard
│   │   │   │   ├── SearchHistory.js      # 🕒 Search tracking
│   │   │   │   └── Header.js             # 🧭 Navigation header
│   │   │   ├── contexts/      # React context providers
│   │   │   │   └── DarkModeContext.js    # 🌙 Theme management
│   │   │   ├── App.js         # 🚀 Main application router
│   │   │   ├── index.js       # ⚡ Application entry point
│   │   │   └── index.css      # 🎨 Global styles
│   │   ├── public/            # Static assets
│   │   │   └── index.html     # 📄 HTML template
│   │   ├── build/             # Production build (generated)
│   │   ├── package.json       # Client dependencies
│   │   ├── tailwind.config.js # 🎨 Tailwind CSS configuration
│   │   └── postcss.config.js  # 📦 PostCSS configuration
│   └── data/
│       └── search-history.json # 💾 Search history storage
├── .gitignore                 # 🚫 Git ignore patterns
├── README.md                  # 📖 Project documentation
└── CONTRIBUTING.md            # 🤝 Development workflow guidelines
```

## 🛠️ Technologies Used

### Frontend Stack
- **⚛️ React.js** - Modern component-based UI framework
- **🎨 Tailwind CSS** - Utility-first CSS framework for rapid styling
- **🎯 Lucide React** - Beautiful, customizable icon library
- **🔄 React Router** - Client-side routing for SPA navigation
- **🌙 Context API** - State management for theme and app state

### Backend Stack
- **🟢 Node.js** - JavaScript runtime environment
- **🚀 Express.js** - Fast, unopinionated web framework
- **📡 Axios** - Promise-based HTTP client for API requests
- **🔄 Concurrently** - Run multiple npm scripts simultaneously

### Development Tools
- **📦 Create React App** - Modern React build toolchain
- **🎨 PostCSS** - CSS transformation and processing
- **🔧 Nodemon** - Development server with auto-reload
- **📝 Git Flow** - Professional branching strategy

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Quick Start

1. **📥 Clone the repository**:
   ```bash
   git clone https://github.com/smithgun/google-dork-builder.git
   cd google-dork-builder
   ```

2. **📦 Install dependencies**:
   ```bash
   # Install server dependencies
   cd interface
   npm install

   # Install client dependencies
   cd client
   npm install
   ```

3. **🚀 Start development servers**:
   ```bash
   # From the interface directory
   npm run dev
   ```
   This will start both:
   - **Backend server**: http://localhost:5000
   - **Frontend app**: http://localhost:3001

4. **🌐 Access the application**:
   - **Primary URL**: http://localhost:3001
   - **API Endpoint**: http://localhost:5000

### Alternative Setup (Manual)

If you encounter port conflicts:

```bash
# Terminal 1: Start backend
cd interface
npm run server

# Terminal 2: Start frontend (different port if needed)
cd interface/client
set PORT=3002 && npm start  # Windows
PORT=3002 npm start         # macOS/Linux
```

### 🔧 Troubleshooting

**Port Conflicts:**
```bash
# Check what's using ports
netstat -ano | findstr :5000
netstat -ano | findstr :3001

# Kill process if needed (Windows)
taskkill /PID <PID_NUMBER> /F
```

**Missing Dependencies:**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📖 Usage Guide

### 🎯 Building Custom Dorks

#### 1. **Template-Based Approach** (Recommended for beginners)
- Browse the **8 enhanced templates** in the Template Library
- Click "Use Template" to load pre-built dork patterns
- Customize values to match your target

#### 2. **Visual Builder** (Advanced users)
- Select operator category (Basic, Advanced, Security, etc.)
- Add operators using the "Add Component" interface
- Combine multiple operators with logical connections
- Real-time preview shows your final dork query

#### 3. **Quick Operators Sidebar**
- Click any operator in the sidebar to instantly add it
- Color-coded risk levels help you understand impact
- Hover for examples and descriptions

### 🛡️ Risk Assessment System

Our enhanced risk system helps you understand the security implications:

- 🟢 **Low Risk**: Safe for general use, publicly available information
  - Example: `site:example.com`, `related:example.com`
- 🟡 **Medium Risk**: Use with caution, may find sensitive directories
  - Example: `filetype:pdf`, `intitle:"index of"`
- 🟠 **High Risk**: May find sensitive data, ensure you have permission
  - Example: `inurl:login`, `filetype:log`, `intext:password`
- 🔴 **Critical Risk**: High security risk, professional use only
  - Example: `filetype:sql`, `inurl:admin`, `filetype:env`

### 📊 Example Use Cases

#### 🔒 **Security Research**
```bash
# Find admin panels on a specific domain
site:example.com inurl:admin OR inurl:login

# Discover exposed configuration files
site:example.com filetype:env OR filetype:config
```

#### 📄 **Content Discovery**
```bash
# Find PDF documents
site:example.com filetype:pdf

# Discover directory listings
site:example.com intitle:"index of"
```

#### 🏢 **Competitive Analysis**
```bash
# Find competitor documents
site:competitor.com filetype:doc OR filetype:pdf

# Discover related websites
related:competitor.com
```

### 💾 **Save & History Features**

- **Save Custom Dorks**: Use the "Save" button to store your creations
- **Search History**: Automatically tracks all executed searches
- **Quick Reuse**: Click "Load Dork" or "Reuse" to apply previous searches
- **Export/Import**: Save dorks locally for backup or sharing

## Security & Ethics

⚠️ **Important**: This tool is designed for legitimate security research and content discovery. Always ensure you have proper authorization before using dorks on systems you don't own.

### Responsible Use Guidelines

- Only use on systems you own or have explicit permission to test
- Respect robots.txt and website terms of service
- Don't use for malicious purposes or unauthorized access
- Be mindful of the impact on target systems
- Follow applicable laws and regulations

## 🤝 Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### 🔄 **Development Workflow**

We follow **Git Flow** branching strategy:

- **`main`** - Production-ready releases only
- **`develop`** - Integration branch for new features  
- **`feature/*`** - Individual feature development
- **`hotfix/*`** - Critical production fixes

### 🚀 **Quick Contribution Steps**

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout develop
   git checkout -b feature/amazing-new-feature
   ```
3. **Make your changes and commit**:
   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   ```
4. **Push and create Pull Request**:
   ```bash
   git push origin feature/amazing-new-feature
   ```
5. **Open PR** targeting `develop` branch

### 🎯 **Areas for Contribution**

- 🔧 **New Dork Templates** - Add more security research patterns
- 🎨 **UI/UX Improvements** - Enhance user experience
- 📚 **Documentation** - Improve guides and examples
- 🐛 **Bug Fixes** - Fix issues and improve stability
- ⚡ **Performance** - Optimize loading and responsiveness
- 🧪 **Testing** - Add unit and integration tests

### 📝 **Commit Message Convention**

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style/formatting
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer & Legal Notice

🚨 **Important**: This tool is provided for **educational and legitimate security research purposes only**.

### 🎯 **Intended Use**
- Authorized penetration testing
- Security research on owned systems
- Educational cybersecurity learning
- Content discovery on public websites
- Competitive analysis with proper permissions

### 🚫 **Prohibited Activities**
- Unauthorized access to systems
- Malicious data harvesting
- Violation of website terms of service
- Any illegal or unethical activities

### 👨‍💻 **Developer Responsibility**
The developers are **not responsible** for any misuse of this software. Users are **solely responsible** for ensuring their usage complies with:
- Applicable laws and regulations
- Website terms of service
- Ethical hacking guidelines
- Professional codes of conduct

## 🌟 Support the Project

If you find GDork helpful for your security research, please consider:

- ⭐ **Starring the repository** - Help others discover this tool
- 🐛 **Reporting bugs** - Help us improve stability
- 💡 **Suggesting features** - Share your ideas for enhancements
- 🤝 **Contributing code** - Join our development community
- 📢 **Sharing with colleagues** - Spread the word responsibly

### 📞 **Need Help?**

- 📖 **Documentation**: Check our detailed guides above
- 🐛 **Bug Reports**: [Open an issue](https://github.com/smithgun/google-dork-builder/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/smithgun/google-dork-builder/discussions)
- 📧 **Security Issues**: Report privately to maintain responsible disclosure

---

<div align="center">

**🔍 Happy Ethical Dorking! �️**

*Built with ❤️ for the cybersecurity community*

[![GitHub Stars](https://img.shields.io/github/stars/smithgun/google-dork-builder?style=social)](https://github.com/smithgun/google-dork-builder)

</div>
