import React, { useState } from 'react';
import { 
  Save, X, Shield, Server, Database, Users, Building, 
  FileText, Cloud, Info, Lock, Award
} from 'lucide-react';
import { 
  Asset, 
  AssetCategory, 
  AssetType, 
  CriticalityLevel, 
  InformationClassification, 
  AssetStatus,
  BusinessValue
} from '../../../shared/types/assets';

interface AssetCreationFormProps {
  onSubmit: (asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  initialData?: Partial<Asset>;
}

export const AssetCreationForm: React.FC<AssetCreationFormProps> = ({
  onSubmit,
  onCancel,
  initialData
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    category: initialData?.category || 'hardware' as AssetCategory,
    subcategory: initialData?.subcategory || '',
    type: initialData?.type || 'server' as AssetType,
    owner: initialData?.owner || '',
    custodian: initialData?.custodian || '',
    status: initialData?.status || 'active' as AssetStatus,
    criticality: initialData?.criticality || 'medium' as CriticalityLevel,
    informationClassification: initialData?.informationClassification || 'internal' as InformationClassification,
    businessValue: initialData?.businessValue || 'operational' as BusinessValue,
    dataClassification: {
      sensitivityLevel: 'medium' as 'low' | 'medium' | 'high' | 'critical',
      regulatoryRequirements: [] as string[],
      dataTypes: [] as string[],
      accessRestrictions: 'standard' as 'public' | 'standard' | 'restricted' | 'highly-restricted'
    },
    handlesCUI: initialData?.handlesCUI || false,
    cuiCategory: initialData?.cuiCategory || [],
    cmmcApplicability: initialData?.cmmcApplicability || {
      level: 2,
      domains: [],
      controls: [],
      maturityProcesses: [],
      assessmentScope: 'not-applicable' as 'full' | 'partial' | 'not-applicable'
    },
    cuiScope: initialData?.cuiScope || {
      inScope: false,
      scopeJustification: '',
      boundaryDefinition: '',
      dataTypes: [],
      systems: [],
      networks: []
    },
    location: {
      type: 'physical' as const,
      building: '',
      room: '',
      address: ''
    },
    tags: initialData?.tags?.join(', ') || ''
  });
  
  const [showClassificationHelp, setShowClassificationHelp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      alert('Asset name is required');
      return;
    }
    
    if (!formData.description.trim()) {
      alert('Asset description is required');
      return;
    }
    
    if (!formData.owner.trim()) {
      alert('Asset owner is required');
      return;
    }
    
