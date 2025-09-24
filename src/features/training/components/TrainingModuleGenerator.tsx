import React, { useState, useEffect } from 'react';
import { BookOpen, Play, FileText, Users, Clock, Target, Plus, Edit, Trash2, Save, Download, Eye, CheckCircle, XCircle } from 'lucide-react';
import { TrainingModule, TrainingContent, TrainingAssessment, TrainingQuestion, TrainingCategory, TrainingLevel } from '../types';
import { Breadcrumbs } from '../../../shared/components/layout/Breadcrumbs';
import { useInternalLinking } from '../../../shared/hooks/useInternalLinking';

interface TrainingModuleGeneratorProps {
  onSave?: (module: TrainingModule) => void;
  onExport?: (module: TrainingModule) => void;
  initialModule?: TrainingModule;
}

const TRAINING_CATEGORIES: TrainingCategory[] = [
  'CMMC Compliance', 'Security Awareness', 'Technical Training', 'Policy Training',
  'Incident Response', 'Data Protection', 'Access Control', 'Risk Management'
];

const TRAINING_LEVELS: TrainingLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];

const CMMC_PRACTICES = [
  'AC.1.001', 'AC.1.002', 'AC.2.001', 'AC.2.002', 'AC.2.003',
  'AT.1.001', 'AT.1.002', 'AT.2.001', 'AT.2.002', 'AT.2.003',
  'AU.1.001', 'AU.1.002', 'AU.2.001', 'AU.2.002', 'AU.2.003',
  'CA.1.001', 'CA.1.002', 'CA.2.001', 'CA.2.002', 'CA.2.003',
  'CM.1.001', 'CM.1.002', 'CM.2.001', 'CM.2.002', 'CM.2.003'
];

export const TrainingModuleGenerator: React.FC<TrainingModuleGeneratorProps> = ({
  onSave,
  onExport,
  initialModule
}) => {
  const { breadcrumbs } = useInternalLinking();
  const [module, setModule] = useState<TrainingModule>(
    initialModule || {
      id: '',
      title: '',
      description: '',
      category: 'CMMC Compliance',
      level: 'beginner',
      duration: 0,
      objectives: [],
      content: [],
      assessments: [],
      prerequisites: [],
      targetAudience: [],
      cmmcPractices: [],
      createdDate: new Date(),
      lastUpdated: new Date(),
      status: 'draft',
      version: '1.0',
      author: '',
      tags: []
    }
  );

  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'assessments' | 'settings'>('overview');
  const [showContentForm, setShowContentForm] = useState(false);
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [editingContent, setEditingContent] = useState<string | null>(null);
  const [editingAssessment, setEditingAssessment] = useState<string | null>(null);

  const [newContent, setNewContent] = useState<Partial<TrainingContent>>({
    type: 'text',
    title: '',
    content: '',
    duration: 0,
    order: 0
  });

  const [newAssessment, setNewAssessment] = useState<Partial<TrainingAssessment>>({
    title: '',
    questions: [],
    passingScore: 80,
    attempts: 3,
    order: 0
  });

  const [newQuestion, setNewQuestion] = useState<Partial<TrainingQuestion>>({
    question: '',
    type: 'multiple-choice',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    points: 1
  });

  const [newObjective, setNewObjective] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [newAudience, setNewAudience] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    calculateTotalDuration();
  }, [module.content]);

  const calculateTotalDuration = () => {
    const totalDuration = module.content.reduce((sum, content) => sum + content.duration, 0);
    setModule(prev => ({ ...prev, duration: totalDuration }));
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setModule(prev => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()]
      }));
      setNewObjective('');
    }
  };

  const removeObjective = (index: number) => {
    setModule(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim()) {
      setModule(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, newPrerequisite.trim()]
      }));
      setNewPrerequisite('');
    }
  };

  const removePrerequisite = (index: number) => {
    setModule(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index)
    }));
  };

  const addTargetAudience = () => {
    if (newAudience.trim()) {
      setModule(prev => ({
        ...prev,
        targetAudience: [...prev.targetAudience, newAudience.trim()]
      }));
      setNewAudience('');
    }
  };

  const removeTargetAudience = (index: number) => {
    setModule(prev => ({
      ...prev,
      targetAudience: prev.targetAudience.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (newTag.trim()) {
      setModule(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setModule(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const addContent = () => {
    if (!newContent.title || !newContent.content) return;

    const content: TrainingContent = {
      id: Date.now().toString(),
      type: newContent.type!,
      title: newContent.title!,
      content: newContent.content!,
      duration: newContent.duration!,
      order: module.content.length + 1
    };

    setModule(prev => ({
      ...prev,
      content: [...prev.content, content],
      lastUpdated: new Date()
    }));

    setNewContent({
      type: 'text',
      title: '',
      content: '',
      duration: 0,
      order: 0
    });
    setShowContentForm(false);
  };

  const updateContent = (contentId: string, updates: Partial<TrainingContent>) => {
    setModule(prev => ({
      ...prev,
      content: prev.content.map(content =>
        content.id === contentId ? { ...content, ...updates } : content
      ),
      lastUpdated: new Date()
    }));
    setEditingContent(null);
  };

  const deleteContent = (contentId: string) => {
    setModule(prev => ({
      ...prev,
      content: prev.content.filter(content => content.id !== contentId),
      lastUpdated: new Date()
    }));
  };

  const addAssessment = () => {
    if (!newAssessment.title) return;

    const assessment: TrainingAssessment = {
      id: Date.now().toString(),
      title: newAssessment.title!,
      questions: newAssessment.questions || [],
      passingScore: newAssessment.passingScore!,
      attempts: newAssessment.attempts!,
      order: module.assessments.length + 1
    };

    setModule(prev => ({
      ...prev,
      assessments: [...prev.assessments, assessment],
      lastUpdated: new Date()
    }));

    setNewAssessment({
      title: '',
      questions: [],
      passingScore: 80,
      attempts: 3,
      order: 0
    });
    setShowAssessmentForm(false);
  };

  const addQuestion = (assessmentId: string) => {
    if (!newQuestion.question || !newQuestion.correctAnswer) return;

    const question: TrainingQuestion = {
      id: Date.now().toString(),
      question: newQuestion.question!,
      type: newQuestion.type!,
      options: newQuestion.options || [],
      correctAnswer: newQuestion.correctAnswer!,
      explanation: newQuestion.explanation!,
      points: newQuestion.points!
    };

    setModule(prev => ({
      ...prev,
      assessments: prev.assessments.map(assessment =>
        assessment.id === assessmentId
          ? { ...assessment, questions: [...assessment.questions, question] }
          : assessment
      ),
      lastUpdated: new Date()
    }));

    setNewQuestion({
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      points: 1
    });
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="w-4 h-4 text-red-500" />;
      case 'text': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'interactive': return <Target className="w-4 h-4 text-green-500" />;
      case 'quiz': return <CheckCircle className="w-4 h-4 text-purple-500" />;
      case 'document': return <FileText className="w-4 h-4 text-gray-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLevelColor = (level: TrainingLevel): string => {
    const colors = {
      'beginner': 'text-green-600 bg-green-100',
      'intermediate': 'text-yellow-600 bg-yellow-100',
      'advanced': 'text-orange-600 bg-orange-100',
      'expert': 'text-red-600 bg-red-100'
    };
    return colors[level];
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Module Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Module Title
          </label>
          <input
            type="text"
            value={module.title}
            onChange={(e) => setModule(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter module title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Author
          </label>
          <input
            type="text"
            value={module.author}
            onChange={(e) => setModule(prev => ({ ...prev, author: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter author name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={module.category}
            onChange={(e) => setModule(prev => ({ ...prev, category: e.target.value as TrainingCategory }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            {TRAINING_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Level
          </label>
          <select
            value={module.level}
            onChange={(e) => setModule(prev => ({ ...prev, level: e.target.value as TrainingLevel }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            {TRAINING_LEVELS.map(level => (
              <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={module.description}
            onChange={(e) => setModule(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter module description"
          />
        </div>
      </div>

      {/* Learning Objectives */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Learning Objectives
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newObjective}
            onChange={(e) => setNewObjective(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addObjective()}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter learning objective"
          />
          <button
            onClick={addObjective}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {module.objectives.map((objective, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="flex-1 text-gray-900 dark:text-white">{objective}</span>
              <button
                onClick={() => removeObjective(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Prerequisites */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Prerequisites
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newPrerequisite}
            onChange={(e) => setNewPrerequisite(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addPrerequisite()}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter prerequisite"
          />
          <button
            onClick={addPrerequisite}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {module.prerequisites.map((prerequisite, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span className="flex-1 text-gray-900 dark:text-white">{prerequisite}</span>
              <button
                onClick={() => removePrerequisite(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
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
          {module.targetAudience.map((audience, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Users className="w-4 h-4 text-purple-500" />
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

      {/* CMMC Practices */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          CMMC Practices
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {CMMC_PRACTICES.map((practice) => (
            <label key={practice} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={module.cmmcPractices.includes(practice)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setModule(prev => ({
                      ...prev,
                      cmmcPractices: [...prev.cmmcPractices, practice]
                    }));
                  } else {
                    setModule(prev => ({
                      ...prev,
                      cmmcPractices: prev.cmmcPractices.filter(p => p !== practice)
                    }));
                  }
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{practice}</span>
            </label>
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
          {module.tags.map((tag, index) => (
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
          Training Content ({module.content.length} items)
        </h3>
        <button
          onClick={() => setShowContentForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Content
        </button>
      </div>

      {module.content.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No content added yet. Click "Add Content" to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {module.content.map((content) => (
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
                    <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      {content.duration} min
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {content.content}
                  </p>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Order: {content.order}
                  </div>
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

  const renderAssessments = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Assessments ({module.assessments.length} assessments)
        </h3>
        <button
          onClick={() => setShowAssessmentForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Assessment
        </button>
      </div>

      {module.assessments.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No assessments added yet. Click "Add Assessment" to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {module.assessments.map((assessment) => (
            <div key={assessment.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-purple-500" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {assessment.title}
                    </h4>
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded">
                      {assessment.questions.length} questions
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                      <span className="font-medium">Passing Score:</span> {assessment.passingScore}%
                    </div>
                    <div>
                      <span className="font-medium">Attempts:</span> {assessment.attempts}
                    </div>
                    <div>
                      <span className="font-medium">Order:</span> {assessment.order}
                    </div>
                    <div>
                      <span className="font-medium">Total Points:</span> {assessment.questions.reduce((sum, q) => sum + q.points, 0)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingAssessment(assessment.id)}
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setModule(prev => ({
                      ...prev,
                      assessments: prev.assessments.filter(a => a.id !== assessment.id),
                      lastUpdated: new Date()
                    }))}
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

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            value={module.status}
            onChange={(e) => setModule(prev => ({ ...prev, status: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Version
          </label>
          <input
            type="text"
            value={module.version}
            onChange={(e) => setModule(prev => ({ ...prev, version: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Module Statistics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Total Duration:</span>
            <p className="text-gray-600 dark:text-gray-400">{module.duration} minutes</p>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Content Items:</span>
            <p className="text-gray-600 dark:text-gray-400">{module.content.length}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Assessments:</span>
            <p className="text-gray-600 dark:text-gray-400">{module.assessments.length}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">CMMC Practices:</span>
            <p className="text-gray-600 dark:text-gray-400">{module.cmmcPractices.length}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                Training Module Generator
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Create comprehensive training modules for CMMC compliance
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onSave?.(module)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Module
              </button>
              <button
                onClick={() => onExport?.(module)}
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
              { id: 'assessments', label: 'Assessments', icon: CheckCircle },
              { id: 'settings', label: 'Settings', icon: Target }
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
          {activeTab === 'assessments' && renderAssessments()}
          {activeTab === 'settings' && renderSettings()}
        </div>

        {/* Content Form Modal */}
        {showContentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Add Training Content
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
                      <option value="text">Text</option>
                      <option value="video">Video</option>
                      <option value="interactive">Interactive</option>
                      <option value="quiz">Quiz</option>
                      <option value="document">Document</option>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={newContent.duration}
                    onChange={(e) => setNewContent(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
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

        {/* Assessment Form Modal */}
        {showAssessmentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Add Assessment
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newAssessment.title}
                    onChange={(e) => setNewAssessment(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Passing Score (%)
                    </label>
                    <input
                      type="number"
                      value={newAssessment.passingScore}
                      onChange={(e) => setNewAssessment(prev => ({ ...prev, passingScore: parseInt(e.target.value) || 80 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Attempts
                    </label>
                    <input
                      type="number"
                      value={newAssessment.attempts}
                      onChange={(e) => setNewAssessment(prev => ({ ...prev, attempts: parseInt(e.target.value) || 3 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button
                  onClick={() => setShowAssessmentForm(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addAssessment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Assessment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingModuleGenerator;