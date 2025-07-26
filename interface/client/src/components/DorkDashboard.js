import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileText, Shield, Server, Camera, AlertTriangle, ExternalLink, Database, Cloud } from 'lucide-react';
import axios from 'axios';

const categoryIcons = {
  files: FileText,
  vulnerabilities: AlertTriangle,
  sensitive: Shield,
  servers: Server,
  cameras: Camera,
  databases: Database,
  cloud: Cloud
};

const getRiskColor = (risk) => {
  switch(risk) {
    case 'critical': return 'text-red-700 bg-red-100 border-red-200';
    case 'high': return 'text-red-600 bg-red-50 border-red-200';
    case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'low': return 'text-green-600 bg-green-50 border-green-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

function DorkDashboard({ addToHistory }) {
  const [categories, setCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/dorks');
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  const executeSearch = async (query, site = '') => {
    try {
      const response = await axios.post('/api/search', { query, site });
      addToHistory(response.data);
      window.open(response.data.url, '_blank');
    } catch (error) {
      console.error('Error executing search:', error);
    }
  };

  const filteredDorks = () => {
    let allDorks = [];
    
    Object.entries(categories).forEach(([key, category]) => {
      if (selectedCategory === 'all' || selectedCategory === key) {
        category.dorks.forEach(dork => {
          allDorks.push({ ...dork, category: key, categoryName: category.name });
        });
      }
    });

    if (searchTerm) {
      allDorks = allDorks.filter(dork => 
        dork.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dork.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return allDorks;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="gradient-header rounded-xl p-8 text-white mb-6">
          <h1 className="text-4xl font-bold mb-2 text-white">Google Dork OSINT Tool</h1>
          <p className="text-white">Discover information through advanced Google search techniques</p>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-navy-400" />
              <input
                type="text"
                placeholder="Search dorks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              <option value="all">All Categories</option>
              {Object.entries(categories).map(([key, category]) => (
                <option key={key} value={key}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {Object.entries(categories).map(([key, category]) => {
            const Icon = categoryIcons[key] || FileText;
            return (
              <Link
                key={key}
                to={`/category/${key}`}
                className="block p-6 bg-gradient-to-br from-white to-navy-50 rounded-xl hover:shadow-xl transition-all duration-300 border border-navy-100 hover:border-navy-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-navy-900 rounded-lg">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900 text-lg">{category.name}</h3>
                    <p className="text-sm text-navy-600">{category.dorks.length} dorks available</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDorks().map((dork, index) => (
          <div key={index} className="dork-item">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="category-badge">{dork.categoryName}</span>
                {dork.risk && (
                  <span className={`text-xs px-2 py-1 rounded-full border ${getRiskColor(dork.risk)}`}>
                    {dork.risk}
                  </span>
                )}
              </div>
              <button
                onClick={() => executeSearch(dork.query)}
                className="text-navy-600 hover:text-navy-800 p-2 hover:bg-navy-50 rounded-lg transition-colors"
                title="Execute search"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <code className="text-sm bg-navy-50 border border-navy-200 px-3 py-2 rounded-lg block font-mono text-navy-800 break-all">
                {dork.query}
              </code>
              <p className="text-sm text-navy-600 leading-relaxed">{dork.description}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredDorks().length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No dorks found matching your search criteria</p>
        </div>
      )}
    </div>
  );
}

export default DorkDashboard;