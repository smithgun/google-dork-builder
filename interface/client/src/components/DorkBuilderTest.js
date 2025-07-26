import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, ExternalLink, Copy, Search, Shield, Info, 
  AlertTriangle, BookOpen, Target, Eye, Play
} from 'lucide-react';
import axios from 'axios';

const dorkOperators = [
  // Essential operators with clean categorization
  { operator: 'site:', description: 'Search specific domain', example: 'site:example.com', risk: 'low' },
  { operator: 'filetype:', description: 'Search for specific file types', example: 'filetype:pdf', risk: 'medium' },
  { operator: 'inurl:', description: 'Find pages with term in URL', example: 'inurl:admin', risk: 'medium' },
  { operator: 'intext:', description: 'Find pages with term in text', example: 'intext:password', risk: 'high' },
  { operator: 'intitle:', description: 'Find pages with term in title', example: 'intitle:"index of"', risk: 'medium' },
  { operator: 'cache:', description: 'Show cached version', example: 'cache:example.com', risk: 'low' },
  { operator: 'related:', description: 'Find related sites', example: 'related:example.com', risk: 'low' },
  { operator: 'ext:', description: 'Search file extensions', example: 'ext:log', risk: 'medium' },
  { operator: 'allintext:', description: 'All terms in text', example: 'allintext:admin login', risk: 'high' },
  { operator: 'allintitle:', description: 'All terms in title', example: 'allintitle:index of', risk: 'medium' },
  { operator: '-', description: 'Exclude terms', example: '-site:example.com', risk: 'low' },
  { operator: '"..."', description: 'Exact phrase search', example: '"exact phrase"', risk: 'low' },
];

const quickTemplates = [
  {
    name: 'Admin Panel Finder',
    template: 'inurl:admin OR inurl:login',
    description: 'Find admin and login pages',
    risk: 'high'
  },
  {
    name: 'Directory Listing',
    template: 'intitle:"index of"',
    description: 'Find open directory listings',
    risk: 'medium'
  },
  {
    name: 'Configuration Files',
    template: 'filetype:env OR filetype:config',
    description: 'Find config files',
    risk: 'high'
  },
  {
    name: 'Log Files',
    template: 'filetype:log',
    description: 'Find log files',
    risk: 'medium'
  },
  {
    name: 'Database Files',
    template: 'filetype:sql OR filetype:db',
    description: 'Find database files',
    risk: 'critical'
  },
  {
    name: 'Backup Files',
    template: 'filetype:bak OR filetype:backup',
    description: 'Find backup files',
    risk: 'high'
  }
];

