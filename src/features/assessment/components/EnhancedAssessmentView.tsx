import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Save, FileText, Users, Clock, 
  CheckCircle, Target, AlertTriangle,
  Info, HelpCircle, Lightbulb, FileCheck, MessageCircle,
  Building,
  Check, Pause
} from 'lucide-react';
import { AssessmentData, Framework, UserProfile, Question } from '../../../shared/types';
import { EvidenceManager } from './EvidenceManager';
import { Breadcrumbs } from '../../../shared/components/layout/Breadcrumbs';
import { useInternalLinking } from '../../../shared/hooks/useInternalLinking';

interface EnhancedAssessmentViewProps {
  assessment: AssessmentData;
  framework: Framework;
  onSave: (assessment: AssessmentData) => Promise<AssessmentData>;
  onComplete: () => void;
  onBack: () => void;
  userProfile: UserProfile | null;
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  onGenerateReport: (assessment: AssessmentData) => void;
}

export const EnhancedAssessmentView: React.FC<EnhancedAssessmentViewProps> = ({
  assessment,
  framework,
  onSave,
  onComplete,
  onBack,
  userProfile,
  addNotification,
  onGenerateReport
}) => {
  const { breadcrumbs } = useInternalLinking();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [localAssessment, setLocalAssessment] = useState(assessment);
  const [autoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const currentSection = framework.sections[currentSectionIndex];
  const currentCategory = currentSection?.categories[currentCategoryIndex];
  const currentQuestion = currentCategory?.questions[currentQuestionIndex];

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled) return;
    
    const autoSaveTimer = setTimeout(() => {
      handleSave(true);
    }, 5000);

    return () => clearTimeout(autoSaveTimer);
  }, [localAssessment, autoSaveEnabled]);

  const handleSave = async (isAutoSave = false) => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      // Your existing save logic
      await onSave(localAssessment);
      setLastSaved(new Date());
      if (!isAutoSave) {
        addNotification('success', 'Assessment saved successfully');
      }
    } catch (error) {
      if (!isAutoSave) {
        addNotification('error', 'Failed to save assessment');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleResponseChange = (questionId: string, value: number) => {
    setLocalAssessment((prev: AssessmentData) => ({
      ...prev,
      responses: {
        ...prev.responses,
        [questionId]: value
      },
      lastModified: new Date()
    }));
  };

  const handleNoteChange = (questionId: string, note: string) => {
    setLocalAssessment((prev: AssessmentData) => ({
      ...prev,
      questionNotes: {
        ...prev.questionNotes,
        [questionId]: note
      },
      lastModified: new Date()
    }));
  };

  const navigateToQuestion = (direction: 'next' | 'prev') => {
    const totalQuestions = currentCategory?.questions.length || 0;
    const totalCategories = currentSection?.categories.length || 0;
    const totalSections = framework.sections.length || 0;

    if (direction === 'next') {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex((prev: number) => prev + 1);
      } else if (currentCategoryIndex < totalCategories - 1) {
        setCurrentCategoryIndex((prev: number) => prev + 1);
        setCurrentQuestionIndex(0);
      } else if (currentSectionIndex < totalSections - 1) {
        setCurrentSectionIndex((prev: number) => prev + 1);
        setCurrentCategoryIndex(0);
        setCurrentQuestionIndex(0);
      }
    } else {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex((prev: number) => prev - 1);
      } else if (currentCategoryIndex > 0) {
        setCurrentCategoryIndex((prev: number) => prev - 1);
        const prevCategory = currentSection.categories[currentCategoryIndex - 1];
        setCurrentQuestionIndex(prevCategory.questions.length - 1);
      } else if (currentSectionIndex > 0) {
        setCurrentSectionIndex((prev: number) => prev - 1);
        const prevSection = framework.sections[currentSectionIndex - 1];
        setCurrentCategoryIndex(prevSection.categories.length - 1);
        const prevCategory = prevSection.categories[prevSection.categories.length - 1];
        setCurrentQuestionIndex(prevCategory.questions.length - 1);
      }
    }
  };

  const getProgress = () => {
    const totalQuestions = framework.sections.reduce((sum: number, section: any) => 
      sum + section.categories.reduce((catSum: number, category: any) => 
        catSum + category.questions.length, 0), 0);
    const answeredQuestions = Object.keys(localAssessment.responses).length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  const isFirstQuestion = currentSectionIndex === 0 && currentCategoryIndex === 0 && currentQuestionIndex === 0;
  const isLastQuestion = currentSectionIndex === framework.sections.length - 1 && 
                        currentCategoryIndex === (framework.sections[framework.sections.length - 1]?.categories.length || 1) - 1 && 
                        currentQuestionIndex === (framework.sections[framework.sections.length - 1]?.categories[framework.sections[framework.sections.length - 1]?.categories.length - 1]?.questions.length || 1) - 1;

  const renderQuestion = (question: Question) => {
    const currentResponse = localAssessment.responses[question.id];
    const currentNote = localAssessment.questionNotes?.[question.id] || '';

    return (
      <div className="space-y-8">
        {/* Question Text */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-relaxed">
                {question.text}
              </h2>
              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
                  Question {currentQuestionIndex + 1} of {currentCategory?.questions.length || 0}
                </span>
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full font-medium">
                  {question.priority} priority
                </span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          {question.description && (
            <div className="mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                      Description
                    </h3>
                    <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                      {question.description || question.text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Implementation Guidance */}
          {question.guidance && (
            <div className="mb-6">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Lightbulb className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3">
                      Implementation Guidance
                    </h3>
                    <p className="text-yellow-800 dark:text-yellow-200 leading-relaxed whitespace-pre-line mb-4">
                      {question.guidance}
                    </p>
                    {question.examples && question.examples.length > 0 && (
                      <div className="pt-4 border-t border-yellow-200 dark:border-yellow-700">
                        <h5 className="font-medium text-yellow-900 dark:text-yellow-100 mb-3">Implementation Examples:</h5>
                        <ul className="space-y-2 text-yellow-800 dark:text-yellow-200">
                          {question.examples.map((example, index) => (
                            <li key={index} className="flex items-start space-x-3">
                              <span className="text-yellow-600 dark:text-yellow-400 mt-1 font-bold">•</span>
                              <span>{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Evidence Required */}
          {question.evidenceRequirements && question.evidenceRequirements.length > 0 && (
            <div className="mb-6">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <FileCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
                      Evidence Required
                    </h3>
                    <div className="space-y-4">
                      {question.evidenceRequirements.map((evidence, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-600">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${evidence.required ? 'bg-red-100 dark:bg-red-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'}`}>
                              <FileText className={`w-4 h-4 ${evidence.required ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h5 className="font-medium text-gray-900 dark:text-white capitalize">
                                  {evidence.type.replace('-', ' ')}
                                </h5>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  evidence.required 
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                                }`}>
                                  {evidence.required ? 'Required' : 'Optional'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                {evidence.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Implementation Status */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Implementation Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {/* Fully Implemented */}
              <div
                onClick={() => handleResponseChange(question.id, 4)}
                className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                  currentResponse === 4
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-green-300 dark:hover:border-green-600'
                }`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    currentResponse === 4 
                      ? 'bg-green-100 dark:bg-green-900/40' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <Check className={`w-8 h-8 ${
                      currentResponse === 4 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-gray-400 dark:text-gray-500'
                    }`} />
                  </div>
                  <h4 className={`font-semibold mb-2 ${
                    currentResponse === 4 
                      ? 'text-green-900 dark:text-green-100' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    Fully Implemented
                  </h4>
                </div>
              </div>

              {/* Partially Implemented */}
              <div
                onClick={() => handleResponseChange(question.id, 3)}
                className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                  currentResponse === 3
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-yellow-300 dark:hover:border-yellow-600'
                }`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    currentResponse === 3 
                      ? 'bg-yellow-100 dark:bg-yellow-900/40' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <Clock className={`w-8 h-8 ${
                      currentResponse === 3 
                        ? 'text-yellow-600 dark:text-yellow-400' 
                        : 'text-gray-400 dark:text-gray-500'
                    }`} />
                  </div>
                  <h4 className={`font-semibold mb-2 ${
                    currentResponse === 3 
                      ? 'text-yellow-900 dark:text-yellow-100' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    Partially Implemented
                  </h4>
                </div>
              </div>

              {/* Planned */}
              <div
                onClick={() => handleResponseChange(question.id, 2)}
                className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                  currentResponse === 2
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600'
                }`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    currentResponse === 2 
                      ? 'bg-blue-100 dark:bg-blue-900/40' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <Target className={`w-8 h-8 ${
                      currentResponse === 2 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-400 dark:text-gray-500'
                    }`} />
                  </div>
                  <h4 className={`font-semibold mb-2 ${
                    currentResponse === 2 
                      ? 'text-blue-900 dark:text-blue-100' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    Planned
                  </h4>
                </div>
              </div>

              {/* Not Implemented */}
              <div
                onClick={() => handleResponseChange(question.id, 1)}
                className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                  currentResponse === 1
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-orange-300 dark:hover:border-orange-600'
                }`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    currentResponse === 1 
                      ? 'bg-orange-100 dark:bg-orange-900/40' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <Clock className={`w-8 h-8 ${
                      currentResponse === 1 
                        ? 'text-orange-600 dark:text-orange-400' 
                        : 'text-gray-400 dark:text-gray-500'
                    }`} />
                  </div>
                  <h4 className={`font-semibold mb-2 ${
                    currentResponse === 1 
                      ? 'text-orange-900 dark:text-orange-100' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    Not Implemented
                  </h4>
                </div>
              </div>

              {/* Not Applicable */}
              <div
                onClick={() => handleResponseChange(question.id, 0)}
                className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                  currentResponse === 0
                    ? 'border-gray-500 bg-gray-50 dark:bg-gray-700/50 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    currentResponse === 0 
                      ? 'bg-gray-200 dark:bg-gray-600' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <Info className={`w-8 h-8 ${
                      currentResponse === 0 
                        ? 'text-gray-600 dark:text-gray-300' 
                        : 'text-gray-400 dark:text-gray-500'
                    }`} />
                  </div>
                  <h4 className={`font-semibold mb-2 ${
                    currentResponse === 0 
                      ? 'text-gray-700 dark:text-gray-200' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    Not Applicable
                  </h4>
                </div>
              </div>
            </div>

            {/* Show selected option details */}
            {currentResponse !== undefined && question.options && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                  Selected: {question.options.find(opt => opt.value === currentResponse)?.label || 'Not Applicable'}
                </h5>
                {question.options.find(opt => opt.value === currentResponse)?.description && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                    {question.options.find(opt => opt.value === currentResponse)?.description}
                  </p>
                )}
                {question.options.find(opt => opt.value === currentResponse)?.recommendedActions && 
                 question.options.find(opt => opt.value === currentResponse)?.recommendedActions.length > 0 && (
                  <div>
                    <h6 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Recommended Actions:</h6>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                      {question.options.find(opt => opt.value === currentResponse)?.recommendedActions.map((action, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Justification/Comments */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Justification/Comments
              </h4>
            </div>
            <textarea
              value={currentNote}
              onChange={(e) => handleNoteChange(question.id, e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="Provide justification for your implementation status selection, additional context, or notes about current state and planned improvements..."
            />
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Document your rationale, current implementation details, or planned improvements to support your response.
            </div>
          </div>

          {/* Evidence Manager */}
          <EvidenceManager
            questionId={question.id}
            questionEvidence={localAssessment.questionEvidence?.[question.id] || []}
            evidenceLibrary={localAssessment.evidenceLibrary || []}
            onAddEvidence={(questionId, evidence) => {
              setLocalAssessment(prev => ({
                ...prev,
                questionEvidence: {
                  ...prev.questionEvidence,
                  [questionId]: [...(prev.questionEvidence?.[questionId] || []), evidence]
                },
                lastModified: new Date()
              }));
            }}
            onRemoveEvidence={(questionId, evidenceId) => {
              setLocalAssessment(prev => ({
                ...prev,
                questionEvidence: {
                  ...prev.questionEvidence,
                  [questionId]: prev.questionEvidence?.[questionId]?.filter(e => e.evidenceId !== evidenceId) || []
                },
                lastModified: new Date()
              }));
            }}
            onUploadEvidence={(file, metadata) => {
              // Handle evidence upload
              const newEvidence = {
                id: Date.now().toString(),
                name: metadata.name || file.name,
                type: metadata.type || 'document',
                description: metadata.description || '',
                controlIds: [question.id],
                assetIds: [],
                uploadedBy: userProfile?.name || 'Current User',
                uploadedAt: new Date(),
                status: 'active' as const,
                confidentialityLevel: metadata.confidentialityLevel || 'internal',
                retention: {
                  period: 60,
                  reason: 'Compliance requirement',
                  disposalDate: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000)
                },
                metadata: {
                  version: '1.0',
                  source: 'assessment-upload',
                  validFrom: new Date(),
                  approvalRequired: false
                },
                tags: metadata.tags || [],
                linkedControls: [],
                complianceMapping: []
              };

              setLocalAssessment(prev => ({
                ...prev,
                evidenceLibrary: [...(prev.evidenceLibrary || []), newEvidence],
                lastModified: new Date()
              }));
            }}
          />
        </div>
      </div>
    );
  };

  if (!currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Question Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Unable to load the current question. Please try refreshing or going back to the dashboard.
        </p>
        <button
          onClick={onBack}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6">
          {/* Title and Description Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-xl">
                <Building className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  CMMC (Cybersecurity Maturity Model Certification) Assessment Version 2.0
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Advanced complexity • DoD Contractor Compliance • CUI Protection
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => addNotification('info', 'Task assignment feature coming soon')}
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Assign Tasks</span>
            </button>
            
            <button
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Progress'}</span>
            </button>
            
            <button
              onClick={() => onGenerateReport(localAssessment)}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Report</span>
            </button>
            
            <button
              onClick={() => addNotification('info', 'Version history feature coming soon')}
              className="flex items-center space-x-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Clock className="w-4 h-4" />
              <span>Version History</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Assessment Progress</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Section: {currentSection?.name} • Category: {currentCategory?.name}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {getProgress()}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Complete</div>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
        
        {lastSaved && (
          <div className="mt-3 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
          </div>
        )}
      </div>

      {/* Question Content */}
      {renderQuestion(currentQuestion)}

      {/* Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateToQuestion('prev')}
            disabled={isFirstQuestion}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Question {currentQuestionIndex + 1} of {currentCategory?.questions.length || 0}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {currentSection?.name} → {currentCategory?.name}
            </div>
          </div>

          {isLastQuestion ? (
            <button
              onClick={onComplete}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Complete Assessment</span>
            </button>
          ) : (
            <button
              onClick={() => navigateToQuestion('next')}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedAssessmentView;