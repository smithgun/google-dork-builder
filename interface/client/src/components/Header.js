import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Shield, Home, Wrench, History, BookOpen, Workflow } from 'lucide-react';

function Header() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <header className="bg-white shadow-lg border-b-2" style={{borderBottomColor: 'rgb(0, 0, 255)'}}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 rounded-lg" style={{background: 'linear-gradient(135deg, rgb(0, 0, 255), rgb(51, 51, 255))'}}>
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold" style={{color: 'rgb(0, 0, 255)'}}>GDork</span>
              <span className="text-sm ml-2" style={{color: 'rgb(102, 102, 255)'}}>OSINT Tool</span>
            </div>
          </Link>
          
          <nav className="flex items-center space-x-2">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive('/') 
                  ? 'text-white shadow-md' 
                  : 'hover:bg-blue-50'
              }`}
              style={isActive('/') ? {backgroundColor: 'rgb(0, 0, 255)'} : {color: 'rgb(0, 0, 255)'}}
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            
            <Link 
              to="/builder" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive('/builder') 
                  ? 'text-white shadow-md' 
                  : 'hover:bg-blue-50'
              }`}
              style={isActive('/builder') ? {backgroundColor: 'rgb(0, 0, 255)'} : {color: 'rgb(0, 0, 255)'}}
            >
              <Wrench className="h-4 w-4" />
              <span>Builder</span>
            </Link>
            
            <Link 
              to="/subfinder" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive('/subfinder') 
                  ? 'text-white shadow-md' 
                  : 'hover:bg-blue-50'
              }`}
              style={isActive('/subfinder') ? {backgroundColor: 'rgb(0, 0, 255)'} : {color: 'rgb(0, 0, 255)'}}
            >
              <Search className="h-4 w-4" />
              <span>Subfinder</span>
            </Link>
            
            <Link 
              to="/canvas" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive('/canvas') 
                  ? 'text-white shadow-md' 
                  : 'hover:bg-blue-50'
              }`}
              style={isActive('/canvas') ? {backgroundColor: 'rgb(0, 0, 255)'} : {color: 'rgb(0, 0, 255)'}}
            >
              <Workflow className="h-4 w-4" />
              <span>Canvas</span>
            </Link>
            
            <Link 
              to="/history" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive('/history') 
                  ? 'text-white shadow-md' 
                  : 'hover:bg-blue-50'
              }`}
              style={isActive('/history') ? {backgroundColor: 'rgb(0, 0, 255)'} : {color: 'rgb(0, 0, 255)'}}
            >
              <History className="h-4 w-4" />
              <span>History</span>
            </Link>
            
            <Link 
              to="/docs" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive('/docs') 
                  ? 'text-white shadow-md' 
                  : 'hover:bg-blue-50'
              }`}
              style={isActive('/docs') ? {backgroundColor: 'rgb(0, 0, 255)'} : {color: 'rgb(0, 0, 255)'}}
            >
              <BookOpen className="h-4 w-4" />
              <span>Docs</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;