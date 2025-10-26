import React, { useState, useEffect } from 'react';
import { Megaphone, Calendar, Users, Target, ChartBar as BarChart3, Plus, CreditCard as Edit, Trash2, Save, Download, Send, Eye, CircleCheck as CheckCircle } from 'lucide-react';
import { AwarenessCampaign, CampaignContent, CampaignType, CampaignMetrics, CampaignFeedback } from '../types';
import { Breadcrumbs } from '../../../shared/components/layout/Breadcrumbs';
import { useInternalLinking } from '../../../shared/hooks/useInternalLinking';

interface AwarenessCampaignPlannerProps {
  onSave?: (campaign: AwarenessCampaign) => void;
  onExport?: (campaign: AwarenessCampaign) => void;
  initialCampaign?: AwarenessCampaign;
}

const CAMPAIGN_TYPES: CampaignType[] = [
  'Email Campaign', 'Workshop', 'Webinar', 'Poster Campaign',
  'Video Series', 'Interactive Training', 'Gamification', 'Newsletter'
];

const CONTENT_TYPES = ['email', 'poster', 'video', 'webinar', 'workshop', 'newsletter'] as const;

const AwarenessCampaignPlanner: React.FC<AwarenessCampaignPlannerProps> = ({
  onSave,
  onExport,
  initialCampaign
}) => {
  const { breadcrumbs } = useInternalLinking();
  const [campaign, setCampaign] = useState<AwarenessCampaign>(
    initialCampaign || {
      id: '',
      title: '',
      description: '',
      type: 'Email Campaign',
      targetAudience: [],
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'planned',
      content: [],
      metrics: {
        totalSent: 0,
        openRate: 0,
        clickRate: 0,
        completionRate: 0,
        engagementRate: 0,
        feedback: []
      },
      createdDate: new Date(),
      lastUpdated: new Date(),
      owner: '',
      budget: 0,
      tags: []
    }
  );

  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'schedule' | 'metrics'>('overview');
  const [showContentForm, setShowContentForm] = useState(false);
  const [editingContent, setEditingContent] = useState<string | null>(null);

  const [newContent, setNewContent] = useState<Partial<CampaignContent>>({
    type: 'email',
    title: '',
    content: '',
    scheduledDate: new Date(),
    status: 'draft',
    targetAudience: [],
    resources: []
  });

  const [newAudience, setNewAudience] = useState('');
  const [newTag, setNewTag] = useState('');

  const addTargetAudience = () => {
    if (newAudience.trim()) {
      setCampaign(prev => ({
        ...prev,
        targetAudience: [...prev.targetAudience, newAudience.trim()]
      }));
      setNewAudience('');
    }
  };

  const removeTargetAudience = (index: number) => {
    setCampaign(prev => ({
      ...prev,
      targetAudience: prev.targetAudience.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (newTag.trim()) {
      setCampaign(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setCampaign(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const addContent = () => {
    if (!newContent.title || !newContent.content) return;

    const content: CampaignContent = {
      id: Date.now().toString(),
      type: newContent.type!,
      title: newContent.title!,
      content: newContent.content!,
      scheduledDate: newContent.scheduledDate!,
      status: newContent.status!,
      targetAudience: newContent.targetAudience || [],
      resources: newContent.resources || []
    };

    setCampaign(prev => ({
      ...prev,
      content: [...prev.content, content],
      lastUpdated: new Date()
    }));

    setNewContent({
      type: 'email',
      title: '',
      content: '',
      scheduledDate: new Date(),
      status: 'draft',
      targetAudience: [],
      resources: []
    });
    setShowContentForm(false);
  };

  const updateContent = (contentId: string, updates: Partial<CampaignContent>) => {
    setCampaign(prev => ({
      ...prev,
      content: prev.content.map(content =>
        content.id === contentId ? { ...content, ...updates } : content
      ),
      lastUpdated: new Date()
    }));
    setEditingContent(null);
  };

  const deleteContent = (contentId: string) => {
    setCampaign(prev => ({
      ...prev,
      content: prev.content.filter(content => content.id !== contentId),
      lastUpdated: new Date()
    }));
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'email': return <Megaphone className="w-4 h-4 text-blue-500" />;
      case 'poster': return <Target className="w-4 h-4 text-green-500" />;
      case 'video': return <Eye className="w-4 h-4 text-red-500" />;
      case 'webinar': return <Users className="w-4 h-4 text-purple-500" />;
      case 'workshop': return <CheckCircle className="w-4 h-4 text-orange-500" />;
      case 'newsletter': return <BarChart3 className="w-4 h-4 text-indigo-500" />;
      default: return <Megaphone className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string): string => {
    const colors = {
      'planned': 'text-blue-600 bg-blue-100',
      'active': 'text-green-600 bg-green-100',
      'completed': 'text-gray-600 bg-gray-100',
      'cancelled': 'text-red-600 bg-red-100'
    };
    return colors[status as keyof typeof colors] || colors.planned;
  };

  const getContentStatusColor = (status: string): string => {
    const colors = {
      'draft': 'text-gray-600 bg-gray-100',
      'scheduled': 'text-yellow-600 bg-yellow-100',
      'sent': 'text-green-600 bg-green-100',
      'published': 'text-blue-600 bg-blue-100'
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Campaign Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Campaign Title
          </label>
          <input
            type="text"
            value={campaign.title}
            onChange={(e) => setCampaign(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter campaign title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Campaign Type
          </label>
          <select
            value={campaign.type}
            onChange={(e) => setCampaign(prev => ({ ...prev, type: e.target.value as CampaignType }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            {CAMPAIGN_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Owner
          </label>
          <input
            type="text"
            value={campaign.owner}
            onChange={(e) => setCampaign(prev => ({ ...prev, owner: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter owner name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Budget ($)
          </label>
          <input
            type="number"
            value={campaign.budget || 0}
            onChange={(e) => setCampaign(prev => ({ ...prev, budget: parseFloat(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter budget"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={campaign.description}
            onChange={(e) => setCampaign(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter campaign description"
          />
        </div>
      </div>

      {/* Target Audience */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Target Audience
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newAudience}
            onChange={(e) => setNewAudience(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTargetAudience()}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter target audience"
          />
          <button
            onClick={addTargetAudience}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {campaign.targetAudience.map((audience, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="flex-1 text-gray-900 dark:text-white">{audience}</span>
              <button
                onClick={() => removeTargetAudience(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTag()}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter tag"
          />
          <button
            onClick={addTag}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {campaign.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
            >
              {tag}
              <button
                onClick={() => removeTag(index)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <XCircle className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Campaign Content ({campaign.content.length} items)
        </h3>
        <button
          onClick={() => setShowContentForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Content
        </button>
      </div>

      {campaign.content.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No content added yet. Click "Add Content" to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {campaign.content.map((content) => (
            <div key={content.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getContentIcon(content.type)}
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {content.title}
                    </h4>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                      {content.type.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getContentStatusColor(content.status)}`}>
                      {content.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {content.content}
                  </p>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Scheduled: {content.scheduledDate.toLocaleDateString()}
                  </div>
                  {content.targetAudience.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Target Audience:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {content.targetAudience.map((audience, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                            {audience}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingContent(content.id)}
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteContent(content.id)}
                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={campaign.startDate.toISOString().split('T')[0]}
            onChange={(e) => setCampaign(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={campaign.endDate.toISOString().split('T')[0]}
            onChange={(e) => setCampaign(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            value={campaign.status}
            onChange={(e) => setCampaign(prev => ({ ...prev, status: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="planned">Planned</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Campaign Timeline */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Campaign Timeline
        </h3>
        <div className="space-y-4">
          {campaign.content
            .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
            .map((content) => (
              <div key={content.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    {getContentIcon(content.type)}
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {content.title}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getContentStatusColor(content.status)}`}>
                      {content.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {content.scheduledDate.toLocaleDateString()} at {content.scheduledDate.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderMetrics = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Campaign Metrics
      </h3>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {campaign.metrics.totalSent}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400">Total Sent</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {campaign.metrics.openRate}%
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">Open Rate</div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {campaign.metrics.clickRate}%
          </div>
          <div className="text-sm text-yellow-600 dark:text-yellow-400">Click Rate</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {campaign.metrics.completionRate}%
          </div>
          <div className="text-sm text-purple-600 dark:text-purple-400">Completion Rate</div>
        </div>
      </div>

      {/* Engagement Rate */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Engagement Rate</h4>
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          {campaign.metrics.engagementRate}%
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Overall campaign engagement
        </div>
      </div>

      {/* Feedback */}
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Feedback</h4>
        {campaign.metrics.feedback.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No feedback received yet.
          </div>
        ) : (
          <div className="space-y-4">
            {campaign.metrics.feedback.map((feedback) => (
              <div key={feedback.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {feedback.date.toLocaleDateString()}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    feedback.helpful ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {feedback.helpful ? 'Helpful' : 'Not Helpful'}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{feedback.comments}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Megaphone className="w-6 h-6 text-purple-600" />
                Awareness Campaign Planner
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Plan and manage security awareness campaigns for CMMC 2.0 compliance
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onSave?.(campaign)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Campaign
              </button>
              <button
                onClick={() => onExport?.(campaign)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'content', label: 'Content', icon: FileText },
              { id: 'schedule', label: 'Schedule', icon: Calendar },
              { id: 'metrics', label: 'Metrics', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'content' && renderContent()}
          {activeTab === 'schedule' && renderSchedule()}
          {activeTab === 'metrics' && renderMetrics()}
        </div>

        {/* Content Form Modal */}
        {showContentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Add Campaign Content
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newContent.title}
                      onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type
                    </label>
                    <select
                      value={newContent.type}
                      onChange={(e) => setNewContent(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      {CONTENT_TYPES.map(type => (
                        <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content
                  </label>
                  <textarea
                    value={newContent.content}
                    onChange={(e) => setNewContent(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Scheduled Date
                    </label>
                    <input
                      type="datetime-local"
                      value={newContent.scheduledDate?.toISOString().slice(0, 16)}
                      onChange={(e) => setNewContent(prev => ({ ...prev, scheduledDate: new Date(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={newContent.status}
                      onChange={(e) => setNewContent(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="draft">Draft</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="sent">Sent</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button
                  onClick={() => setShowContentForm(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addContent}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Content
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AwarenessCampaignPlanner;