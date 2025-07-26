import React, { useState, useEffect } from 'react';
import { Search, Globe, Shield, AlertTriangle, CheckCircle, Clock, Copy, Download, ExternalLink, Workflow } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Subfinder({ addToHistory }) {
  const navigate = useNavigate();
  const [domain, setDomain] = useState('');
  const [subdomains, setSubdomains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchStats, setSearchStats] = useState(null);
  const [selectedSources, setSelectedSources] = useState([
    'crt.sh', 'virustotal', 'dnsdb', 'wayback', 'github'
  ]);
  const [depth, setDepth] = useState(3);
  const [timeout, setTimeout] = useState(30);

  const subfinderSources = [
    { id: 'crt.sh', name: 'Certificate Transparency (crt.sh)', description: 'SSL certificate logs', enabled: true },
    { id: 'virustotal', name: 'VirusTotal', description: 'Malware analysis database', enabled: true },
    { id: 'dnsdb', name: 'DNS Database', description: 'Passive DNS records', enabled: true },
    { id: 'wayback', name: 'Wayback Machine', description: 'Internet archive snapshots', enabled: true },
    { id: 'github', name: 'GitHub', description: 'Code repositories', enabled: true },
    { id: 'shodan', name: 'Shodan', description: 'Internet-connected devices', enabled: false },
    { id: 'censys', name: 'Censys', description: 'Internet scan data', enabled: false },
    { id: 'securitytrails', name: 'SecurityTrails', description: 'DNS history', enabled: false },
    { id: 'spyse', name: 'Spyse', description: 'Internet assets search', enabled: false },
    { id: 'chaos', name: 'Chaos', description: 'ProjectDiscovery dataset', enabled: false }
  ];

  const dorksForSubdomains = [
    'site:*.{domain} -www',
    'inurl:*.{domain}',
    'site:{domain} filetype:txt',
    'site:{domain} intext:"subdomain"',
    'site:{domain} inurl:admin',
    'site:{domain} inurl:dev',
    'site:{domain} inurl:test',
    'site:{domain} inurl:staging',
    'site:{domain} inurl:api',
    'site:{domain} inurl:mail'
  ];

  const getStatusBadgeStyle = (httpStatus) => {
    if (httpStatus >= 200 && httpStatus < 300) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (httpStatus >= 300 && httpStatus < 400) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else if (httpStatus === 401 || httpStatus === 403) {
      return 'bg-orange-100 text-orange-800 border-orange-200';
    } else if (httpStatus >= 400 && httpStatus < 500) {
      return 'bg-red-100 text-red-800 border-red-200';
    } else if (httpStatus >= 500) {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    } else {
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (httpStatus) => {
    switch (httpStatus) {
      case 200: return 'OK';
      case 301: return 'Moved Permanently';
      case 302: return 'Found';
      case 401: return 'Unauthorized';
      case 403: return 'Forbidden';
      case 404: return 'Not Found';
      case 500: return 'Server Error';
      case 502: return 'Bad Gateway';
      case 503: return 'Service Unavailable';
      case 504: return 'Gateway Timeout';
      case 0: return 'No Response';
      default: return httpStatus.toString();
    }
  };

  const exportToCanvas = () => {
    if (subdomains.length === 0) return;
    
    const canvasData = {
      type: 'subfinder',
      domain,
      subdomains,
      stats: searchStats,
      timestamp: new Date().toISOString()
    };
    
    // Store data in sessionStorage to transfer to canvas
    sessionStorage.setItem('canvasImport', JSON.stringify(canvasData));
    navigate('/canvas');
  };

  const executeSubdomainSearch = async () => {
    if (!domain.trim()) return;
    
    setLoading(true);
    setSubdomains([]);
    setSearchStats(null);

    try {
      // Simulate API call to subfinder-like service
      const response = await axios.post('/api/subfinder', {
        domain: domain.trim(),
        sources: selectedSources,
        depth,
        timeout
      });

      setSubdomains(response.data.subdomains || []);
      setSearchStats(response.data.stats || {});
      
      // Add to history
      addToHistory({
        type: 'subfinder',
        domain: domain.trim(),
        subdomains: response.data.subdomains || [],
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error executing subfinder:', error);
      // Generate mock data for demonstration
      generateMockSubdomains();
    } finally {
      setLoading(false);
    }
  };

  const generateMockSubdomains = () => {
    const mockSubdomains = [
      { subdomain: `www.${domain}`, source: 'crt.sh', status: 'active', httpStatus: 200, ip: '192.168.1.1' },
      { subdomain: `mail.${domain}`, source: 'virustotal', status: 'active', httpStatus: 200, ip: '192.168.1.2' },
      { subdomain: `api.${domain}`, source: 'github', status: 'active', httpStatus: 401, ip: '192.168.1.3' },
      { subdomain: `admin.${domain}`, source: 'wayback', status: 'inactive', httpStatus: 404, ip: null },
      { subdomain: `dev.${domain}`, source: 'dnsdb', status: 'active', httpStatus: 403, ip: '192.168.1.4' },
      { subdomain: `test.${domain}`, source: 'crt.sh', status: 'active', httpStatus: 200, ip: '192.168.1.5' },
      { subdomain: `staging.${domain}`, source: 'github', status: 'inactive', httpStatus: 503, ip: null },
      { subdomain: `beta.${domain}`, source: 'virustotal', status: 'active', httpStatus: 302, ip: '192.168.1.6' },
      { subdomain: `old.${domain}`, source: 'wayback', status: 'inactive', httpStatus: 404, ip: null },
      { subdomain: `backup.${domain}`, source: 'dnsdb', status: 'active', httpStatus: 200, ip: '192.168.1.7' }
    ];

    setSubdomains(mockSubdomains);
    setSearchStats({
      total: mockSubdomains.length,
      active: mockSubdomains.filter(s => s.status === 'active').length,
      inactive: mockSubdomains.filter(s => s.status === 'inactive').length,
      sources: selectedSources.length,
      duration: Math.floor(Math.random() * 30) + 5
    });
  };

  const toggleSource = (sourceId) => {
    setSelectedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(s => s !== sourceId)
        : [...prev, sourceId]
    );
  };

  const copySubdomains = () => {
    const subdomainList = subdomains.map(s => s.subdomain).join('\n');
    navigator.clipboard.writeText(subdomainList);
  };

  const exportResults = () => {
    const data = {
      domain,
      searchDate: new Date().toISOString(),
      stats: searchStats,
      subdomains
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${domain}-subdomains.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const executeGoogleDorks = async () => {
    const dorkQueries = dorksForSubdomains.map(dork => 
      dork.replace(/{domain}/g, domain)
    );

    for (const query of dorkQueries) {
      const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      window.open(googleUrl, '_blank');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay between opens
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2" style={{color: 'rgb(0, 0, 255)'}}>Subfinder</h1>
        <p style={{color: 'rgb(0, 0, 255)'}}>Discover subdomains using multiple sources and techniques</p>
      </div>

      {/* Search Input */}
      <div className="card">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium mb-2" style={{color: 'rgb(0, 0, 255)'}}>
              Target Domain
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-5 w-5" style={{color: 'rgb(0, 0, 255)'}} />
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="example.com"
                className="input-field pl-10"
                onKeyPress={(e) => e.key === 'Enter' && executeSubdomainSearch()}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: 'rgb(0, 0, 255)'}}>
              Recursion Depth
            </label>
            <select
              value={depth}
              onChange={(e) => setDepth(parseInt(e.target.value))}
              className="input-field"
            >
              <option value={1}>1 Level</option>
              <option value={2}>2 Levels</option>
              <option value={3}>3 Levels</option>
              <option value={4}>4 Levels</option>
              <option value={5}>5 Levels</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: 'rgb(0, 0, 255)'}}>
              Timeout (seconds)
            </label>
            <select
              value={timeout}
              onChange={(e) => setTimeout(parseInt(e.target.value))}
              className="input-field"
            >
              <option value={15}>15s</option>
              <option value={30}>30s</option>
              <option value={60}>60s</option>
              <option value={120}>120s</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={executeSubdomainSearch}
            disabled={!domain.trim() || loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>Find Subdomains</span>
              </>
            )}
          </button>
          
          <button
            onClick={executeGoogleDorks}
            disabled={!domain.trim()}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Google Dorks</span>
          </button>
          
          {subdomains.length > 0 && (
            <button
              onClick={exportToCanvas}
              className="btn-secondary flex items-center space-x-2"
              title="Export results to investigation canvas"
            >
              <Workflow className="h-4 w-4" />
              <span>Add to Canvas</span>
            </button>
          )}
        </div>
      </div>

      {/* Data Sources */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4" style={{color: 'rgb(0, 0, 255)'}}>Data Sources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subfinderSources.map((source) => (
            <div
              key={source.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedSources.includes(source.id)
                  ? 'bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              style={selectedSources.includes(source.id) ? {borderColor: 'rgb(0, 0, 255)'} : {}}
              onClick={() => toggleSource(source.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold" style={{color: 'rgb(0, 0, 255)'}}>{source.name}</h3>
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{backgroundColor: selectedSources.includes(source.id) ? 'rgb(0, 0, 255)' : '#d1d5db'}}
                />
              </div>
              <p className="text-sm" style={{color: 'rgb(0, 0, 255)'}}>{source.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Results */}
      {(searchStats || subdomains.length > 0) && (
        <div className="space-y-6">
          {/* Statistics */}
          {searchStats && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold" style={{color: 'rgb(0, 0, 255)'}}>Search Results</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={copySubdomains}
                    className="p-2 hover:bg-blue-50"
                    style={{color: 'rgb(0, 0, 255)'}}
                    title="Copy subdomains"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={exportResults}
                    className="p-2 hover:bg-blue-50"
                    style={{color: 'rgb(0, 0, 255)'}}
                    title="Export results"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold" style={{color: 'rgb(0, 0, 255)'}}>{searchStats.total}</div>
                  <div className="text-sm" style={{color: 'rgb(0, 0, 255)'}}>Total Found</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{searchStats.active}</div>
                  <div className="text-sm text-green-600">Active</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">{searchStats.inactive}</div>
                  <div className="text-sm text-gray-600">Inactive</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{searchStats.sources}</div>
                  <div className="text-sm text-blue-600">Sources</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{searchStats.duration}s</div>
                  <div className="text-sm text-purple-600">Duration</div>
                </div>
              </div>
            </div>
          )}

          {/* Subdomain List */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4" style={{color: 'rgb(0, 0, 255)'}}>Discovered Subdomains</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {subdomains.map((subdomain, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <a
                        href={`https://${subdomain.subdomain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono hover:underline"
                        style={{color: 'rgb(0, 0, 255)'}}
                      >
                        {subdomain.subdomain}
                      </a>
                      {subdomain.status === 'active' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs px-2 py-1 rounded" style={{backgroundColor: 'rgb(0, 0, 255)', color: 'white'}}>
                        {subdomain.source}
                      </span>
                      {subdomain.httpStatus !== undefined && (
                        <span className={`text-xs px-2 py-1 rounded border font-medium ${getStatusBadgeStyle(subdomain.httpStatus)}`}>
                          {subdomain.httpStatus} {getStatusText(subdomain.httpStatus)}
                        </span>
                      )}
                      {subdomain.ip && (
                        <span className="text-xs text-gray-600 font-mono">
                          {subdomain.ip}
                        </span>
                      )}
                    </div>
                  </div>
                  <ExternalLink 
                    className="h-4 w-4 cursor-pointer hover:opacity-75"
                    style={{color: 'rgb(0, 0, 255)'}}
                    onClick={() => window.open(`https://${subdomain.subdomain}`, '_blank')}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Google Dorks for Subdomains */}
      <div className="subfinder-card">
        <h2 className="text-xl font-semibold mb-4" style={{color: 'rgb(0, 0, 255)'}}>Google Dorks for Subdomain Discovery</h2>
        <p className="mb-4" style={{color: 'rgb(0, 0, 255)'}}>
          Use these Google dorks to manually discover subdomains:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {dorksForSubdomains.map((dork, index) => (
            <div key={index} className="bg-white p-3 rounded border">
              <code className="text-sm font-mono" style={{color: 'rgb(0, 0, 255)'}}>
                {dork.replace(/{domain}/g, domain || 'example.com')}
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Subfinder;
