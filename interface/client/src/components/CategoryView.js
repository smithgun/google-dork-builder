import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Search, Copy } from 'lucide-react';
import axios from 'axios';

function CategoryView({ addToHistory }) {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [siteFilter, setSiteFilter] = useState('');

  useEffect(() => {
    fetchCategory();
  }, [categoryId]);

  const fetchCategory = async () => {
    try {
      const response = await axios.get(`/api/dorks/${categoryId}`);
      setCategory(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching category:', error);
      setLoading(false);
    }
  };

  const executeSearch = async (query) => {
    try {
      const response = await axios.post('/api/search', { 
        query, 
        site: siteFilter 
      });
      addToHistory(response.data);
      window.open(response.data.url, '_blank');
    } catch (error) {
      console.error('Error executing search:', error);
    }
  };

  const copyQuery = (query) => {
    let fullQuery = query;
    if (siteFilter) {
      fullQuery = `${query} site:${siteFilter}`;
    }
    navigator.clipboard.writeText(fullQuery);
  };

  const filteredDorks = () => {
    if (!category) return [];
    
    return category.dorks.filter(dork => 
      dork.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dork.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Category not found</p>
        <Link to="/" className="btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-primary-600 hover:text-primary-700">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
          <p className="text-gray-600">{category.dorks.length} dorks available</p>
        </div>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search dorks in this category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Filter by site (e.g., example.com)"
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDorks().map((dork, index) => (
            <div key={index} className="dork-item">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                      {dork.query}
                      {siteFilter && (
                        <span className="text-primary-600"> site:{siteFilter}</span>
                      )}
                    </code>
                    <button
                      onClick={() => copyQuery(dork.query)}
                      className="text-gray-500 hover:text-gray-700 p-1"
                      title="Copy query"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">{dork.description}</p>
                </div>
                <button
                  onClick={() => executeSearch(dork.query)}
                  className="text-primary-600 hover:text-primary-700 p-1 ml-2"
                  title="Execute search"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
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

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Tips for {category.name}</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start space-x-2">
            <span className="text-primary-600">•</span>
            <span>Use quotes to search for exact phrases</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-primary-600">•</span>
            <span>Combine multiple operators for more specific results</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-primary-600">•</span>
            <span>Use the site filter to limit results to specific domains</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-primary-600">•</span>
            <span>Remember that results may vary based on your location and Google's index</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryView;