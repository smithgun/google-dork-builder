const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs-extra');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));

// Rate limiting middleware
const searchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many search requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to search endpoints
app.use('/api/search', searchLimiter);
app.use('/api/custom-dork', searchLimiter);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// Search history file path
const HISTORY_FILE = path.join(__dirname, 'data', 'search-history.json');

// Ensure data directory exists
async function initializeDataDirectory() {
  try {
    await fs.ensureDir(path.join(__dirname, 'data'));
    if (!(await fs.pathExists(HISTORY_FILE))) {
      await fs.writeJson(HISTORY_FILE, []);
    }
  } catch (error) {
    console.error('Error initializing data directory:', error);
  }
}

initializeDataDirectory();

const dorkCategories = {
  'files': {
    name: 'File Types & Documents',
    dorks: [
      { query: 'filetype:pdf "confidential" OR "internal use"', description: 'Find confidential PDF documents', risk: 'high' },
      { query: 'filetype:xls "password" OR "credentials"', description: 'Find Excel files with credentials', risk: 'high' },
      { query: 'filetype:doc "employee" OR "salary" OR "payroll"', description: 'Find sensitive Word documents', risk: 'medium' },
      { query: 'filetype:sql "insert into" OR "create table"', description: 'Find SQL database dumps', risk: 'high' },
      { query: 'filetype:log "error" OR "failed" OR "exception"', description: 'Find error logs with debugging info', risk: 'medium' },
      { query: 'filetype:bak OR filetype:backup OR filetype:old', description: 'Find backup files', risk: 'high' },
      { query: 'filetype:env OR filetype:config "password" OR "key"', description: 'Find configuration files with secrets', risk: 'critical' },
      { query: 'filetype:pem OR filetype:key OR filetype:p12', description: 'Find SSL certificates and private keys', risk: 'critical' }
    ]
  },
  'vulnerabilities': {
    name: 'Security Vulnerabilities',
    dorks: [
      { query: 'inurl:"admin" OR inurl:"administrator" intitle:"login"', description: 'Find admin login pages', risk: 'medium' },
      { query: 'intext:"sql syntax near" OR "mysql_fetch" OR "ORA-01756"', description: 'Find SQL injection errors', risk: 'high' },
      { query: 'intext:"Warning: mysql_connect()" OR "Warning: pg_connect()"', description: 'Find database connection errors', risk: 'high' },
      { query: 'inurl:"/phpmyadmin/" OR inurl:"/phpMyAdmin/"', description: 'Find phpMyAdmin interfaces', risk: 'high' },
      { query: 'intext:"Index of /" "Parent Directory" "Last modified"', description: 'Find open directory listings', risk: 'medium' },
      { query: 'inurl:shell OR inurl:backdoor OR inurl:wso OR inurl:cmd', description: 'Find web shells and backdoors', risk: 'critical' },
      { query: 'intext:"PHP Parse error" OR "PHP Warning" OR "PHP Error"', description: 'Find PHP error disclosures', risk: 'medium' },
      { query: 'inurl:".git" filetype:git OR inurl:"/.svn/"', description: 'Find exposed version control', risk: 'high' }
    ]
  },
  'sensitive': {
    name: 'Sensitive Information',
    dorks: [
      { query: 'intext:"password" OR "passwd" OR "pwd" filetype:txt OR filetype:log', description: 'Find plaintext passwords', risk: 'critical' },
      { query: 'intext:"BEGIN RSA PRIVATE KEY" OR "BEGIN PRIVATE KEY"', description: 'Find private keys in text', risk: 'critical' },
      { query: 'intext:"api_key" OR "api-key" OR "apikey" OR "access_token"', description: 'Find API keys and tokens', risk: 'high' },
      { query: 'intext:"username" "password" filetype:csv OR filetype:xls', description: 'Find credential lists', risk: 'critical' },
      { query: 'intext:"social security" OR "ssn:" OR "tax id"', description: 'Find SSN and tax information', risk: 'critical' },
      { query: 'intext:"credit card" OR "visa" OR "mastercard" OR "amex"', description: 'Find credit card information', risk: 'critical' },
      { query: 'intext:"database" "password" OR "db_password" OR "mysql_password"', description: 'Find database passwords', risk: 'critical' },
      { query: 'intext:"confidential" OR "classified" OR "proprietary" filetype:pdf', description: 'Find classified documents', risk: 'high' }
    ]
  },
  'servers': {
    name: 'Server Information & Infrastructure',
    dorks: [
      { query: 'inurl:server-status "Apache Status" "Server Version"', description: 'Find Apache server status pages', risk: 'medium' },
      { query: 'inurl:server-info "Apache Server Information"', description: 'Find Apache server info pages', risk: 'medium' },
      { query: 'intext:"phpinfo()" "PHP Version" OR "System"', description: 'Find PHP info disclosure pages', risk: 'high' },
      { query: 'inurl:".env" OR inurl:"config.php" OR inurl:"database.yml"', description: 'Find configuration files', risk: 'high' },
      { query: 'intext:"nginx" "server:" OR "powered by nginx"', description: 'Find Nginx server information', risk: 'low' },
      { query: 'intext:"IIS" "Server:" OR "Microsoft-IIS"', description: 'Find IIS server information', risk: 'low' },
      { query: 'inurl:"/cgi-bin/" OR inurl:"/scripts/" OR inurl:"/bin/"', description: 'Find CGI and script directories', risk: 'medium' },
      { query: 'intext:"apache" "version" OR "build" error', description: 'Find Apache version disclosure', risk: 'low' }
    ]
  },
  'cameras': {
    name: 'Cameras & IoT Devices',
    dorks: [
      { query: 'inurl:"ViewerFrame?Mode=" OR inurl:"MultiCameraFrame?Mode="', description: 'Find unsecured webcams', risk: 'medium' },
      { query: 'inurl:"axis-cgi/mjpg" OR inurl:"mjpg/video.cgi"', description: 'Find Axis IP cameras', risk: 'medium' },
      { query: 'intitle:"Live View / - AXIS" OR intitle:"Live View"', description: 'Find live camera feeds', risk: 'medium' },
      { query: 'inurl:"/control/userimage.html" OR inurl:"/view/index.shtml"', description: 'Find camera control interfaces', risk: 'medium' },
      { query: 'intext:"Network Camera" OR intext:"IP Camera" OR intext:"Web Camera"', description: 'Find network cameras', risk: 'medium' },
      { query: 'inurl:"CgiStart?page=" OR inurl:"home_cgi"', description: 'Find camera CGI interfaces', risk: 'medium' },
      { query: 'intext:"MOBOTIX" OR intext:"Vivotek" OR intext:"D-Link"', description: 'Find specific camera brands', risk: 'medium' },
      { query: 'inurl:":8080" "camera" OR "webcam" OR "livecam"', description: 'Find cameras on common ports', risk: 'medium' }
    ]
  },
  'databases': {
    name: 'Database Exposures',
    dorks: [
      { query: 'inurl:"phpmyadmin" OR inurl:"phpMyAdmin" OR inurl:"mysql"', description: 'Find database admin interfaces', risk: 'high' },
      { query: 'intext:"mysql_connect" error OR "mysql_pconnect" error', description: 'Find MySQL connection errors', risk: 'high' },
      { query: 'filetype:sql "INSERT INTO" OR "CREATE TABLE" OR "DROP TABLE"', description: 'Find SQL dump files', risk: 'high' },
      { query: 'intext:"MongoDB" "unauthorized" OR "authentication failed"', description: 'Find MongoDB errors', risk: 'high' },
      { query: 'inurl:"/admin/adminer" OR inurl:"/adminer.php"', description: 'Find Adminer database tools', risk: 'high' },
      { query: 'intext:"PostgreSQL" "FATAL" OR "connection failed"', description: 'Find PostgreSQL errors', risk: 'medium' },
      { query: 'inurl:"/db/" OR inurl:"/database/" filetype:sql', description: 'Find database directories', risk: 'high' },
      { query: 'intext:"redis" "unauthorized" OR "NOAUTH"', description: 'Find Redis database errors', risk: 'high' }
    ]
  },
  'cloud': {
    name: 'Cloud Storage & Services',
    dorks: [
      { query: 'site:amazonaws.com filetype:pdf OR filetype:xls OR filetype:doc', description: 'Find documents in AWS S3', risk: 'medium' },
      { query: 'site:storage.googleapis.com OR site:drive.google.com', description: 'Find Google Cloud storage', risk: 'medium' },
      { query: 'site:blob.core.windows.net OR site:azurewebsites.net', description: 'Find Azure storage and sites', risk: 'medium' },
      { query: 'intext:"aws_access_key_id" OR "aws_secret_access_key"', description: 'Find AWS credentials', risk: 'critical' },
      { query: 'intext:"storage.googleapis.com" "key.json" OR "service-account"', description: 'Find Google service account keys', risk: 'critical' },
      { query: 'site:herokuapp.com inurl:"/admin" OR inurl:"/dashboard"', description: 'Find Heroku admin panels', risk: 'medium' },
      { query: 'site:digitaloceanspaces.com OR site:spaces.digitalocean.com', description: 'Find DigitalOcean spaces', risk: 'medium' },
      { query: 'intext:"travis" "secure:" OR "encrypted:"', description: 'Find Travis CI encrypted variables', risk: 'medium' }
    ]
  }
};

