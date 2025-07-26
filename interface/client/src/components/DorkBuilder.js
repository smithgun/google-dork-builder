import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, ExternalLink, Copy, Search, Shield, Info, 
  AlertTriangle, BookOpen, Target, Eye, Play, Save, Download, 
  Upload, History, Settings, Zap, ChevronDown, ChevronRight,
  Code, Database, FileText, Globe, Key, Lock, Filter, Star
} from 'lucide-react';
import axios from 'axios';

const dorkOperators = [
  // Basic Operators
  { operator: 'site:', description: 'Search specific domain', example: 'site:example.com', risk: 'low', category: 'basic' },
  { operator: 'filetype:', description: 'Search for specific file types', example: 'filetype:pdf', risk: 'medium', category: 'basic' },
  { operator: 'inurl:', description: 'Find pages with term in URL', example: 'inurl:admin', risk: 'medium', category: 'basic' },
  { operator: 'intext:', description: 'Find pages with term in text', example: 'intext:password', risk: 'high', category: 'basic' },
  { operator: 'intitle:', description: 'Find pages with term in title', example: 'intitle:"index of"', risk: 'medium', category: 'basic' },
  
  // Advanced Operators
  { operator: 'cache:', description: 'Show cached version', example: 'cache:example.com', risk: 'low', category: 'advanced' },
  { operator: 'related:', description: 'Find related sites', example: 'related:example.com', risk: 'low', category: 'advanced' },
  { operator: 'info:', description: 'Get info about site', example: 'info:example.com', risk: 'low', category: 'advanced' },
  { operator: 'link:', description: 'Find pages linking to site', example: 'link:example.com', risk: 'low', category: 'advanced' },
  { operator: 'define:', description: 'Get definition', example: 'define:osint', risk: 'low', category: 'advanced' },
  
  // File & Extension Operators
  { operator: 'ext:', description: 'Search file extensions', example: 'ext:log', risk: 'medium', category: 'files' },
  { operator: 'allintext:', description: 'All terms in text', example: 'allintext:admin login', risk: 'high', category: 'files' },
  { operator: 'allinurl:', description: 'All terms in URL', example: 'allinurl:admin panel', risk: 'medium', category: 'files' },
  { operator: 'allintitle:', description: 'All terms in title', example: 'allintitle:index of', risk: 'medium', category: 'files' },
  
  // Security-focused Operators
  { operator: 'inurl:admin', description: 'Find admin panels', example: 'inurl:admin login', risk: 'critical', category: 'security' },
  { operator: 'inurl:login', description: 'Find login pages', example: 'inurl:login.php', risk: 'high', category: 'security' },
  { operator: 'inurl:config', description: 'Find config files', example: 'inurl:config.php', risk: 'critical', category: 'security' },
  { operator: 'filetype:sql', description: 'Find SQL files', example: 'filetype:sql', risk: 'critical', category: 'security' },
  { operator: 'filetype:env', description: 'Find environment files', example: 'filetype:env', risk: 'critical', category: 'security' },
  { operator: 'filetype:log', description: 'Find log files', example: 'filetype:log', risk: 'high', category: 'security' },
  
  // Logical Operators
  { operator: '-', description: 'Exclude terms', example: '-site:example.com', risk: 'low', category: 'logical' },
  { operator: 'OR', description: 'Logical OR operator', example: 'cats OR dogs', risk: 'low', category: 'logical' },
  { operator: 'AND', description: 'Logical AND operator', example: 'cats AND dogs', risk: 'low', category: 'logical' },
  { operator: '"..."', description: 'Exact phrase search', example: '"exact phrase"', risk: 'low', category: 'logical' },
  { operator: '*', description: 'Wildcard operator', example: 'admin*panel', risk: 'medium', category: 'logical' },
  { operator: '()', description: 'Group terms', example: '(admin OR login)', risk: 'low', category: 'logical' }
];

const dorkTemplates = [
  {
    name: 'Admin Panel Finder',
    description: 'Find admin panels and login pages',
    template: 'inurl:admin OR inurl:login OR inurl:administrator',
    risk: 'high',
    category: 'security',
    icon: <Shield className="h-5 w-5" />
  },
  {
    name: 'Directory Listing',
    description: 'Find open directory listings',
    template: 'intitle:"index of" OR intitle:"directory listing"',
    risk: 'medium',
    category: 'files',
    icon: <FileText className="h-5 w-5" />
  },
  {
    name: 'Exposed Databases',
    description: 'Find exposed database files',
    template: 'filetype:sql OR filetype:db OR filetype:mdb',
    risk: 'critical',
    category: 'security',
    icon: <Database className="h-5 w-5" />
  },
  {
    name: 'Configuration Files',
    description: 'Find configuration and environment files',
    template: 'filetype:env OR filetype:config OR filetype:ini',
    risk: 'critical',
    category: 'security',
    icon: <Settings className="h-5 w-5" />
  },
  {
    name: 'Log Files',
    description: 'Find log files that may contain sensitive info',
    template: 'filetype:log OR filetype:txt intext:password',
    risk: 'high',
    category: 'security',
    icon: <FileText className="h-5 w-5" />
  },
  {
    name: 'Backup Files',
    description: 'Find backup files that might contain sensitive data',
    template: 'filetype:bak OR filetype:backup OR filetype:old',
    risk: 'high',
    category: 'security',
    icon: <Save className="h-5 w-5" />
  },
  {
    name: 'Email Lists',
    description: 'Find email addresses and contact lists',
    template: 'filetype:csv OR filetype:xls intext:email',
    risk: 'medium',
    category: 'data',
    icon: <Globe className="h-5 w-5" />
  },
  {
    name: 'Camera/IoT Devices',
    description: 'Find exposed camera and IoT device interfaces',
    template: 'inurl:"/view/view.shtml" OR inurl:"/ViewerFrame?Mode=" OR intitle:"Live View / - AXIS"',
    risk: 'critical',
    category: 'security',
    icon: <Eye className="h-5 w-5" />
  }
];

const exampleUseCases = [
  {
    title: 'Security Research',
    description: 'Find vulnerabilities in public websites',
    examples: [
      { dork: 'site:example.com filetype:sql', purpose: 'Find SQL files on specific domain' },
      { dork: 'inurl:admin site:example.com', purpose: 'Find admin panels on target site' }
    ]
  },
  {
    title: 'Content Discovery',
    description: 'Discover hidden or exposed content',
    examples: [
      { dork: 'intitle:"index of" site:example.com', purpose: 'Find directory listings' },
      { dork: 'filetype:pdf site:example.com', purpose: 'Find PDF documents' }
    ]
  },
  {
    title: 'Competitive Analysis',
    description: 'Research competitor websites',
    examples: [
      { dork: 'site:competitor.com filetype:doc OR filetype:pdf', purpose: 'Find competitor documents' },
      { dork: 'related:competitor.com', purpose: 'Find similar websites' }
    ]
  }
];