    const newAsset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      subcategory: formData.subcategory,
      type: formData.type,
      owner: formData.owner,
      custodian: formData.custodian,
      location: formData.location,
      status: formData.status,
      criticality: formData.criticality,
      informationClassification: formData.informationClassification,
      businessValue: formData.businessValue,
      technicalSpecs: {},
      dependencies: [],
      controls: [],
      vulnerabilities: [],
      riskAssessment: {
        overallRisk: 'medium',
        riskFactors: [],
        threats: [],
        impact: {
          confidentiality: 'medium',
          integrity: 'medium',
          availability: 'medium',
          financialImpact: 'TBD',
          operationalImpact: 'TBD',
          reputationalImpact: 'TBD',
          legalImpact: 'TBD'
        },
        likelihood: {
          threatLevel: 'medium',
          vulnerabilityLevel: 'medium',
          exposureLevel: 'medium',
          historicalIncidents: 0,
          industryTrends: 'TBD'
        },
        riskTreatment: {
          strategy: 'mitigate',
          controls: [],
          residualRisk: 'medium'
        },
        lastAssessment: new Date(),
        nextAssessment: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        assessedBy: formData.owner
      },
      compliance: [],
      lifecycle: {
        phase: 'operation',
        deploymentDate: new Date(),
        maintenanceSchedule: {
          frequency: 'quarterly',
          nextMaintenance: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
          maintenanceType: 'preventive',
          assignedTo: formData.custodian
        }
      },
      lastReviewed: new Date(),
      nextReview: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      metadata: {}
    };

    // Add CUI-specific fields
    if (formData.handlesCUI) {
      (newAsset as any).handlesCUI = true;
      (newAsset as any).cuiCategory = formData.cuiCategory;
      (newAsset as any).cmmcApplicability = formData.cmmcApplicability;
      (newAsset as any).cuiScope = formData.cuiScope;
      (newAsset as any).dataFlow = {
        inputSources: [],
        outputDestinations: [],
        dataAtRest: {
          storageLocation: '',
          encryptionMethod: '',
          accessControls: [],
          backupProcedures: [],
          retentionPeriod: ''
        },
        dataInTransit: {
          transportMethods: [],
          encryptionProtocols: [],
          networkSegmentation: false,
          authorizedPaths: []
        },
        dataInUse: {
          processingControls: [],
          userAccessControls: [],
          sessionManagement: [],
          dataHandlingProcedures: []
        }
      };
    } else {
      (newAsset as any).handlesCUI = false;
      (newAsset as any).cuiCategory = [];
      (newAsset as any).cmmcApplicability = {
        level: 1,
        domains: [],
        controls: [],
        maturityProcesses: [],
        assessmentScope: 'not-applicable'
      };
      (newAsset as any).cuiScope = {
        inScope: false,
        scopeJustification: 'Asset does not handle CUI',
        boundaryDefinition: '',
        dataTypes: [],
        systems: [],
        networks: []
      };
    }
    onSubmit(newAsset);
  };

  const categoryOptions: { value: AssetCategory; label: string; icon: any }[] = [
    { value: 'hardware', label: 'Hardware', icon: Server },
    { value: 'software', label: 'Software', icon: Database },
    { value: 'data', label: 'Data', icon: FileText },
    { value: 'personnel', label: 'Personnel', icon: Users },
    { value: 'facilities', label: 'Facilities', icon: Building },
    { value: 'services', label: 'Services', icon: Cloud },
    { value: 'documents', label: 'Documents', icon: FileText },
    { value: 'intellectual-property', label: 'Intellectual Property', icon: Shield }
  ];


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-support-light dark:border-support-dark">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {initialData ? 'Edit Asset' : 'Create New Asset'}
          </h2>
          <button
            onClick={onCancel}
            className="text-text-muted-dark hover:text-text-secondary-light dark:hover:text-text-secondary-dark"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* CUI Information Section - CMMC Specific */}
        <div className="border border-orange-200 dark:border-orange-700 rounded-xl p-6 bg-orange-50 dark:bg-orange-900/20">
          <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Controlled Unclassified Information (CUI)
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="handlesCUI"
                checked={formData.handlesCUI || false}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  handlesCUI: e.target.checked,
                  cuiCategory: e.target.checked ? prev.cuiCategory || [] : []
                }))}
                className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
              />
              <label htmlFor="handlesCUI" className="text-orange-800 dark:text-orange-200 font-medium">
                This asset processes, stores, or transmits Controlled Unclassified Information (CUI)
              </label>
            </div>
            
            {formData.handlesCUI && (
              <div className="space-y-4 ml-6 pl-4 border-l-2 border-orange-300 dark:border-orange-600">
                <div>
                  <label className="block text-sm font-medium text-orange-800 dark:text-orange-200 mb-2">
                    CUI Categories (select all that apply)
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'basic', label: 'CUI Basic', description: 'Standard CUI protection requirements' },
                      { value: 'specified', label: 'CUI Specified', description: 'Additional safeguarding requirements' },
                      { value: 'cui-sp', label: 'CUI SP', description: 'Specified categories with enhanced controls' }
                    ].map((category) => (
                      <label key={category.value} className="flex items-start space-x-3 p-3 bg-surface-light dark:bg-surface-dark rounded-lg border border-orange-200 dark:border-orange-600">
                        <input
                          type="checkbox"
                          checked={formData.cuiCategory?.some(c => c.category === category.value) || false}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                cuiCategory: [
                                  ...(prev.cuiCategory || []),
                                  {
                                    category: category.value as any,
                                    subcategory: '',
                                    markings: [],
                                    handlingRequirements: []
                                  }
                                ]
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                cuiCategory: prev.cuiCategory?.filter(c => c.category !== category.value) || []
                              }));
                            }
                          }}
                          className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-orange-900 dark:text-orange-100">{category.label}</div>
                          <div className="text-sm text-orange-700 dark:text-orange-300">{category.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-orange-800 dark:text-orange-200 mb-2">
                    CMMC Assessment Scope
                  </label>
                  <select
                    value={formData.cmmcApplicability?.assessmentScope || 'not-applicable'}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      cmmcApplicability: {
                        level: 2,
                        domains: [],
                        controls: [],
                        maturityProcesses: [],
                        assessmentScope: e.target.value as any
                      }
                    }))}
                    className="w-full px-4 py-2 border border-orange-300 dark:border-orange-600 rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="not-applicable">Not Applicable</option>
                    <option value="full">Full CMMC Scope</option>
                    <option value="partial">Partial CMMC Scope</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-orange-800 dark:text-orange-200 mb-2">
                    CUI Data Types (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.cuiScope?.dataTypes?.join(', ') || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      cuiScope: {
                        inScope: true,
                        scopeJustification: '',
                        boundaryDefinition: '',
                        dataTypes: e.target.value.split(',').map(t => t.trim()).filter(Boolean),
                        systems: [],
                        networks: []
                      }
                    }))}
                    className="w-full px-4 py-2 border border-orange-300 dark:border-orange-600 rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Technical Data, Financial Information, Legal Documents"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                Asset Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter asset name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as AssetCategory }))}
                className="w-full px-4 py-2 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="Describe the asset and its purpose"
            />
          </div>

          {/* Classification and Criticality */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                Criticality Level *
              </label>
              <select
                required
                value={formData.criticality}
                onChange={(e) => setFormData(prev => ({ ...prev, criticality: e.target.value as CriticalityLevel }))}
                className="w-full px-4 py-2 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            <div>
              <label className="flex items-center justify-between text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                Information Classification *
                <button
                  type="button"
                  onClick={() => setShowClassificationHelp(!showClassificationHelp)}
                  className="text-text-muted-dark hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <Info className="w-4 h-4" />
                </button>
              </label>
              <select
                required
                value={formData.informationClassification}
                onChange={(e) => setFormData(prev => ({ ...prev, informationClassification: e.target.value as InformationClassification }))}
                className="w-full px-4 py-2 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="public">Public</option>
                <option value="internal">Internal</option>
                <option value="confidential">Confidential</option>
                <option value="restricted">Restricted</option>
                <option value="top-secret">Top Secret</option>
              </select>
              
              {showClassificationHelp && (
                <div className="mt-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                  <div className="text-xs text-primary-800 dark:text-primary-200 space-y-1">
                    <div><strong>Public:</strong> Information intended for public access</div>
                    <div><strong>Internal:</strong> Internal business information</div>
                    <div><strong>Confidential:</strong> Sensitive business information</div>
                    <div><strong>Restricted:</strong> Highly sensitive, regulated data</div>
                    <div><strong>Top Secret:</strong> Maximum security classification</div>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                Status *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as AssetStatus }))}
                className="w-full px-4 py-2 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
                <option value="quarantined">Quarantined</option>
                <option value="disposed">Disposed</option>
                <option value="decommissioned">Decommissioned</option>
              </select>
            </div>
          </div>
          
          {/* Enhanced Data Classification Section */}
          <div className="border border-primary-200 dark:border-primary-700 rounded-xl p-6 bg-primary-50 dark:bg-primary-900/20">
            <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-4 flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Enhanced Data Classification
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-primary-800 dark:text-primary-200 mb-2">
                  Sensitivity Level
                </label>
                <select
                  value={formData.dataClassification.sensitivityLevel}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    dataClassification: { 
                      ...prev.dataClassification, 
                      sensitivityLevel: e.target.value as any 
                    } 
                  }))}
                  className="w-full px-4 py-2 border border-primary-300 dark:border-primary-600 rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="low">Low Sensitivity</option>
                  <option value="medium">Medium Sensitivity</option>
                  <option value="high">High Sensitivity</option>
                  <option value="critical">Critical Sensitivity</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-primary-800 dark:text-primary-200 mb-2">
                  Access Restrictions
                </label>
                <select
                  value={formData.dataClassification.accessRestrictions}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    dataClassification: { 
                      ...prev.dataClassification, 
                      accessRestrictions: e.target.value as any 
                    } 
                  }))}
                  className="w-full px-4 py-2 border border-primary-300 dark:border-primary-600 rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="public">Public Access</option>
                  <option value="standard">Standard Access</option>
                  <option value="restricted">Restricted Access</option>
                  <option value="highly-restricted">Highly Restricted</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-primary-800 dark:text-primary-200 mb-2">
                Regulatory Requirements (comma-separated)
              </label>
              <input
                type="text"
                value={formData.dataClassification.regulatoryRequirements.join(', ')}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  dataClassification: { 
                    ...prev.dataClassification, 
                    regulatoryRequirements: e.target.value.split(',').map(r => r.trim()).filter(Boolean)
                  } 
                }))}
                className="w-full px-4 py-2 border border-primary-300 dark:border-primary-600 rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., GDPR, HIPAA, SOX, PCI-DSS"
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-primary-800 dark:text-primary-200 mb-2">
                Data Types (comma-separated)
              </label>
              <input
                type="text"
                value={formData.dataClassification.dataTypes.join(', ')}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  dataClassification: { 
                    ...prev.dataClassification, 
                    dataTypes: e.target.value.split(',').map(d => d.trim()).filter(Boolean)
                  } 
                }))}
                className="w-full px-4 py-2 border border-primary-300 dark:border-primary-600 rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., PII, PHI, Financial, Customer Data"
              />
            </div>
          </div>

          {/* Ownership */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                Asset Owner *
              </label>
              <input
                type="text"
                required
                value={formData.owner}
                onChange={(e) => setFormData(prev => ({ ...prev, owner: e.target.value }))}
                className="w-full px-4 py-2 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Person responsible for the asset"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                Asset Custodian
              </label>
              <input
                type="text"
                value={formData.custodian}
                onChange={(e) => setFormData(prev => ({ ...prev, custodian: e.target.value }))}
                className="w-full px-4 py-2 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Person managing day-to-day operations"
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                Building
              </label>
              <input
                type="text"
                value={formData.location.building}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  location: { ...prev.location, building: e.target.value }
                }))}
                className="w-full px-4 py-2 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Building name or number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                Room
              </label>
              <input
                type="text"
                value={formData.location.room}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  location: { ...prev.location, room: e.target.value }
                }))}
                className="w-full px-4 py-2 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Room number or name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                Address
              </label>
              <input
                type="text"
                value={formData.location.address}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  location: { ...prev.location, address: e.target.value }
                }))}
                className="w-full px-4 py-2 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Physical address"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="flex items-center justify-between text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
              Tags (comma-separated)
              <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
                Use for categorization and search
              </div>
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full px-4 py-2 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="critical, production, finance, compliance, encrypted"
            />
            <div className="mt-2 text-xs text-text-muted-light dark:text-text-muted-dark">
              Suggested tags: compliance, encryption, backup, critical-infrastructure, customer-data, financial, hr, legal
            </div>
          </div>
          
          {/* Quick Classification Presets */}
          <div className="bg-background-light dark:bg-surface-dark/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Quick Classification Presets
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    informationClassification: 'confidential',
                    criticality: 'high',
                    dataClassification: {
                      ...prev.dataClassification,
                      sensitivityLevel: 'high',
                      regulatoryRequirements: ['GDPR', 'CCPA'],
                      dataTypes: ['PII', 'Customer Data'],
                      accessRestrictions: 'restricted'
                    },
                    tags: prev.tags + (prev.tags ? ', ' : '') + 'customer-data, privacy, high-risk'
                  }));
                }}
                className="p-3 border border-support-light dark:border-support-dark rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-600 transition-colors text-left"
              >
                <div className="font-medium text-text-primary-light dark:text-text-primary-dark">Customer Data</div>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">PII, GDPR/CCPA protected</div>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    informationClassification: 'restricted',
                    criticality: 'critical',
                    dataClassification: {
                      ...prev.dataClassification,
                      sensitivityLevel: 'critical',
                      regulatoryRequirements: ['HIPAA', 'HITECH'],
                      dataTypes: ['PHI', 'Medical Records'],
                      accessRestrictions: 'highly-restricted'
                    },
                    tags: prev.tags + (prev.tags ? ', ' : '') + 'healthcare, phi, hipaa-protected'
                  }));
                }}
                className="p-3 border border-support-light dark:border-support-dark rounded-lg hover:bg-error-50 dark:hover:bg-error-900/20 hover:border-error-300 dark:hover:border-error-600 transition-colors text-left"
              >
                <div className="font-medium text-text-primary-light dark:text-text-primary-dark">Healthcare Data</div>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">PHI, HIPAA protected</div>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    informationClassification: 'confidential',
                    criticality: 'high',
                    dataClassification: {
                      ...prev.dataClassification,
                      sensitivityLevel: 'high',
                      regulatoryRequirements: ['SOX', 'PCI-DSS'],
                      dataTypes: ['Financial Data', 'Payment Information'],
                      accessRestrictions: 'restricted'
                    },
                    tags: prev.tags + (prev.tags ? ', ' : '') + 'financial, payment-data, sox-compliance'
                  }));
                }}
                className="p-3 border border-support-light dark:border-support-dark rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:border-yellow-300 dark:hover:border-yellow-600 transition-colors text-left"
              >
                <div className="font-medium text-text-primary-light dark:text-text-primary-dark">Financial Data</div>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">SOX, PCI-DSS protected</div>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    informationClassification: 'public',
                    criticality: 'low',
                    dataClassification: {
                      ...prev.dataClassification,
                      sensitivityLevel: 'low',
                      regulatoryRequirements: [],
                      dataTypes: ['Public Information'],
                      accessRestrictions: 'public'
                    },
                    tags: prev.tags + (prev.tags ? ', ' : '') + 'public, non-sensitive'
                  }));
                }}
                className="p-3 border border-support-light dark:border-support-dark rounded-lg hover:bg-success-50 dark:hover:bg-success-900/20 hover:border-success-300 dark:hover:border-success-600 transition-colors text-left"
              >
                <div className="font-medium text-text-primary-light dark:text-text-primary-dark">Public Information</div>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">No access restrictions</div>
              </button>
            </div>
          </div>
          
          {/* Business Value Classification */}
          <div>
            <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
              Business Value Classification
            </label>
            <select
              value={formData.businessValue}
              onChange={(e) => setFormData(prev => ({ ...prev, businessValue: e.target.value as BusinessValue }))}
              className="w-full px-4 py-2 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="mission-critical">Mission Critical</option>
              <option value="business-important">Business Important</option>
              <option value="operational">Operational</option>
              <option value="developmental">Developmental</option>
              <option value="administrative">Administrative</option>
            </select>
          </div>

          {/* Form Actions */}
          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-support-light dark:border-support-dark text-text-primary-light dark:text-text-secondary-dark rounded-xl hover:bg-background-light dark:hover:bg-surface-dark transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{initialData ? 'Update Asset' : 'Create Asset'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetCreationForm;