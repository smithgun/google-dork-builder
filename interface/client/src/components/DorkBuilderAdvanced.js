import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, ExternalLink, Copy, Code, AlertTriangle, Shield, Info, 
  Save, Download, Upload, History, BookOpen, Target, Zap, Eye, 
  Settings, Database, FileText, Globe, Search, Key, Lock, Play,
  RotateCcw, Filter, Star, ChevronDown, ChevronRight
} from 'lucide-react';
import axios from 'axios';

const dorkOperators = [
  // Basic Operators
  { operator: 'site:', description: 'Search specific domain', example: 'site:example.com', risk: 'low', category: 'basic' },
  { operator: 'filetype:', description: 'Search for specific file types', example: 'filetype:pdf', risk: 'medium', category: 'basic' },
  { operator: 'inurl:', description: 'Find pages with term in URL', example: 'inurl:admin', risk: 'medium', category: 'basic' },
  { operator: 'intext:', description: 'Find pages with term in text', example: 'intext:password', risk: 'high', category: 'basic' },
  { operator: 'intitle:', description: 'Find pages with term in title', example: 'intitle:index of', risk: 'medium', category: 'basic' },
  
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
  
  // Date and Range Operators
  { operator: 'daterange:', description: 'Search within date range', example: 'daterange:2450958-2451180', risk: 'low', category: 'temporal' },
  { operator: 'numrange:', description: 'Search within number range', example: 'numrange:1-100', risk: 'low', category: 'temporal' },
  { operator: 'author:', description: 'Find content by author', example: 'author:"john doe"', risk: 'low', category: 'temporal' },
  
  // Exclusion and Logical Operators
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
    category: 'security'
  },
  {
    name: 'Directory Listing',
    description: 'Find open directory listings',
    template: 'intitle:"index of" OR intitle:"directory listing"',
    risk: 'medium',
    category: 'files'
  },
  {
    name: 'Exposed Databases',
    description: 'Find exposed database files',
    template: 'filetype:sql OR filetype:db OR filetype:mdb',
    risk: 'critical',
    category: 'security'
  },
  {
    name: 'Configuration Files',
    description: 'Find configuration and environment files',
    template: 'filetype:env OR filetype:config OR filetype:ini',
    risk: 'critical',
    category: 'security'
  },
  {
    name: 'Log Files',
    description: 'Find log files that may contain sensitive info',
    template: 'filetype:log OR filetype:txt intext:password',
    risk: 'high',
    category: 'security'
  },
  {
    name: 'Email Lists',
    description: 'Find email addresses and contact lists',
    template: 'filetype:csv OR filetype:xls intext:email',
    risk: 'medium',
    category: 'data'
  },
  {
    name: 'PDF Documents',
    description: 'Search for PDF documents with specific content',
    template: 'filetype:pdf intext:confidential OR intext:internal',
    risk: 'medium',
    category: 'files'
  },
  {
    name: 'Backup Files',
    description: 'Find backup files that might contain sensitive data',
    template: 'filetype:bak OR filetype:backup OR filetype:old',
    risk: 'high',
    category: 'security'
  },
  {
    name: 'Camera/IoT Devices',
    description: 'Find exposed camera and IoT device interfaces',
    template: 'inurl:"/view/view.shtml" OR inurl:"/ViewerFrame?Mode=" OR intitle:"Live View / - AXIS"',
    risk: 'critical',
    category: 'security'
  },
  {
    name: 'FTP Servers',
    description: 'Find open FTP servers with directory listings',
    template: 'intitle:"index of" inurl:ftp',
    risk: 'high',
    category: 'security'
  }
];