function DorkBuilder({ addToHistory }) {
  const [dorkParts, setDorkParts] = useState([{ operator: '', value: '' }]);
  const [builtDork, setBuiltDork] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showTemplates, setShowTemplates] = useState(true);
  const [showExamples, setShowExamples] = useState(false);
  const [savedDorks, setSavedDorks] = useState([]);
  const [dorkHistory, setDorkHistory] = useState([]);
  const [validation, setValidation] = useState(null);
  const [collapsedSections, setCollapsedSections] = useState({});

  useEffect(() => {
    loadSavedDorks();
    loadDorkHistory();
  }, []);

  useEffect(() => {
    if (builtDork) {
      validateDork(builtDork);
    }
  }, [builtDork]);

  const loadSavedDorks = () => {
    const saved = localStorage.getItem('savedDorks');
    if (saved) {
      setSavedDorks(JSON.parse(saved));
    }
  };

  const loadDorkHistory = () => {
    const history = localStorage.getItem('dorkHistory');
    if (history) {
      setDorkHistory(JSON.parse(history));
    }
  };

  const validateDork = (dork) => {
    if (!dork) return;
    
    // Simple validation logic
    let riskLevel = 'low';
    const criticalOperators = ['filetype:sql', 'filetype:env', 'inurl:admin', 'inurl:config'];
    const highRiskOperators = ['intext:password', 'inurl:login', 'filetype:log'];
    
    if (criticalOperators.some(op => dork.includes(op))) {
      riskLevel = 'critical';
    } else if (highRiskOperators.some(op => dork.includes(op))) {
      riskLevel = 'high';
    } else if (dork.includes('filetype:') || dork.includes('inurl:')) {
      riskLevel = 'medium';
    }

    setValidation({
      valid: true,
      riskLevel,
      suggestions: riskLevel === 'critical' ? ['Use with extreme caution', 'Consider adding site restrictions'] : 
                  riskLevel === 'high' ? ['Use responsibly', 'Ensure you have permission'] : 
                  ['Safe for general use'],
      issues: []
    });
  };

  const buildDork = (parts = dorkParts) => {
    const dorkString = parts
      .filter(part => part.operator && part.value)
      .map(part => {
        if (part.operator === '"..."') {
          return `"${part.value}"`; 
        } else if (part.operator === '()') {
          return `(${part.value})`;
        } else {
          return `${part.operator}${part.value}`;
        }
      })
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
      addToDorkHistory(builtDork);
      
      window.open(response.data.url, '_blank');
    } catch (error) {
      console.error('Error executing search:', error);
      // Fallback to Google search
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(builtDork)}`;
      window.open(searchUrl, '_blank');
      
      // Add to history anyway
      addToDorkHistory(builtDork);
      addToHistory({
        query: builtDork,
        url: searchUrl,
        timestamp: new Date().toISOString()
      });
    }
  };

  const addToDorkHistory = (dork) => {
    const historyEntry = {
      dork,
      timestamp: new Date().toISOString(),
      description: description || 'Custom dork'
    };
    
    const updated = [historyEntry, ...dorkHistory.slice(0, 49)];
    setDorkHistory(updated);
    localStorage.setItem('dorkHistory', JSON.stringify(updated));
  };

  const copyDork = () => {
    navigator.clipboard.writeText(builtDork);
    alert('Dork copied to clipboard!');
  };

  const saveDork = () => {
    if (!builtDork.trim()) {
      alert('Please build a dork first');
      return;
    }

    const newDork = {
      id: Date.now(),
      dork: builtDork,
      description: description || 'Custom dork',
      created: new Date().toISOString(),
      risk: validation?.riskLevel || 'unknown',
      category: selectedCategory
    };

    const updated = [...savedDorks, newDork];
    setSavedDorks(updated);
    localStorage.setItem('savedDorks', JSON.stringify(updated));
    alert('Dork saved successfully!');
  };

  const loadTemplate = (template) => {
    setBuiltDork(template.template);
    setDescription(template.description);
    
    // Parse template back into parts for better editing
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

  const filteredOperators = selectedCategory === 'all' 
    ? dorkOperators 
    : dorkOperators.filter(op => op.category === selectedCategory);

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

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
          Advanced Google Dork Builder
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Create powerful Google search queries with advanced operators and templates. 
          Build, test, and save your custom dorks for security research and content discovery.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            showTemplates ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <BookOpen className="h-5 w-5 inline mr-2" />
          Templates
        </button>
        <button
          onClick={() => setShowExamples(!showExamples)}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            showExamples ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Code className="h-5 w-5 inline mr-2" />
          Examples
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main Builder Section */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Templates Section */}
          {showTemplates && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                <h3 className="text-xl font-semibold flex items-center">
                  <BookOpen className="h-6 w-6 mr-3" />
                  Dork Templates
                </h3>
                <p className="text-blue-100 mt-2">Ready-to-use dork patterns for common security research tasks</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dorkTemplates.map((template, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all hover:border-blue-300">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-blue-600">
                            {template.icon}
                          </div>
                          <h4 className="font-semibold text-gray-900">{template.name}</h4>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full flex items-center space-x-1 ${getRiskColor(template.risk)}`}>
                          {getRiskIcon(template.risk)}
                          <span className="capitalize">{template.risk}</span>
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                      
                      <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm mb-4 overflow-x-auto">
                        {template.template}
                      </div>
                      
                      <button
                        onClick={() => loadTemplate(template)}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Play className="h-4 w-4" />
                        <span>Use Template</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Examples Section */}
          {showExamples && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
                <h3 className="text-xl font-semibold flex items-center">
                  <Code className="h-6 w-6 mr-3" />
                  Use Case Examples
                </h3>
                <p className="text-green-100 mt-2">Learn how to use dorks effectively for different scenarios</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {exampleUseCases.map((useCase, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-5">
                      <h4 className="font-semibold text-gray-900 mb-2">{useCase.title}</h4>
                      <p className="text-sm text-gray-600 mb-4">{useCase.description}</p>
                      <div className="space-y-3">
                        {useCase.examples.map((example, exIndex) => (
                          <div key={exIndex} className="bg-gray-50 p-3 rounded-lg">
                            <code className="text-sm font-mono text-blue-600 block mb-1">
                              {example.dork}
                            </code>
                            <p className="text-xs text-gray-500">{example.purpose}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Dork Builder */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6">
              <h3 className="text-xl font-semibold flex items-center">
                <Target className="h-6 w-6 mr-3" />
                Build Your Custom Dork
              </h3>
              <p className="text-purple-100 mt-2">Combine operators to create powerful search queries</p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Category Filter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Operator Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="basic">Basic Operators</option>
                    <option value="advanced">Advanced Operators</option>
                    <option value="files">File Operators</option>
                    <option value="security">Security Focused</option>
                    <option value="logical">Logical Operators</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your dork's purpose..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Dork Parts Builder */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Dork Components
                </h4>
                
                {dorkParts.map((part, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <select
                        value={part.operator}
                        onChange={(e) => updateDorkPart(index, 'operator', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="">Choose operator...</option>
                        {filteredOperators.map((op, opIndex) => (
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                
                <button
                  onClick={addDorkPart}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-gray-500 hover:border-purple-400 hover:text-purple-600 transition-colors group"
                >
                  <Plus className="h-6 w-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Add Another Component</span>
                </button>
              </div>

              {/* Generated Dork Preview */}
              <div className="bg-gray-900 rounded-lg p-6">
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Generated Dork Preview
                </h4>
                <div className="bg-black rounded-lg p-4 font-mono text-sm">
                  <div className="text-gray-400 mb-2">$ google-dork-search</div>
                  <div className="text-green-400 break-all">
                    {builtDork || 'Your custom dork will appear here...'}
                  </div>
                </div>
              </div>

              {/* Validation Results */}
              {validation && (
                <div className={`p-4 rounded-lg border-2 ${
                  validation.riskLevel === 'critical' ? 'bg-red-50 border-red-200' :
                  validation.riskLevel === 'high' ? 'bg-orange-50 border-orange-200' :
                  validation.riskLevel === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-green-50 border-green-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {getRiskIcon(validation.riskLevel)}
                    <span className="font-medium">
                      Risk Level: <span className="capitalize">{validation.riskLevel}</span>
                    </span>
                  </div>
                  {validation.suggestions && (
                    <ul className="text-sm space-y-1">
                      {validation.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <span className="w-1 h-1 bg-current rounded-full"></span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={executeSearch}
                  disabled={!builtDork.trim()}
                  className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
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

                <button
                  onClick={saveDork}
                  disabled={!builtDork.trim()}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Quick Operators */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4">
              <h3 className="text-lg font-semibold">Quick Operators</h3>
              <p className="text-indigo-100 text-sm mt-1">Click to add instantly</p>
            </div>
            
            <div className="p-4 space-y-2">
              {filteredOperators.slice(0, 8).map((op, index) => (
                <button
                  key={index}
                  onClick={() => addOperator(op.operator)}
                  className={`w-full text-left p-3 rounded-lg border-2 hover:shadow-md transition-all ${getRiskColor(op.risk)}`}
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

          {/* Saved Dorks */}
          {savedDorks.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Saved Dorks
                </h3>
              </div>
              
              <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                {savedDorks.slice(0, 5).map((saved, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{saved.description}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(saved.risk)}`}>
                        {saved.risk}
                      </span>
                    </div>
                    <code className="text-xs bg-gray-100 p-2 rounded block break-all mb-2">
                      {saved.dork}
                    </code>
                    <button
                      onClick={() => {
                        setBuiltDork(saved.dork);
                        setDescription(saved.description);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Load Dork
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent History */}
          {dorkHistory.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  Recent History
                </h3>
              </div>
              
              <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                {dorkHistory.slice(0, 5).map((entry, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <code className="text-xs bg-gray-100 p-2 rounded block break-all mb-2">
                      {entry.dork}
                    </code>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => {
                          setBuiltDork(entry.dork);
                          setDescription(entry.description);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Reuse
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risk Legend */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4">
              <h3 className="text-lg font-semibold">Risk Levels</h3>
            </div>
            
            <div className="p-4 space-y-3">
              {[
                { level: 'low', description: 'Safe for general use', color: 'green' },
                { level: 'medium', description: 'Use with caution', color: 'yellow' },
                { level: 'high', description: 'May find sensitive data', color: 'orange' },
                { level: 'critical', description: 'High security risk', color: 'red' }
              ].map((risk, index) => (
                <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${getRiskColor(risk.level)}`}>
                  {getRiskIcon(risk.level)}
                  <div>
                    <div className="font-medium text-sm capitalize">{risk.level}</div>
                    <div className="text-xs opacity-90">{risk.description}</div>
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

export default DorkBuilder;