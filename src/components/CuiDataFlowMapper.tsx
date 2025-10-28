import React, { useState, useRef } from 'react';
import { 
  Database, 
  ArrowRight, 
  Plus, 
  Download, 
  Settings,
  FileText,
  Shield,
  Network,
  Server,
  Users,
  Lock,
  Eye,
  Save,
  Trash2,
  Edit,
  Copy,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Grid,
  Share2,
  Info,
  X,
  ChevronRight
} from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';
import { useInternalLinking } from '@/shared/hooks/useInternalLinking';

interface DataElement {
  id: string;
  name: string;
  type: 'system' | 'process' | 'storage' | 'user' | 'external';
  description: string;
  cuiCategory: string;
  securityLevel: 'low' | 'moderate' | 'high';
  position: { x: number; y: number };
  connections: string[];
  metadata: {
    owner: string;
    classification: string;
    retentionPeriod: string;
    accessControls: string[];
  };
}

interface DataFlow {
  id: string;
  source: string;
  target: string;
  flowType: 'data_input' | 'data_output' | 'data_processing' | 'data_storage';
  cuiInvolved: boolean;
  protections: string[];
  description: string;
}

interface CuiMapping {
  elements: DataElement[];
  flows: DataFlow[];
  metadata: {
    systemName: string;
    owner: string;
    lastUpdated: string;
    version: string;
    complianceFramework: string;
  };
}