app.get('/api/dorks', (req, res) => {
  res.json(dorkCategories);
});

app.get('/api/dorks/:category', (req, res) => {
  const category = req.params.category;
  if (dorkCategories[category]) {
    res.json(dorkCategories[category]);
  } else {
    res.status(404).json({ error: 'Category not found' });
  }
});

app.post('/api/search', (req, res) => {
  const { query, site, timeRange, region, safeSearch } = req.body;
  let searchQuery = query;
  
  if (site && site.trim()) {
    searchQuery = `${query} site:${site.trim()}`;
  }
  
  // Add time range filtering
  if (timeRange && timeRange !== 'any') {
    switch(timeRange) {
      case 'day':
        searchQuery += ' qdr:d';
        break;
      case 'week':
        searchQuery += ' qdr:w';
        break;
      case 'month':
        searchQuery += ' qdr:m';
        break;
      case 'year':
        searchQuery += ' qdr:y';
        break;
    }
  }
  
  let googleUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
  
  // Add region-specific search
  if (region && region !== 'global') {
    googleUrl += `&gl=${region}`;
  }
  
  // Add safe search setting
  if (safeSearch === 'off') {
    googleUrl += '&safe=off';
  } else if (safeSearch === 'strict') {
    googleUrl += '&safe=strict';
  }
  
  // Generate alternative search engines
  const alternativeEngines = {
    bing: `https://www.bing.com/search?q=${encodeURIComponent(searchQuery)}`,
    duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`,
    yandex: `https://yandex.com/search/?text=${encodeURIComponent(searchQuery)}`,
    baidu: `https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery)}`
  };
  
  res.json({
    query: searchQuery,
    url: googleUrl,
    alternativeEngines,
    timestamp: new Date().toISOString(),
    searchOptions: {
      site: site || null,
      timeRange: timeRange || 'any',
      region: region || 'global',
      safeSearch: safeSearch || 'moderate'
    }
  });
});

app.post('/api/custom-dork', (req, res) => {
  const { dork, description } = req.body;
  
  // Validate dork query
  const validation = validateDork(dork);
  
  const customDork = {
    query: dork,
    description: description || 'Custom dork',
    timestamp: new Date().toISOString(),
    validation: validation
  };
  
  res.json(customDork);
});

// Add dork validation function
function validateDork(dork) {
  const issues = [];
  const suggestions = [];
  
  // Check for common issues
  if (!dork || dork.trim().length === 0) {
    issues.push('Empty dork query');
    return { valid: false, issues, suggestions };
  }
  
  // Check for overly broad searches
  if (dork.length < 10 && !dork.includes(':')) {
    suggestions.push('Consider using specific operators like site:, filetype:, or inurl: for better results');
  }
  
  // Check for potentially dangerous combinations
  const dangerousPatterns = [
    { pattern: /filetype:\w+.*password.*api/i, message: 'This combination may find highly sensitive data' },
    { pattern: /intext:.*password.*username/i, message: 'This may expose login credentials' },
    { pattern: /filetype:(sql|db|bak).*password/i, message: 'This may find database credentials' }
  ];
  
  dangerousPatterns.forEach(({ pattern, message }) => {
    if (pattern.test(dork)) {
      issues.push(message);
    }
  });
  
  // Check for operator syntax
  const operators = ['site:', 'filetype:', 'inurl:', 'intext:', 'intitle:', 'ext:', 'cache:', 'related:', 'info:', 'link:', 'define:'];
  const hasOperator = operators.some(op => dork.includes(op));
  
  if (!hasOperator) {
    suggestions.push('Consider using Google search operators for more targeted results');
  }
  
  return {
    valid: issues.length === 0,
    issues,
    suggestions,
    riskLevel: issues.length > 0 ? 'high' : (suggestions.length > 0 ? 'medium' : 'low')
  };
}

// Add endpoint for dork validation
app.post('/api/validate-dork', (req, res) => {
  const { dork } = req.body;
  const validation = validateDork(dork);
  res.json(validation);
});

// Add endpoint for getting search statistics
app.get('/api/search-stats', (req, res) => {
  const stats = {
    totalCategories: Object.keys(dorkCategories).length,
    totalDorks: Object.values(dorkCategories).reduce((sum, cat) => sum + cat.dorks.length, 0),
    riskDistribution: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    }
  };
  
  Object.values(dorkCategories).forEach(category => {
    category.dorks.forEach(dork => {
      if (dork.risk) {
        stats.riskDistribution[dork.risk]++;
      }
    });
  });
  
  res.json(stats);
});

// Subfinder endpoint
app.post('/api/subfinder', async (req, res) => {
  const { domain, sources, depth, timeout } = req.body;
  
  if (!domain || !domain.trim()) {
    return res.status(400).json({ error: 'Domain is required' });
  }

  try {
    // In a real implementation, you would call actual subfinder tools
    // For now, we'll generate realistic mock data
    const mockSubdomains = generateSubdomains(domain, sources, depth);
    
    const stats = {
      total: mockSubdomains.length,
      active: mockSubdomains.filter(s => s.status === 'active').length,
      inactive: mockSubdomains.filter(s => s.status === 'inactive').length,
      sources: sources.length,
      duration: Math.floor(Math.random() * timeout) + 5
    };

    res.json({
      subdomains: mockSubdomains,
      stats,
      domain,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in subfinder:', error);
    res.status(500).json({ error: 'Subfinder execution failed' });
  }
});

// Helper function to generate realistic subdomains
function generateSubdomains(domain, sources, depth) {
  const commonSubdomains = [
    'www', 'mail', 'ftp', 'admin', 'api', 'dev', 'test', 'staging', 'beta', 'demo',
    'old', 'new', 'secure', 'shop', 'blog', 'forum', 'help', 'support', 'docs',
    'cdn', 'img', 'images', 'static', 'assets', 'media', 'files', 'download',
    'mobile', 'm', 'app', 'apps', 'vpn', 'remote', 'backup', 'archive',
    'portal', 'dashboard', 'control', 'panel', 'manage', 'config', 'setup',
    'login', 'auth', 'oauth', 'sso', 'ldap', 'ad', 'directory', 'users',
    'monitoring', 'stats', 'analytics', 'metrics', 'logs', 'debug', 'trace',
    'payments', 'billing', 'invoice', 'accounting', 'finance', 'reports',
    'crm', 'erp', 'hr', 'helpdesk', 'ticket', 'issue', 'bug', 'feedback',
    'newsletter', 'email', 'smtp', 'imap', 'pop3', 'webmail', 'exchange',
    'git', 'svn', 'jenkins', 'build', 'ci', 'cd', 'deploy', 'release',
    'docker', 'k8s', 'kubernetes', 'swarm', 'cluster', 'node', 'worker',
    'load', 'balancer', 'proxy', 'gateway', 'firewall', 'security', 'ssl',
    'cache', 'redis', 'memcache', 'elastic', 'search', 'index', 'solr'
  ];

  const services = [
    'mysql', 'postgres', 'mongodb', 'redis', 'elastic', 'kibana', 'grafana',
    'prometheus', 'influx', 'splunk', 'logstash', 'fluentd', 'filebeat',
    'nginx', 'apache', 'haproxy', 'traefik', 'consul', 'vault', 'nomad',
    'kafka', 'rabbitmq', 'activemq', 'nats', 'pulsar', 'zeromq',
    'jenkins', 'gitlab', 'github', 'bitbucket', 'jira', 'confluence'
  ];
  
  const environments = [
    'prod', 'production', 'staging', 'stage', 'dev', 'development', 'test', 'testing',
    'qa', 'uat', 'pre', 'preprod', 'sandbox', 'demo', 'local', 'docker'
  ];
  
  const regions = [
    'us', 'eu', 'asia', 'apac', 'emea', 'west', 'east', 'north', 'south',
    'central', 'na', 'sa', 'af', 'oc', 'america', 'europe', 'africa'
  ];

  const prefixes = ['api', 'secure', 'internal', 'private', 'public', 'external', 'guest'];
  const numbers = ['1', '2', '3', '01', '02', '03', '001', '002', '003'];

  let subdomains = [];
  // Generate more subdomains based on depth and sources
  const baseCount = 25;
  const depthMultiplier = depth * 15;
  const sourceMultiplier = sources.length * 3;
  const numSubdomains = baseCount + depthMultiplier + sourceMultiplier;

  // Generate basic subdomains
  for (let i = 0; i < numSubdomains; i++) {
    let subdomain;
    const rand = Math.random();
    
    if (rand < 0.4) {
      // Common subdomains
      subdomain = commonSubdomains[Math.floor(Math.random() * commonSubdomains.length)];
    } else if (rand < 0.6) {
      // Service + environment combinations
      const service = services[Math.floor(Math.random() * services.length)];
      const env = environments[Math.floor(Math.random() * environments.length)];
      subdomain = `${service}-${env}`;
    } else if (rand < 0.75) {
      // Region + service combinations
      const region = regions[Math.floor(Math.random() * regions.length)];
      const service = commonSubdomains[Math.floor(Math.random() * commonSubdomains.length)];
      subdomain = `${region}-${service}`;
    } else if (rand < 0.85) {
      // Numbered subdomains
      const base = commonSubdomains[Math.floor(Math.random() * commonSubdomains.length)];
      const num = numbers[Math.floor(Math.random() * numbers.length)];
      subdomain = `${base}${num}`;
    } else {
      // Environment + service combinations
      const env = environments[Math.floor(Math.random() * environments.length)];
      const service = services[Math.floor(Math.random() * services.length)];
      subdomain = `${env}-${service}`;
    }

    // Add multi-level subdomains for higher depth
    if (depth > 2 && Math.random() < 0.4) {
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      subdomain = `${prefix}.${subdomain}`;
    }

    // Add even deeper levels for max depth
    if (depth > 3 && Math.random() < 0.2) {
      const region = regions[Math.floor(Math.random() * regions.length)];
      subdomain = `${region}.${subdomain}`;
    }

    const fullSubdomain = `${subdomain}.${domain}`;
    
    // Avoid duplicates
    if (!subdomains.find(s => s.subdomain === fullSubdomain)) {
      const isActive = Math.random() < 0.75;
      const httpStatus = generateHttpStatus(isActive);
      
      subdomains.push({
        subdomain: fullSubdomain,
        source: sources[Math.floor(Math.random() * sources.length)],
        status: isActive ? 'active' : 'inactive',
        httpStatus: httpStatus,
        ip: Math.random() < 0.85 ? generateRandomIP() : null,
        ports: Math.random() < 0.3 ? generateOpenPorts() : []
      });
    }
  }

  return subdomains.sort((a, b) => a.subdomain.localeCompare(b.subdomain));
}

function generateHttpStatus(isActive) {
  if (!isActive) {
    // For inactive subdomains, return common error codes
    const errorCodes = [404, 403, 500, 502, 503, 504, 0]; // 0 for no response
    return errorCodes[Math.floor(Math.random() * errorCodes.length)];
  } else {
    // For active subdomains, mostly 200 but some redirects and auth issues
    const activeCodes = [200, 200, 200, 200, 200, 301, 302, 401, 403];
    return activeCodes[Math.floor(Math.random() * activeCodes.length)];
  }
}

function generateRandomIP() {
  const segments = [];
  for (let i = 0; i < 4; i++) {
    segments.push(Math.floor(Math.random() * 255));
  }
  return segments.join('.');
}

function generateOpenPorts() {
  const commonPorts = [80, 443, 22, 21, 25, 53, 110, 143, 993, 995, 3306, 5432, 6379, 9200, 8080, 8443, 3000, 8000];
  const numPorts = Math.floor(Math.random() * 4) + 1;
  const ports = [];
  
  for (let i = 0; i < numPorts; i++) {
    const port = commonPorts[Math.floor(Math.random() * commonPorts.length)];
    if (!ports.includes(port)) {
      ports.push(port);
    }
  }
  
  return ports.sort((a, b) => a - b);
}

// Search history endpoints
app.get('/api/history', async (req, res) => {
  try {
    const history = await fs.readJson(HISTORY_FILE);
    res.json(history.slice(0, 100)); // Return last 100 searches
  } catch (error) {
    console.error('Error reading search history:', error);
    res.json([]);
  }
});

app.post('/api/history', async (req, res) => {
  try {
    const searchItem = {
      ...req.body,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    
    let history = [];
    try {
      history = await fs.readJson(HISTORY_FILE);
    } catch (error) {
      // File doesn't exist or is corrupted, start with empty array
    }
    
    history.unshift(searchItem);
    // Keep only last 1000 searches
    history = history.slice(0, 1000);
    
    await fs.writeJson(HISTORY_FILE, history, { spaces: 2 });
    res.json({ success: true, id: searchItem.id });
  } catch (error) {
    console.error('Error saving search history:', error);
    res.status(500).json({ error: 'Failed to save search history' });
  }
});

app.delete('/api/history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let history = await fs.readJson(HISTORY_FILE);
    history = history.filter(item => item.id !== id);
    await fs.writeJson(HISTORY_FILE, history, { spaces: 2 });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting search history item:', error);
    res.status(500).json({ error: 'Failed to delete search history item' });
  }
});

app.delete('/api/history', async (req, res) => {
  try {
    await fs.writeJson(HISTORY_FILE, [], { spaces: 2 });
    res.json({ success: true });
  } catch (error) {
    console.error('Error clearing search history:', error);
    res.status(500).json({ error: 'Failed to clear search history' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});