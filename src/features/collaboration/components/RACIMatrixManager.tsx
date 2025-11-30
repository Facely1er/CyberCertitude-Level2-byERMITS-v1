import React, { useState, useEffect } from 'react';
import { Users, Shield, CreditCard as Edit, Save, X, Plus, Trash2, Download, Upload, Info, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Search, ListFilter as Filter, ArrowLeft, RefreshCw } from 'lucide-react';
import { raciMatrixService, RACIMatrix } from '../../../services/raciMatrixService';
import { AssessmentData } from '../../../shared/types';
import { Breadcrumbs } from '../../../shared/components/layout/Breadcrumbs';

interface RACIMatrixManagerProps {
  assessment?: AssessmentData;
  onSave?: (matrix: RACIMatrix) => void;
  onBack?: () => void;
  addNotification?: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

interface Role {
  id: string;
  name: string;
  description: string;
  department: string;
  level: 'executive' | 'management' | 'technical' | 'operational';
}

interface RACIAssignment {
  roleId: string;
  controlId: string;
  responsibility: 'R' | 'A' | 'C' | 'I' | '';
}

export const RACIMatrixManager: React.FC<RACIMatrixManagerProps> = ({
  assessment,
  onSave,
  onBack,
  addNotification
}) => {
  const [roles, setRoles] = useState<Role[]>([
    { id: 'ciso', name: 'CISO', description: 'Chief Information Security Officer', department: 'Security', level: 'executive' },
    { id: 'compliance', name: 'Compliance Officer', description: 'CMMC 2.0 Compliance Lead', department: 'Compliance', level: 'management' },
    { id: 'it-security', name: 'IT Security Team', description: 'Technical security implementation', department: 'IT Security', level: 'technical' },
    { id: 'it-ops', name: 'IT Operations', description: 'System administration and maintenance', department: 'IT Operations', level: 'operational' },
    { id: 'dev-team', name: 'Development Team', description: 'Application development and maintenance', department: 'Development', level: 'technical' }
  ]);

  const [assignments, setAssignments] = useState<RACIAssignment[]>([]);
  const [editingCell, setEditingCell] = useState<{ roleId: string; controlId: string } | null>(null);
  const [showAddRole, setShowAddRole] = useState(false);
  const [newRole, setNewRole] = useState<Partial<Role>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomain, setFilterDomain] = useState<string>('all');
  const [generatedMatrix, setGeneratedMatrix] = useState<RACIMatrix | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const controls = assessment ? extractControlsFromAssessment(assessment) : [];
  const domains = [...new Set(controls.map(c => c.domain))];

  useEffect(() => {
    if (assessment && roles.length > 0) {
      generateInitialMatrix();
    }
  }, [assessment, roles]);

  const generateInitialMatrix = () => {
    if (!assessment) return;

    setIsGenerating(true);
    try {
      const matrix = raciMatrixService.generateRACIMatrix(assessment, {
        name: assessment.organizationInfo?.name || 'Organization',
        roles: roles.map(r => ({
          id: r.id,
          name: r.name,
          department: r.department,
          skills: [],
          level: r.level
        }))
      });

      setGeneratedMatrix(matrix);

      const initialAssignments: RACIAssignment[] = [];
      matrix.matrix.forEach(row => {
        row.forEach(entry => {
          if (entry.responsibility) {
            initialAssignments.push({
              roleId: entry.roleId,
              controlId: entry.controlId,
              responsibility: entry.responsibility
            });
          }
        });
      });

      setAssignments(initialAssignments);
    } catch (error) {
      addNotification?.('error', 'Failed to generate initial RACI matrix');
    } finally {
      setIsGenerating(false);
    }
  };

  const getAssignment = (roleId: string, controlId: string): 'R' | 'A' | 'C' | 'I' | '' => {
    const assignment = assignments.find(a => a.roleId === roleId && a.controlId === controlId);
    return assignment?.responsibility || '';
  };

  const updateAssignment = (roleId: string, controlId: string, responsibility: 'R' | 'A' | 'C' | 'I' | '') => {
    setAssignments(prev => {
      const filtered = prev.filter(a => !(a.roleId === roleId && a.controlId === controlId));
      if (responsibility) {
        return [...filtered, { roleId, controlId, responsibility }];
      }
      return filtered;
    });
    setEditingCell(null);
  };

  const addRole = () => {
    if (!newRole.name || !newRole.department) {
      addNotification?.('error', 'Please fill in role name and department');
      return;
    }

    const role: Role = {
      id: `role-${Date.now()}`,
      name: newRole.name,
      description: newRole.description || '',
      department: newRole.department,
      level: newRole.level || 'operational'
    };

    setRoles([...roles, role]);
    setNewRole({});
    setShowAddRole(false);
    addNotification?.('success', `Role "${role.name}" added successfully`);
  };