function DorkBuilderTest({ addToHistory }) {
  const [dorkParts, setDorkParts] = useState([{ operator: '', value: '' }]);
  const [builtDork, setBuiltDork] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  const buildDork = (parts = dorkParts) => {
    const dorkString = parts
      .filter(part => part.operator && part.value)
      .map(part => `${part.operator}${part.value}`)
      .join(' ');
    
    setBuiltDork(dorkString);
  };

  const executeSearch = async () => {
    if (!builtDork.trim()) return;
    
    try {
      const response = await axios.post('/api/search', { 
        query: builtDork
      });
      addToHistory(response.data);
      
      window.open(response.data.url, '_blank');
    } catch (error) {
      console.error('Error executing search:', error);
      // For demo purposes, create a mock Google search URL
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(builtDork)}`;
      window.open(searchUrl, '_blank');
    }
  };

  const copyDork = () => {
    navigator.clipboard.writeText(builtDork);
    alert('Dork copied to clipboard!');
  };

  const addOperator = (operator) => {
    const emptyIndex = dorkParts.findIndex(part => !part.operator);
    if (emptyIndex !== -1) {
      updateDorkPart(emptyIndex, 'operator', operator);
    } else {
      setDorkParts([...dorkParts, { operator, value: '' }]);
    }
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-300';
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'low': return 'text-green-700 bg-green-100 border-green-300';
      default: return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const getRiskIcon = (risk) => {
    switch(risk) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Info className="h-4 w-4" />;
      case 'low': return <Shield className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const addDorkPart = () => {
    setDorkParts([...dorkParts, { operator: '', value: '' }]);
  };

  const removeDorkPart = (index) => {
    if (dorkParts.length > 1) {
      setDorkParts(dorkParts.filter((_, i) => i !== index));
    }
  };

  const updateDorkPart = (index, field, value) => {
    const updated = dorkParts.map((part, i) => 
      i === index ? { ...part, [field]: value } : part
    );
    setDorkParts(updated);
    buildDork(updated);
  };

  const loadTemplate = (template) => {
    setBuiltDork(template.template);
    // Parse template back into parts for display
    const parts = template.template.split(' ').map(part => {
      const operator = dorkOperators.find(op => part.startsWith(op.operator));
      if (operator) {
        return {
          operator: operator.operator,
          value: part.substring(operator.operator.length)
        };
      }
      return { operator: '', value: part };
    });
    setDorkParts(parts.length > 0 ? parts : [{ operator: '', value: '' }]);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Google Dork Builder
        </h1>
        <p className="text-gray-600 text-lg">
          Build powerful search queries with visual operators
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Builder */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Dork Builder Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
              <h2 className="text-xl font-semibold flex items-center">
                <Target className="h-6 w-6 mr-2" />
                Build Your Dork
              </h2>
              <p className="text-blue-100 mt-1">Combine operators to create powerful searches</p>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Dork Parts */}
              {dorkParts.map((part, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <select
                      value={part.operator}
                      onChange={(e) => updateDorkPart(index, 'operator', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="">Choose operator...</option>
                      {dorkOperators.map((op, opIndex) => (
                        <option key={opIndex} value={op.operator}>
                          {op.operator} - {op.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex-1">
                    <input
                      type="text"
                      value={part.value}
                      onChange={(e) => updateDorkPart(index, 'value', e.target.value)}
                      placeholder="Enter search value..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <button
                    onClick={() => removeDorkPart(index)}
                    className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    disabled={dorkParts.length === 1}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
              
              {/* Add Part Button */}
              <button
                onClick={addDorkPart}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors group"
              >
                <Plus className="h-6 w-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Add Another Operator</span>
              </button>
            </div>
          </div>

          {/* Generated Dork Preview */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Generated Dork
              </h3>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <div className="mb-2 text-gray-400">$ google-dork</div>
                <div className="break-all">
                  {builtDork || 'Your dork will appear here...'}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={executeSearch}
                  disabled={!builtDork.trim()}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
                >
                  <Search className="h-5 w-5" />
                  <span>Execute Search</span>
                </button>
                
                <button
                  onClick={copyDork}
                  disabled={!builtDork.trim()}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Copy className="h-5 w-5" />
                  <span>Copy</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Quick Operators */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4">
              <h3 className="text-lg font-semibold">Quick Operators</h3>
              <p className="text-purple-100 text-sm mt-1">Click to add instantly</p>
            </div>
            
            <div className="p-4 grid grid-cols-1 gap-2">
              {dorkOperators.slice(0, 8).map((op, index) => (
                <button
                  key={index}
                  onClick={() => addOperator(op.operator)}
                  className={`text-left p-3 rounded-lg border-2 hover:shadow-md transition-all ${getRiskColor(op.risk)}`}
                  title={`${op.description} - Example: ${op.example}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm">{op.operator}</span>
                    {getRiskIcon(op.risk)}
                  </div>
                  <div className="text-xs mt-1 opacity-80">{op.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Templates */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
              <h3 className="text-lg font-semibold flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Quick Templates
              </h3>
              <p className="text-orange-100 text-sm mt-1">Ready-to-use dork patterns</p>
            </div>
            
            <div className="p-4 space-y-3">
              {quickTemplates.map((template, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm text-gray-900">{template.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full flex items-center space-x-1 ${getRiskColor(template.risk)}`}>
                      {getRiskIcon(template.risk)}
                      <span>{template.risk}</span>
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-3">{template.description}</p>
                  
                  <div className="bg-gray-100 p-2 rounded text-xs font-mono mb-3 break-all">
                    {template.template}
                  </div>
                  
                  <button
                    onClick={() => loadTemplate(template)}
                    className="w-full bg-orange-500 text-white px-3 py-2 rounded text-sm hover:bg-orange-600 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Play className="h-3 w-3" />
                    <span>Use Template</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Legend */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-4">
              <h3 className="text-lg font-semibold">Risk Levels</h3>
            </div>
            
            <div className="p-4 space-y-2">
              {[
                { level: 'low', description: 'Safe for general use', color: 'green' },
                { level: 'medium', description: 'Use with caution', color: 'yellow' },
                { level: 'high', description: 'May find sensitive data', color: 'orange' },
                { level: 'critical', description: 'High security risk', color: 'red' }
              ].map((risk, index) => (
                <div key={index} className={`flex items-center space-x-3 p-2 rounded ${getRiskColor(risk.level)}`}>
                  {getRiskIcon(risk.level)}
                  <div>
                    <div className="font-medium text-sm capitalize">{risk.level}</div>
                    <div className="text-xs opacity-80">{risk.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DorkBuilderTest;