export const CuiDataFlowMapper: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { breadcrumbs } = useInternalLinking();
  const [mapping, setMapping] = useState<CuiMapping>({
    elements: [],
    flows: [],
    metadata: {
      systemName: '',
      owner: '',
      lastUpdated: new Date().toISOString(),
      version: '1.0',
      complianceFramework: 'NIST SP 800-171'
    }
  });
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [showAddElement, setShowAddElement] = useState(false);

  const elementTypes = {
    system: { icon: Server, color: 'bg-blue-500' },
    process: { icon: Network, color: 'bg-green-500' },
    storage: { icon: Database, color: 'bg-purple-500' },
    user: { icon: Users, color: 'bg-orange-500' },
    external: { icon: Share2, color: 'bg-red-500' }
  };

  const securityLevels = {
    low: { color: 'border-green-500 bg-green-50 dark:bg-green-900/20', badge: 'Low' },
    moderate: { color: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20', badge: 'Moderate' },
    high: { color: 'border-red-500 bg-red-50 dark:bg-red-900/20', badge: 'High' }
  };

  const addElement = (type: DataElement['type']) => {
    const newElement: DataElement = {
      id: `elem-${Date.now()}`,
      name: `New ${type}`,
      type,
      description: '',
      cuiCategory: 'CRAD',
      securityLevel: 'moderate',
      position: { x: 100, y: 100 },
      connections: [],
      metadata: {
        owner: '',
        classification: 'Internal Use',
        retentionPeriod: '7 years',
        accessControls: ['Encryption', 'Access Logging']
      }
    };
    
    setMapping(prev => ({
      ...prev,
      elements: [...prev.elements, newElement]
    }));
    
    setShowAddElement(false);
  };

  const updateElement = (id: string, updates: Partial<DataElement>) => {
    setMapping(prev => ({
      ...prev,
      elements: prev.elements.map(el => el.id === id ? { ...el, ...updates } : el)
    }));
  };

  const deleteElement = (id: string) => {
    setMapping(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== id),
      flows: prev.flows.filter(flow => flow.source !== id && flow.target !== id)
    }));
    setSelectedElement(null);
  };

  const addFlow = (sourceId: string, targetId: string) => {
    const newFlow: DataFlow = {
      id: `flow-${Date.now()}`,
      source: sourceId,
      target: targetId,
      flowType: 'data_input',
      cuiInvolved: true,
      protections: ['Encryption'],
      description: 'Data transmission between systems'
    };
    
    setMapping(prev => ({
      ...prev,
      flows: [...prev.flows, newFlow]
    }));
  };

  const exportMapping = () => {
    const dataStr = JSON.stringify(mapping, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cui-mapping-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateReport = () => {
    const reportContent = `CUI DATA FLOW MAPPING REPORT
${'='.repeat(50)}

SYSTEM INFORMATION
${'-'.repeat(50)}
System Name: ${mapping.metadata.systemName || 'Not specified'}
Owner: ${mapping.metadata.owner || 'Not specified'}
Last Updated: ${mapping.metadata.lastUpdated}
Version: ${mapping.metadata.version}
Framework: ${mapping.metadata.complianceFramework}

ELEMENTS
${'-'.repeat(50)}
Total Elements: ${mapping.elements.length}
${mapping.elements.map((el, idx) => `
${idx + 1}. ${el.name}
   Type: ${el.type}
   CUI Category: ${el.cuiCategory}
   Security Level: ${el.securityLevel}
   Owner: ${el.metadata.owner}
   Classification: ${el.metadata.classification}
   Access Controls: ${el.metadata.accessControls.join(', ')}
`).join('\n')}

DATA FLOWS
${'-'.repeat(50)}
Total Flows: ${mapping.flows.length}
CUI-Involved Flows: ${mapping.flows.filter(f => f.cuiInvolved).length}
${mapping.flows.map((flow, idx) => {
  const source = mapping.elements.find(e => e.id === flow.source);
  const target = mapping.elements.find(e => e.id === flow.target);
  return `
${idx + 1}. From: ${source?.name} → To: ${target?.name}
   Type: ${flow.flowType}
   CUI Involved: ${flow.cuiInvolved ? 'Yes' : 'No'}
   Protections: ${flow.protections.join(', ')}
`;
}).join('\n')}

DOCUMENT CONTROL
${'-'.repeat(50)}
This document contains information about CUI handling and should be protected accordingly.
Document Classification: For Official Use Only (FOUO)
Distribution: Authorized Personnel Only

Generated by: CyberCertitude CUI Mapper
Document ID: CUI-MAP-${Date.now()}
`;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cui-mapping-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderElement = (element: DataElement) => {
    const ElementIcon = elementTypes[element.type].icon;
    const isSelected = selectedElement === element.id;
    
    return (
      <div
        key={element.id}
        className={`absolute cursor-pointer transform transition-all duration-200 ${
          isSelected ? 'scale-110 z-10' : 'hover:scale-105'
        }`}
        style={{
          left: `${element.position.x}px`,
          top: `${element.position.y}px`
        }}
        onClick={() => setSelectedElement(element.id)}
      >
        <div className={`
          p-4 rounded-lg border-2 min-w-32 text-center shadow-lg bg-white dark:bg-gray-800
          ${securityLevels[element.securityLevel].color}
          ${isSelected ? 'ring-2 ring-blue-500' : ''}
        `}>
          <div className={`w-8 h-8 rounded-full ${elementTypes[element.type].color} flex items-center justify-center mx-auto mb-2`}>
            <ElementIcon className="h-4 w-4 text-white" />
          </div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">{element.name}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{element.cuiCategory}</div>
        </div>
      </div>
    );
  };

  const renderFlow = (flow: DataFlow) => {
    const sourceElement = mapping.elements.find(e => e.id === flow.source);
    const targetElement = mapping.elements.find(e => e.id === flow.target);
    
    if (!sourceElement || !targetElement) return null;

    const sourceX = sourceElement.position.x + 64;
    const sourceY = sourceElement.position.y + 32;
    const targetX = targetElement.position.x + 64;
    const targetY = targetElement.position.y + 32;

    return (
      <svg
        key={flow.id}
        className="absolute top-0 left-0 pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <defs>
          <marker
            id={`arrowhead-${flow.id}`}
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill={flow.cuiInvolved ? '#ef4444' : '#6b7280'}
            />
          </marker>
        </defs>
        <line
          x1={sourceX}
          y1={sourceY}
          x2={targetX}
          y2={targetY}
          stroke={flow.cuiInvolved ? '#ef4444' : '#6b7280'}
          strokeWidth="2"
          strokeDasharray={flow.cuiInvolved ? '0' : '5,5'}
          markerEnd={`url(#arrowhead-${flow.id})`}
        />
      </svg>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">CUI Data Flow Mapper</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Visualize and document Controlled Unclassified Information flows for NIST SP 800-171 compliance
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={generateReport}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Generate Report
            </button>
            <button
              onClick={exportMapping}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Mapping
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Canvas Area */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Network className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-lg">CUI Data Flow Canvas</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  title="Toggle Grid"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div
              ref={canvasRef}
              className={`relative w-full h-96 overflow-auto border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 ${
                showGrid ? 'bg-grid-pattern' : ''
              }`}
              style={{
                backgroundImage: showGrid ? 'radial-gradient(circle, #ccc 1px, transparent 1px)' : 'none',
                backgroundSize: showGrid ? '20px 20px' : 'none'
              }}
            >
              {/* Render data flows */}
              {mapping.flows.map(renderFlow)}
              
              {/* Render elements */}
              {mapping.elements.map(renderElement)}
              
              {mapping.elements.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Elements Added</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Start by adding system elements to map your CUI data flows
                    </p>
                    <button
                      onClick={() => setShowAddElement(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                    >
                      <Plus className="h-4 w-4" />
                      Add System Element
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold">Legend</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Element Types</h4>
                {Object.entries(elementTypes).map(([type, config]) => {
                  const Icon = config.icon;
                  return (
                    <div key={type} className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-full ${config.color} flex items-center justify-center`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm capitalize">{type}</span>
                    </div>
                  );
                })}
              </div>
              <div>
                <h4 className="font-medium mb-3">Security Levels</h4>
                {Object.entries(securityLevels).map(([level, config]) => (
                  <div key={level} className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 border-2 rounded-lg ${config.color}`} />
                    <span className="text-sm">{config.badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Add Element Panel */}
          {showAddElement && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Add Element</h3>
                <button
                  onClick={() => setShowAddElement(false)}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-2">
                {Object.entries(elementTypes).map(([type, config]) => {
                  const Icon = config.icon;
                  return (
                    <button
                      key={type}
                      onClick={() => addElement(type as DataElement['type'])}
                      className="w-full flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-full ${config.color} flex items-center justify-center`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="capitalize text-left">{type}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Element Count */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold mb-4">Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Elements</span>
                <span className="font-medium">{mapping.elements.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Data Flows</span>
                <span className="font-medium">{mapping.flows.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">CUI Flows</span>
                <span className="font-medium">{mapping.flows.filter(f => f.cuiInvolved).length}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => setShowAddElement(true)}
                className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Element
              </button>
              {selectedElement && (
                <>
                  <button className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Edit className="h-4 w-4" />
                    Edit Element
                  </button>
                  <button
                    onClick={() => deleteElement(selectedElement)}
                    className="w-full flex items-center gap-2 px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Element
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

