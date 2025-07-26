import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import DorkDashboard from './components/DorkDashboard';
import DorkBuilder from './components/DorkBuilder';
import CategoryView from './components/CategoryView';
import SearchHistory from './components/SearchHistory';
import Documentation from './components/Documentation';
import Subfinder from './components/Subfinder';
import Canvas from './components/Canvas';

function App() {
  const [searchHistory, setSearchHistory] = useState([]);

  const addToHistory = (searchItem) => {
    setSearchHistory(prev => [searchItem, ...prev.slice(0, 49)]);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route 
              path="/" 
              element={<DorkDashboard addToHistory={addToHistory} />} 
            />
            <Route 
              path="/builder" 
              element={<DorkBuilder addToHistory={addToHistory} />} 
            />
            <Route 
              path="/subfinder" 
              element={<Subfinder addToHistory={addToHistory} />} 
            />
            <Route 
              path="/canvas" 
              element={<Canvas addToHistory={addToHistory} />} 
            />
            <Route 
              path="/category/:categoryId" 
              element={<CategoryView addToHistory={addToHistory} />} 
            />
            <Route 
              path="/history" 
              element={<SearchHistory history={searchHistory} />} 
            />
            <Route 
              path="/docs" 
              element={<Documentation />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;