function DorkBuilderAdvanced({ addToHistory }) {
  const [dorkParts, setDorkParts] = useState([{ operator: '', value: '' }]);
  const [builtDork, setBuiltDork] = useState('');
  const [description, setDescription] = useState('');
  const [validation, setValidation] = useState(null);
  const [timeRange, setTimeRange] = useState('any');
  const [region, setRegion] = useState('global');
  const [safeSearch, setSafeSearch] = useState('moderate');
  
  // Advanced features
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showTemplates, setShowTemplates] = useState(false);
  const [savedDorks, setSavedDorks] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [batchDorks, setBatchDorks] = useState(['']);
  const [showHistory, setShowHistory] = useState(false);
  const [dorkHistory, setDorkHistory] = useState([]);
  const [showPreview, setShowPreview] = useState(true);
  const [exportFormat, setExportFormat] = useState('json');
  const [collapsedSections, setCollapsedSections] = useState({});

  const validateDork = async (dork) => {
    if (!dork) return;
    try {
      const response = await axios.post('/api/validate-dork', { dork });
      setValidation(response.data);
    } catch (error) {
      console.error('Error validating dork:', error);
      // Mock validation for demo
      setValidation({
        valid: true,
        riskLevel: 'medium',
        suggestions: ['Consider adding site restrictions for targeted searches'],
        issues: []
      });
    }
  };

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

  const saveDork = () => {
    if (!builtDork.trim() || !description.trim()) {
      alert('Please enter both a dork and description');
      return;
    }

    const newDork = {
      id: Date.now(),
      dork: builtDork,
      description,
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
    setCurrentTemplate(template);
    setValidation({ riskLevel: template.risk });
  };

  const exportDorks = () => {
    const data = {
      savedDorks,
      exportDate: new Date().toISOString(),
      format: exportFormat
    };

    let content, filename, mimeType;

    if (exportFormat === 'json') {
      content = JSON.stringify(data, null, 2);
      filename = 'gdork-collection.json';
      mimeType = 'application/json';
    } else if (exportFormat === 'txt') {
      content = savedDorks.map(d => `${d.description}: ${d.dork}`).join('\\n');
      filename = 'gdork-collection.txt';
      mimeType = 'text/plain';
    } else if (exportFormat === 'csv') {
      const headers = 'Description,Dork,Risk,Category,Created\\n';
      const rows = savedDorks.map(d => 
        `"${d.description}","${d.dork}","${d.risk}","${d.category}","${d.created}"`
      ).join('\\n');
      content = headers + rows;
      filename = 'gdork-collection.csv';
      mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDorks = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported.savedDorks) {
          setSavedDorks([...savedDorks, ...imported.savedDorks]);
          localStorage.setItem('savedDorks', JSON.stringify([...savedDorks, ...imported.savedDorks]));
          alert(`Imported ${imported.savedDorks.length} dorks successfully!`);
        }
      } catch (error) {
        alert('Error importing file. Please check the format.');
      }
    };
    reader.readAsText(file);
  };

  const executeBatchSearch = async () => {
    for (const dork of batchDorks.filter(d => d.trim())) {
      try {
        const response = await axios.post('/api/search', { 
          query: dork,
          timeRange,
          region,
          safeSearch
        });
        addToHistory(response.data);
        window.open(response.data.url, '_blank');
        
        // Add delay between searches to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error('Error executing batch search:', error);
      }
    }
  };

  const addToDorkHistory = (dork) => {
    const historyEntry = {
      dork,
      timestamp: new Date().toISOString(),
      description
    };
    
    const updated = [historyEntry, ...dorkHistory.slice(0, 49)]; // Keep last 50
    setDorkHistory(updated);
    localStorage.setItem('dorkHistory', JSON.stringify(updated));
  };

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
        query: builtDork,
        timeRange,
        region,
        safeSearch
      });
      addToHistory(response.data);
      addToDorkHistory(builtDork);
      
      window.open(response.data.url, '_blank');
    } catch (error) {
      console.error('Error executing search:', error);
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
      case 'critical': return 'text-red-700 bg-red-100 border-red-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (risk) => {
    switch(risk) {
      case 'critical': return <AlertTriangle className="h-3 w-3" />;
      case 'high': return <AlertTriangle className="h-3 w-3" />;
      case 'medium': return <Info className="h-3 w-3" />;
      case 'low': return <Shield className="h-3 w-3" />;
      default: return <Info className="h-3 w-3" />;
    }
  };

  const filteredOperators = selectedCategory === 'all' 
    ? dorkOperators 
    : dorkOperators.filter(op => op.category === selectedCategory);

  const addDorkPart = () => {
    setDorkParts([...dorkParts, { operator: '', value: '' }]);
  };

  const removeDorkPart = (index) => {
    setDorkParts(dorkParts.filter((_, i) => i !== index));
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
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">Advanced Dork Builder</h1>
        <p className="text-gray-600">Build powerful Google dorks with advanced operators and features</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setAdvancedMode(!advancedMode)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            advancedMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          <Settings className="h-4 w-4 inline mr-2" />
          Advanced Mode
        </button>
        <button
          onClick={() => setBatchMode(!batchMode)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            batchMode ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          <Zap className="h-4 w-4 inline mr-2" />
          Batch Mode
        </button>
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            showTemplates ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          <BookOpen className="h-4 w-4 inline mr-2" />
          Templates
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Main Builder Section */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Templates Section */}
          {showTemplates && (
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div 
                className="flex items-center justify-between cursor-pointer mb-4"
                onClick={() => toggleSection('templates')}
              >
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                  Dork Templates
                </h3>
                {collapsedSections.templates ? 
                  <ChevronRight className="h-5 w-5" /> : 
                  <ChevronDown className="h-5 w-5" />
                }
              </div>
              
              {!collapsedSections.templates && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dorkTemplates.map((template, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{template.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(template.risk)}`}>
                          {template.risk}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <code className="text-xs bg-gray-100 p-2 rounded block mb-3 break-all">
                        {template.template}
                      </code>
                      <button
                        onClick={() => loadTemplate(template)}
                        className="w-full bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Use Template
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Batch Mode */}
          {batchMode && (
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-purple-600" />
                Batch Search Mode
              </h3>
              <div className="space-y-3">
                {batchDorks.map((dork, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={dork}
                      onChange={(e) => {
                        const updated = [...batchDorks];
                        updated[index] = e.target.value;
                        setBatchDorks(updated);
                      }}
                      placeholder={`Dork ${index + 1}`}
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={() => setBatchDorks(batchDorks.filter((_, i) => i !== index))}
                      className="text-red-600 hover:text-red-700 p-2"
                      disabled={batchDorks.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setBatchDorks([...batchDorks, ''])}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <Plus className="h-4 w-4 inline mr-2" />
                    Add Dork
                  </button>
                  <button
                    onClick={executeBatchSearch}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Play className="h-4 w-4 inline mr-2" />
                    Execute Batch
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dork Builder */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Build Your Dork</h3>
            
            {/* Category Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Operator Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="basic">Basic Operators</option>
                <option value="advanced">Advanced Operators</option>
                <option value="files">File Operators</option>
                <option value="security">Security Focused</option>
                <option value="temporal">Date & Range</option>
                <option value="logical">Logical Operators</option>
              </select>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this dork searches for..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Dork Parts Builder */}
            <div className="space-y-3 mb-4">
              {dorkParts.map((part, index) => (
                <div key={index} className="flex space-x-2 items-center">
                  <select
                    value={part.operator}
                    onChange={(e) => updateDorkPart(index, 'operator', e.target.value)}
                    className="w-1/3 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Operator</option>
                    {filteredOperators.map((op, opIndex) => (
                      <option key={opIndex} value={op.operator}>
                        {op.operator} - {op.description}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={part.value}
                    onChange={(e) => updateDorkPart(index, 'value', e.target.value)}
                    placeholder="Enter value"
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={() => removeDorkPart(index)}
                    className="text-red-600 hover:text-red-700 p-2"
                    disabled={dorkParts.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              <button
                onClick={addDorkPart}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
              >
                <Plus className="h-5 w-5 mx-auto mb-1" />
                Add Another Operator
              </button>
            </div>

            {/* Advanced Options */}
            {advancedMode && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Range
                  </label>
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="any">Any time</option>
                    <option value="day">Past 24 hours</option>
                    <option value="week">Past week</option>
                    <option value="month">Past month</option>
                    <option value="year">Past year</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="global">Global</option>
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="ca">Canada</option>
                    <option value="au">Australia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Safe Search
                  </label>
                  <select
                    value={safeSearch}
                    onChange={(e) => setSafeSearch(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="off">Off</option>
                    <option value="moderate">Moderate</option>
                    <option value="strict">Strict</option>
                  </select>
                </div>
              </div>
            )}

            {/* Built Dork Preview */}
            {showPreview && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Generated Dork:</h4>
                <div className="bg-gray-100 p-3 rounded border">
                  <code className="text-sm font-mono text-gray-800 break-all">
                    {builtDork || 'Build your dork using the operators above'}
                  </code>
                </div>
              </div>
            )}

            {/* Validation Results */}
            {validation && (
              <div className="mb-4">
                <div className={`p-4 rounded-lg border ${
                  validation.valid 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`text-sm font-medium ${
                      validation.valid ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {validation.valid ? 'Valid Dork' : 'Validation Issues'}
                    </span>
                    {validation.riskLevel && (
                      <span className={`text-xs px-2 py-1 rounded-full flex items-center space-x-1 ${getRiskColor(validation.riskLevel)}`}>
                        {getRiskIcon(validation.riskLevel)}
                        <span>Risk: {validation.riskLevel}</span>
                      </span>
                    )}
                  </div>
                  
                  {validation.suggestions && validation.suggestions.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-blue-800 mb-1">Suggestions:</p>
                      <ul className="text-sm text-blue-700 list-disc list-inside">
                        {validation.suggestions.map((suggestion, index) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={executeSearch}
                disabled={!builtDork.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Execute Search</span>
              </button>
              
              <button
                onClick={copyDork}
                disabled={!builtDork.trim()}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </button>

              <button
                onClick={saveDork}
                disabled={!builtDork.trim()}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-4 space-y-6">
          {/* Quick Operators */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Add Operators</h3>
            <div className="grid grid-cols-2 gap-2">
              {filteredOperators.slice(0, 8).map((op, index) => (
                <button
                  key={index}
                  onClick={() => addOperator(op.operator)}
                  className={`text-left p-2 rounded text-xs border hover:shadow-md transition-all ${getRiskColor(op.risk)}`}
                  title={op.description}
                >
                  <div className="font-mono font-bold">{op.operator}</div>
                  <div className="text-xs opacity-75">{op.description.substring(0, 20)}...</div>
                </button>
              ))}
            </div>
          </div>

          {/* Saved Dorks */}
          {savedDorks.length > 0 && (
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Saved Dorks</h3>
                <div className="flex space-x-2">
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="text-xs px-2 py-1 border rounded"
                  >
                    <option value="json">JSON</option>
                    <option value="txt">TXT</option>
                    <option value="csv">CSV</option>
                  </select>
                  <button
                    onClick={exportDorks}
                    className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                  >
                    <Download className="h-3 w-3" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {savedDorks.slice(0, 10).map((saved, index) => (
                  <div key={index} className="border rounded p-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{saved.description}</span>
                      <span className={`text-xs px-1 py-0.5 rounded ${getRiskColor(saved.risk)}`}>
                        {saved.risk}
                      </span>
                    </div>
                    <code className="text-xs bg-gray-100 p-1 rounded block break-all">
                      {saved.dork}
                    </code>
                    <button
                      onClick={() => setBuiltDork(saved.dork)}
                      className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                    >
                      Load
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent History */}
          {dorkHistory.length > 0 && (
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <History className="h-5 w-5 mr-2" />
                Recent History
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {dorkHistory.slice(0, 5).map((entry, index) => (
                  <div key={index} className="border rounded p-2">
                    <code className="text-xs bg-gray-100 p-1 rounded block break-all mb-1">
                      {entry.dork}
                    </code>
                    <div className="text-xs text-gray-500">
                      {new Date(entry.timestamp).toLocaleString()}
                    </div>
                    <button
                      onClick={() => setBuiltDork(entry.dork)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Reuse
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Import/Export */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Import/Export</h3>
            <div className="space-y-3">
              <input
                type="file"
                accept=".json"
                onChange={importDorks}
                className="hidden"
                id="import-file"
              />
              <label
                htmlFor="import-file"
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer flex items-center justify-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Import Dorks</span>
              </label>
              
              <button
                onClick={exportDorks}
                disabled={savedDorks.length === 0}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export Collection</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DorkBuilderAdvanced;
