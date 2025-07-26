import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Plus, Save, Download, Upload, Trash2, Move, Link as LinkIcon, 
  Globe, User, Database, Server, FileText, Shield, Camera, Search,
  ZoomIn, ZoomOut, RotateCcw, Settings, Share2
} from 'lucide-react';

const nodeTypes = {
  domain: { icon: Globe, color: '#3B82F6', label: 'Domain' },
  subdomain: { icon: Globe, color: '#10B981', label: 'Subdomain' },
  ip: { icon: Server, color: '#F59E0B', label: 'IP Address' },
  person: { icon: User, color: '#EF4444', label: 'Person' },
  email: { icon: User, color: '#8B5CF6', label: 'Email' },
  file: { icon: FileText, color: '#6B7280', label: 'File' },
  vulnerability: { icon: Shield, color: '#DC2626', label: 'Vulnerability' },
  database: { icon: Database, color: '#059669', label: 'Database' },
  camera: { icon: Camera, color: '#7C3AED', label: 'Camera' },
  search: { icon: Search, color: '#0EA5E9', label: 'Search Result' }
};

function Canvas({ addToHistory }) {
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showNodeMenu, setShowNodeMenu] = useState(false);
  const [nodeMenuPosition, setNodeMenuPosition] = useState({ x: 0, y: 0 });
  const [showProperties, setShowProperties] = useState(false);

  // Canvas manipulation functions
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Node creation and management
  const createNode = (type, x, y, data = {}) => {
    const newNode = {
      id: Date.now().toString(),
      type,
      x: (x - pan.x) / zoom,
      y: (y - pan.y) / zoom,
      data: {
        label: data.label || `New ${nodeTypes[type].label}`,
        description: data.description || '',
        metadata: data.metadata || {},
        ...data
      },
      selected: false
    };
    setNodes(prev => [...prev, newNode]);
    return newNode;
  };

  const updateNode = (nodeId, updates) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ));
  };

  const deleteNode = (nodeId) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setConnections(prev => prev.filter(conn => 
      conn.source !== nodeId && conn.target !== nodeId
    ));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  };

  // Connection management
  const createConnection = (sourceId, targetId, label = '') => {
    const connectionId = `${sourceId}-${targetId}`;
    if (connections.some(conn => conn.id === connectionId)) return;
    
    const newConnection = {
      id: connectionId,
      source: sourceId,
      target: targetId,
      label,
      selected: false
    };
    setConnections(prev => [...prev, newConnection]);
  };

  const deleteConnection = (connectionId) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    if (selectedConnection?.id === connectionId) {
      setSelectedConnection(null);
    }
  };

  // Event handlers
  const handleCanvasClick = (e) => {
    // Don't handle canvas clicks if clicking on UI elements
    if (e.target.closest('.properties-panel') || e.target.closest('.toolbar') || e.target.closest('.node-menu')) {
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (e.detail === 2) { // Double click
      setNodeMenuPosition({ x, y });
      setShowNodeMenu(true);
    } else {
      setShowNodeMenu(false);
      setSelectedNode(null);
      setSelectedConnection(null);
      if (isConnecting) {
        setIsConnecting(false);
        setConnectionStart(null);
      }
    }
  };

  const handleNodeClick = (node, e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (isConnecting) {
      if (connectionStart && connectionStart.id !== node.id) {
        createConnection(connectionStart.id, node.id, 'connected to');
        setIsConnecting(false);
        setConnectionStart(null);
      } else if (!connectionStart) {
        setConnectionStart(node);
      }
    } else {
      setSelectedNode(node);
      setShowProperties(true);
    }
  };

  const handleNodeMouseDown = (node, e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (e.button === 0 && !isConnecting) { // Left click and not in connecting mode
      setDraggedNode(node);
      const rect = canvasRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left - node.x * zoom - pan.x,
        y: e.clientY - rect.top - node.y * zoom - pan.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (draggedNode && !isConnecting) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = (e.clientX - rect.left - dragOffset.x - pan.x) / zoom;
      const newY = (e.clientY - rect.top - dragOffset.y - pan.y) / zoom;
      
      updateNode(draggedNode.id, { x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  // Canvas save/load functionality
  const saveCanvas = () => {
    const canvasData = {
      nodes,
      connections,
      metadata: {
        created: new Date().toISOString(),
        zoom,
        pan
      }
    };
    
    const blob = new Blob([JSON.stringify(canvasData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `canvas-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadCanvas = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const canvasData = JSON.parse(e.target.result);
          setNodes(canvasData.nodes || []);
          setConnections(canvasData.connections || []);
          if (canvasData.metadata) {
            setZoom(canvasData.metadata.zoom || 1);
            setPan(canvasData.metadata.pan || { x: 0, y: 0 });
          }
        } catch (error) {
          console.error('Error loading canvas:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  // Add event listeners and check for imports
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMoveWrapper = (e) => {
      if (draggedNode && !isConnecting) {
        const rect = canvas.getBoundingClientRect();
        const newX = (e.clientX - rect.left - dragOffset.x - pan.x) / zoom;
        const newY = (e.clientY - rect.top - dragOffset.y - pan.y) / zoom;
        
        updateNode(draggedNode.id, { x: newX, y: newY });
      }
    };

    const handleMouseUpWrapper = (e) => {
      setDraggedNode(null);
    };

    document.addEventListener('mousemove', handleMouseMoveWrapper);
    document.addEventListener('mouseup', handleMouseUpWrapper);
    
    // Check for imported data
    const importData = sessionStorage.getItem('canvasImport');
    if (importData) {
      try {
        const data = JSON.parse(importData);
        importFromSearch(data);
        sessionStorage.removeItem('canvasImport');
      } catch (error) {
        console.error('Error importing data:', error);
      }
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMoveWrapper);
      document.removeEventListener('mouseup', handleMouseUpWrapper);
    };
  }, [draggedNode, dragOffset, pan, zoom, isConnecting]);

  // Import from search results
  const importFromSearch = (searchResult) => {
    const centerX = 400;
    const centerY = 300;
    
    if (searchResult.type === 'subfinder') {
      // Create domain node
      const domainNode = createNode('domain', centerX, centerY, {
        label: searchResult.domain,
        description: `Main domain: ${searchResult.domain}`,
        metadata: searchResult
      });

      // Create subdomain nodes
      searchResult.subdomains.forEach((subdomain, index) => {
        const angle = (index / searchResult.subdomains.length) * 2 * Math.PI;
        const radius = 150;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        const subdomainNode = createNode('subdomain', x, y, {
          label: subdomain.subdomain,
          description: `Status: ${subdomain.httpStatus} - ${subdomain.status}`,
          metadata: subdomain
        });

        createConnection(domainNode.id, subdomainNode.id, 'subdomain of');
      });
    } else if (searchResult.type === 'dork') {
      createNode('search', centerX, centerY, {
        label: 'Search Result',
        description: searchResult.query,
        metadata: searchResult
      });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4 toolbar">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold" style={{color: 'rgb(0, 0, 255)'}}>
              Investigation Canvas
            </h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleZoomOut}
                className="p-2 hover:bg-gray-100 rounded"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-600">{Math.round(zoom * 100)}%</span>
              <button
                onClick={handleZoomIn}
                className="p-2 hover:bg-gray-100 rounded"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={handleResetView}
                className="p-2 hover:bg-gray-100 rounded"
                title="Reset View"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setIsConnecting(!isConnecting);
                setConnectionStart(null);
              }}
              className={`px-4 py-2 rounded flex items-center space-x-2 ${
                isConnecting 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              title="Connect Nodes Mode"
            >
              <LinkIcon className="h-4 w-4" />
              <span>{isConnecting ? 'Connecting...' : 'Connect'}</span>
            </button>
            <input
              type="file"
              accept=".json"
              onChange={loadCanvas}
              className="hidden"
              id="load-canvas"
            />
            <label
              htmlFor="load-canvas"
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer flex items-center space-x-1"
            >
              <Upload className="h-4 w-4" />
              <span>Load</span>
            </label>
            <button
              onClick={saveCanvas}
              className="px-3 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded flex items-center space-x-1"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative overflow-hidden bg-white">
        <svg
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onClick={handleCanvasClick}
          onMouseDown={(e) => {
            // Only handle canvas mouse down, not on UI elements
            if (!e.target.closest('.properties-panel') && !e.target.closest('.toolbar') && !e.target.closest('.node-menu')) {
              // This is for canvas panning in the future if needed
            }
          }}
          style={{ transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)` }}
        >
          {/* Grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
            <pattern id="gridMajor" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <rect width="100%" height="100%" fill="url(#gridMajor)" />

          {/* Connections */}
          {connections.map(connection => {
            const sourceNode = nodes.find(n => n.id === connection.source);
            const targetNode = nodes.find(n => n.id === connection.target);
            
            if (!sourceNode || !targetNode) return null;

            return (
              <g key={connection.id}>
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={connection.selected ? '#3B82F6' : '#6B7280'}
                  strokeWidth={connection.selected ? 3 : 2}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedConnection(connection);
                  }}
                  className="cursor-pointer"
                />
                {connection.label && (
                  <text
                    x={(sourceNode.x + targetNode.x) / 2}
                    y={(sourceNode.y + targetNode.y) / 2}
                    fill="#374151"
                    fontSize="12"
                    textAnchor="middle"
                    className="pointer-events-none select-none"
                  >
                    {connection.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map(node => {
            const NodeIcon = nodeTypes[node.type].icon;
            const isSelected = selectedNode?.id === node.id;
            const isConnectionStart = connectionStart?.id === node.id;
            
            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={(e) => handleNodeClick(node, e)}
                onMouseDown={(e) => handleNodeMouseDown(node, e)}
                className={`cursor-pointer ${draggedNode?.id === node.id ? 'cursor-grabbing' : 'cursor-grab'}`}
                style={{ pointerEvents: 'all' }}
              >
                {/* Node circle */}
                <circle
                  r="25"
                  fill={nodeTypes[node.type].color}
                  stroke={
                    draggedNode?.id === node.id ? '#FF0000' :
                    isConnectionStart ? '#00FF00' :
                    isSelected ? '#3B82F6' : 
                    isConnecting ? '#FFA500' : '#ffffff'
                  }
                  strokeWidth={isSelected || isConnectionStart || draggedNode?.id === node.id ? 4 : 2}
                  className="drop-shadow-md"
                  opacity={draggedNode?.id === node.id ? 0.8 : 1}
                />
                
                {/* Connection indicator for connecting mode */}
                {isConnecting && (
                  <circle
                    r="30"
                    fill="none"
                    stroke={isConnectionStart ? '#00FF00' : '#FFA500'}
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity="0.7"
                  />
                )}
                
                {/* Node icon */}
                <foreignObject x="-12" y="-12" width="24" height="24">
                  <NodeIcon className="h-6 w-6 text-white" />
                </foreignObject>
                
                {/* Node label */}
                <text
                  y="45"
                  fill="#374151"
                  fontSize="12"
                  textAnchor="middle"
                  className="pointer-events-none select-none font-medium"
                >
                  {node.data.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Node Creation Menu */}
        {showNodeMenu && (
          <div
            className="absolute bg-white border border-gray-200 rounded-lg shadow-xl p-3 z-10 node-menu"
            style={{ left: nodeMenuPosition.x, top: nodeMenuPosition.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Add Node</h4>
            <div className="grid grid-cols-2 gap-1 max-w-xs">
              {Object.entries(nodeTypes).map(([type, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={type}
                    onClick={() => {
                      createNode(type, nodeMenuPosition.x, nodeMenuPosition.y);
                      setShowNodeMenu(false);
                    }}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded text-sm whitespace-nowrap"
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" style={{ color: config.color }} />
                    <span className="text-xs">{config.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Mini-map */}
        {nodes.length > 0 && (
          <div className="absolute bottom-4 right-4 w-48 h-32 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-50 px-2 py-1 border-b text-xs font-medium text-gray-600">
              Mini Map
            </div>
            <svg className="w-full h-full" viewBox="0 0 800 600">
              {/* Mini nodes */}
              {nodes.map(node => (
                <circle
                  key={node.id}
                  cx={node.x / 5}
                  cy={node.y / 5}
                  r="2"
                  fill={nodeTypes[node.type].color}
                  opacity="0.7"
                />
              ))}
              {/* Mini connections */}
              {connections.map(connection => {
                const sourceNode = nodes.find(n => n.id === connection.source);
                const targetNode = nodes.find(n => n.id === connection.target);
                if (!sourceNode || !targetNode) return null;
                return (
                  <line
                    key={connection.id}
                    x1={sourceNode.x / 5}
                    y1={sourceNode.y / 5}
                    x2={targetNode.x / 5}
                    y2={targetNode.y / 5}
                    stroke="#6B7280"
                    strokeWidth="1"
                    opacity="0.5"
                  />
                );
              })}
            </svg>
          </div>
        )}
      </div>

      {/* Properties Panel */}
      {showProperties && selectedNode && (
        <div 
          className="absolute right-0 top-16 bottom-0 w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto z-50"
          style={{ zIndex: 1000 }}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseMove={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Node Properties</h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowProperties(false);
                setSelectedNode(null);
              }}
              className="text-gray-400 hover:text-gray-600 p-1 rounded text-xl font-bold"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label
              </label>
              <input
                type="text"
                value={selectedNode.data.label || ''}
                onChange={(e) => {
                  const newNode = {
                    ...selectedNode,
                    data: { ...selectedNode.data, label: e.target.value }
                  };
                  setSelectedNode(newNode);
                  updateNode(selectedNode.id, {
                    data: { ...selectedNode.data, label: e.target.value }
                  });
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseMove={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                onKeyUp={(e) => e.stopPropagation()}
                onInput={(e) => e.stopPropagation()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ pointerEvents: 'auto', zIndex: 1001 }}
                autoComplete="off"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={selectedNode.data.description || ''}
                onChange={(e) => {
                  const newNode = {
                    ...selectedNode,
                    data: { ...selectedNode.data, description: e.target.value }
                  };
                  setSelectedNode(newNode);
                  updateNode(selectedNode.id, {
                    data: { ...selectedNode.data, description: e.target.value }
                  });
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseMove={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                onKeyUp={(e) => e.stopPropagation()}
                onInput={(e) => e.stopPropagation()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                style={{ pointerEvents: 'auto', zIndex: 1001 }}
                autoComplete="off"
                placeholder="Enter description..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={selectedNode.type}
                onChange={(e) => {
                  updateNode(selectedNode.id, { type: e.target.value });
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseMove={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ pointerEvents: 'auto', zIndex: 1001 }}
              >
                {Object.entries(nodeTypes).map(([type, config]) => (
                  <option key={type} value={type}>{config.label}</option>
                ))}
              </select>
            </div>
            
            {selectedNode.data.metadata && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Metadata
                </label>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                  {JSON.stringify(selectedNode.data.metadata, null, 2)}
                </pre>
              </div>
            )}
            
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNode(selectedNode.id);
                  setShowProperties(false);
                  setSelectedNode(null);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className="flex-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                style={{ pointerEvents: 'auto' }}
              >
                Delete Node
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="bg-gray-100 border-t border-gray-200 px-4 py-2 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <div>
            Nodes: {nodes.length} | Connections: {connections.length}
          </div>
          <div>
            {isConnecting 
              ? connectionStart 
                ? 'Click another node to connect them'
                : 'Click a node to start connecting'
              : 'Double-click to add node | Click "Connect" then click two nodes to link them'
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Canvas;