  const removeRole = (roleId: string) => {
    if (!confirm('Are you sure you want to remove this role? All assignments will be lost.')) {
      return;
    }

    setRoles(roles.filter(r => r.id !== roleId));
    setAssignments(assignments.filter(a => a.roleId !== roleId));
    addNotification?.('success', 'Role removed successfully');
  };

  const handleSave = () => {
    if (!generatedMatrix) {
      addNotification?.('error', 'No matrix to save');
      return;
    }

    const updatedMatrix: RACIMatrix = {
      ...generatedMatrix,
      matrix: generatedMatrix.matrix.map(row =>
        row.map(entry => {
          const assignment = assignments.find(
            a => a.roleId === entry.roleId && a.controlId === entry.controlId
          );
          return {
            ...entry,
            responsibility: assignment?.responsibility || ''
          };
        })
      )
    };

    onSave?.(updatedMatrix);
    addNotification?.('success', 'RACI Matrix saved successfully');
  };

  const handleExport = () => {
    if (!generatedMatrix) {
      addNotification?.('error', 'No matrix to export');
      return;
    }

    const html = raciMatrixService.generateHTML(generatedMatrix);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RACI-Matrix-${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification?.('success', 'RACI Matrix exported successfully');
  };

  const filteredControls = controls.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = filterDomain === 'all' || c.domain === filterDomain;
    return matchesSearch && matchesDomain;
  });

  const getResponsibilityColor = (resp: string) => {
    switch (resp) {
      case 'R': return 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-200';
      case 'A': return 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200';
      case 'C': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200';
      case 'I': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200';
      default: return 'bg-background-light dark:bg-surface-dark text-text-muted-dark dark:text-text-secondary-light';
    }
  };

  const getRoleStats = (roleId: string) => {
    const roleAssignments = assignments.filter(a => a.roleId === roleId);
    return {
      responsible: roleAssignments.filter(a => a.responsibility === 'R').length,
      accountable: roleAssignments.filter(a => a.responsibility === 'A').length,
      consulted: roleAssignments.filter(a => a.responsibility === 'C').length,
      informed: roleAssignments.filter(a => a.responsibility === 'I').length,
      total: roleAssignments.length
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Breadcrumbs items={[
          { label: 'Team Collaboration', path: '/team' },
          { label: 'RACI Matrix Manager', isActive: true }
        ]} />
      </div>

      {/* Header */}
      <div className="card-standard mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
              <Users className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                RACI Matrix Manager
              </h1>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Define roles and responsibilities for CMMC 2.0 controls
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={generateInitialMatrix}
              disabled={isGenerating || !assessment}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>
            <button
              onClick={handleExport}
              disabled={!generatedMatrix}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={handleSave}
              disabled={!generatedMatrix}
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Matrix</span>
            </button>
          </div>
        </div>
      </div>

      {/* RACI Legend */}
      <div className="card-standard mb-6">
        <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
          RACI Legend
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
              <span className="font-bold text-success-800 dark:text-success-200">R</span>
            </div>
            <div>
              <div className="font-semibold text-text-primary-light dark:text-text-primary-dark">Responsible</div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Does the work</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <span className="font-bold text-primary-800 dark:text-primary-200">A</span>
            </div>
            <div>
              <div className="font-semibold text-text-primary-light dark:text-text-primary-dark">Accountable</div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Final authority</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <span className="font-bold text-yellow-800 dark:text-yellow-200">C</span>
            </div>
            <div>
              <div className="font-semibold text-text-primary-light dark:text-text-primary-dark">Consulted</div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Provides input</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <span className="font-bold text-purple-800 dark:text-purple-200">I</span>
            </div>
            <div>
              <div className="font-semibold text-text-primary-light dark:text-text-primary-dark">Informed</div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Kept updated</div>
            </div>
          </div>
        </div>
      </div>

      {/* Roles Management */}
      <div className="card-standard mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
            Roles ({roles.length})
          </h3>
          <button
            onClick={() => setShowAddRole(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Role</span>
          </button>
        </div>

        {showAddRole && (
          <div className="mb-4 p-4 bg-surface-light dark:bg-surface-dark rounded-lg border border-support-light dark:border-support-dark">
            <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">Add New Role</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Role Name"
                value={newRole.name || ''}
                onChange={e => setNewRole({ ...newRole, name: e.target.value })}
                className="input-standard"
              />
              <input
                type="text"
                placeholder="Department"
                value={newRole.department || ''}
                onChange={e => setNewRole({ ...newRole, department: e.target.value })}
                className="input-standard"
              />
              <input
                type="text"
                placeholder="Description"
                value={newRole.description || ''}
                onChange={e => setNewRole({ ...newRole, description: e.target.value })}
                className="input-standard"
              />
              <select
                value={newRole.level || 'operational'}
                onChange={e => setNewRole({ ...newRole, level: e.target.value as Role['level'] })}
                className="input-standard"
              >
                <option value="executive">Executive</option>
                <option value="management">Management</option>
                <option value="technical">Technical</option>
                <option value="operational">Operational</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddRole(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={addRole}
                className="btn-primary"
              >
                Add Role
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map(role => {
            const stats = getRoleStats(role.id);
            return (
              <div key={role.id} className="p-4 bg-surface-light dark:bg-surface-dark rounded-lg border border-support-light dark:border-support-dark">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark">{role.name}</h4>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{role.department}</p>
                  </div>
                  <button
                    onClick={() => removeRole(role.id)}
                    className="p-1 text-error-light dark:text-error-dark hover:bg-error-light/10 dark:hover:bg-error-dark/10 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-3">{role.description}</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded">
                    {role.level}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-text-secondary-light dark:text-text-secondary-dark">
                      {stats.total} assignments
                    </span>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-4 gap-1 text-xs">
                  <div className="text-center">
                    <div className="font-semibold text-success-600 dark:text-success-400">{stats.responsible}</div>
                    <div className="text-text-muted-light dark:text-text-muted-dark">R</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-primary-600 dark:text-primary-400">{stats.accountable}</div>
                    <div className="text-text-muted-light dark:text-text-muted-dark">A</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-yellow-600 dark:text-yellow-400">{stats.consulted}</div>
                    <div className="text-text-muted-light dark:text-text-muted-dark">C</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-purple-600 dark:text-purple-400">{stats.informed}</div>
                    <div className="text-text-muted-light dark:text-text-muted-dark">I</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="card-standard mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted-light dark:text-text-muted-dark" />
            <input
              type="text"
              placeholder="Search controls..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="input-standard pl-10"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted-light dark:text-text-muted-dark" />
            <select
              value={filterDomain}
              onChange={e => setFilterDomain(e.target.value)}
              className="input-standard pl-10 min-w-[200px]"
            >
              <option value="all">All Domains</option>
              {domains.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* RACI Matrix Table */}
      <div className="card-standard">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-support-light dark:border-support-dark">
                <th className="sticky left-0 bg-surface-light dark:bg-surface-dark px-4 py-3 text-left text-sm font-semibold text-text-primary-light dark:text-text-primary-dark min-w-[300px]">
                  Control
                </th>
                {roles.map(role => (
                  <th key={role.id} className="px-4 py-3 text-center text-sm font-semibold text-text-primary-light dark:text-text-primary-dark min-w-[120px]">
                    <div>{role.name}</div>
                    <div className="text-xs font-normal text-text-secondary-light dark:text-text-secondary-dark">{role.department}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredControls.map((control, idx) => (
                <tr key={control.id} className={`border-b border-support-light dark:border-support-dark ${idx % 2 === 0 ? 'bg-background-light dark:bg-background-dark' : ''}`}>
                  <td className="sticky left-0 bg-surface-light dark:bg-surface-dark px-4 py-3">
                    <div className="font-medium text-text-primary-light dark:text-text-primary-dark">{control.id}</div>
                    <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{control.title}</div>
                    <div className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">{control.domain}</div>
                  </td>
                  {roles.map(role => {
                    const assignment = getAssignment(role.id, control.id);
                    const isEditing = editingCell?.roleId === role.id && editingCell?.controlId === control.id;

                    return (
                      <td key={role.id} className="px-4 py-3 text-center">
                        {isEditing ? (
                          <select
                            value={assignment}
                            onChange={e => updateAssignment(role.id, control.id, e.target.value as any)}
                            onBlur={() => setEditingCell(null)}
                            autoFocus
                            className="input-standard w-full text-center"
                          >
                            <option value="">-</option>
                            <option value="R">R</option>
                            <option value="A">A</option>
                            <option value="C">C</option>
                            <option value="I">I</option>
                          </select>
                        ) : (
                          <button
                            onClick={() => setEditingCell({ roleId: role.id, controlId: control.id })}
                            className={`w-12 h-12 rounded-lg font-bold text-lg transition-all hover:scale-110 ${getResponsibilityColor(assignment)}`}
                          >
                            {assignment || '-'}
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredControls.length === 0 && (
          <div className="text-center py-12 text-text-secondary-light dark:text-text-secondary-dark">
            <Info className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No controls found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

function extractControlsFromAssessment(assessment: AssessmentData): Array<{ id: string; title: string; domain: string }> {
  const controls: Array<{ id: string; title: string; domain: string }> = [];

  Object.keys(assessment.responses).forEach(questionId => {
    const parts = questionId.split('-');
    if (parts.length >= 2) {
      controls.push({
        id: questionId,
        title: `Control ${questionId}`,
        domain: parts[0].toUpperCase()
      });
    }
  });

  return controls;
}
