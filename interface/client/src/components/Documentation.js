import React from 'react';
import { BookOpen, AlertTriangle, Shield, Target, Search, Database, Cloud, Camera } from 'lucide-react';

function Documentation() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Google Dorking Documentation</h1>
        <p className="text-gray-600">Learn how to use Google search operators effectively and responsibly</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">What is Google Dorking?</h2>
          </div>
          <div className="space-y-3 text-gray-700">
            <p>
              Google Dorking, also known as Google Hacking, involves using advanced search operators 
              to find specific information that may not be easily accessible through normal searches.
            </p>
            <p>
              These techniques are commonly used in OSINT (Open Source Intelligence) for legitimate 
              research, security testing, and information gathering purposes.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-semibold">Legal and Ethical Considerations</h2>
          </div>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Always use these techniques responsibly:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Only search for publicly available information</li>
              <li>Respect privacy and confidentiality</li>
              <li>Follow applicable laws and regulations</li>
              <li>Use for legitimate research purposes only</li>
              <li>Report vulnerabilities responsibly</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <Search className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-semibold">Common Search Operators</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-900">site:</h3>
              <p className="text-sm text-gray-600 mb-2">Search within a specific domain</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">site:example.com password</code>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-900">filetype:</h3>
              <p className="text-sm text-gray-600 mb-2">Find specific file types</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">filetype:pdf confidential</code>
            </div>
            
            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-semibold text-gray-900">inurl:</h3>
              <p className="text-sm text-gray-600 mb-2">Find pages with term in URL</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">inurl:admin login</code>
            </div>
            
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-semibold text-gray-900">intext:</h3>
              <p className="text-sm text-gray-600 mb-2">Find pages with term in content</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">intext:"password" filetype:txt</code>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-gray-900">intitle:</h3>
              <p className="text-sm text-gray-600 mb-2">Find pages with term in title</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">intitle:"index of" backup</code>
            </div>
            
            <div className="border-l-4 border-indigo-500 pl-4">
              <h3 className="font-semibold text-gray-900">cache:</h3>
              <p className="text-sm text-gray-600 mb-2">View cached version of page</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">cache:example.com</code>
            </div>
            
            <div className="border-l-4 border-pink-500 pl-4">
              <h3 className="font-semibold text-gray-900">related:</h3>
              <p className="text-sm text-gray-600 mb-2">Find related websites</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">related:github.com</code>
            </div>
            
            <div className="border-l-4 border-gray-500 pl-4">
              <h3 className="font-semibold text-gray-900">-</h3>
              <p className="text-sm text-gray-600 mb-2">Exclude terms from search</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">admin -site:example.com</code>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card text-center">
          <Database className="h-8 w-8 text-blue-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Database Exposures</h3>
          <p className="text-sm text-gray-600">Find exposed databases and configuration files</p>
        </div>
        
        <div className="card text-center">
          <Cloud className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Cloud Storage</h3>
          <p className="text-sm text-gray-600">Discover cloud storage buckets and files</p>
        </div>
        
        <div className="card text-center">
          <Camera className="h-8 w-8 text-purple-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">IoT Devices</h3>
          <p className="text-sm text-gray-600">Find cameras and IoT device interfaces</p>
        </div>
        
        <div className="card text-center">
          <Target className="h-8 w-8 text-red-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Vulnerabilities</h3>
          <p className="text-sm text-gray-600">Identify potential security issues</p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-6 w-6 text-green-600" />
          <h2 className="text-xl font-semibold">Best Practices</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Search Techniques</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Combine multiple operators for precise results</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Use quotes for exact phrase matching</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Apply time filters to find recent content</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Use exclusion operators to filter noise</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Security Considerations</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-yellow-500 mt-1">•</span>
                <span>Be aware of rate limiting and IP blocking</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow-500 mt-1">•</span>
                <span>Use VPNs or proxies for sensitive research</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow-500 mt-1">•</span>
                <span>Document findings for responsible disclosure</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow-500 mt-1">•</span>
                <span>Respect robots.txt and terms of service</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="card bg-yellow-50 border-yellow-200">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Important Disclaimer</h3>
            <p className="text-yellow-700">
              This tool is intended for educational and legitimate research purposes only. 
              Users are responsible for ensuring their activities comply with applicable laws 
              and regulations. The developers are not liable for any misuse of this tool.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Documentation;
