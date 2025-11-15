import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  FileText, 
  Users, 
  Clock, 
  CircleCheck as CheckCircle, 
  Target, 
  TriangleAlert as AlertTriangle, 
  Info, 
  Lightbulb, 
  FileCheck, 
  MessageCircle, 
  Building, 
  Check
} from 'lucide-react';
import { AssessmentData, Framework, UserProfile, Question, EvidenceItem } from '../../../shared/types';
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

const EnhancedAssessmentView: React.FC<EnhancedAssessmentViewProps> = ({
  assessment,
  framework,
  onSave,
  onComplete,
  onBack: _onBack,
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

  const currentSection = framework?.sections?.[currentSectionIndex];
  const currentCategory = currentSection?.categories?.[currentCategoryIndex];
  const currentQuestion = currentCategory?.questions?.[currentQuestionIndex];

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled) return;
    
    const autoSaveTimer = setTimeout(() => {
      handleSave(true);
    }, 5000);

    return () => clearTimeout(autoSaveTimer);
  }, [localAssessment, autoSaveEnabled]);

  const handleSave = useCallback(async (isAutoSave = false) => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const savedAssessment = await onSave(localAssessment);
      setLocalAssessment(savedAssessment);
      setLastSaved(new Date());
      
      if (!isAutoSave) {
        addNotification('success', 'Assessment saved successfully');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save assessment';
      if (!isAutoSave) {
        addNotification('error', `Save failed: ${errorMessage}`);
      }
      console.error('Assessment save error:', error);
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, localAssessment, onSave, addNotification]);

  const handleResponseChange = useCallback((questionId: string, value: number) => {
    setLocalAssessment(prev => ({
      ...prev,
      responses: {
        ...prev.responses,
        [questionId]: value
      },
      lastModified: new Date()
    }));
  }, []);

  const handleNoteChange = useCallback((questionId: string, note: string) => {
    setLocalAssessment(prev => ({
      ...prev,
      questionNotes: {
        ...prev.questionNotes,
        [questionId]: note
      },
      lastModified: new Date()
    }));
  }, []);

  const navigateToQuestion = (direction: 'next' | 'prev') => {
    const totalQuestions = currentCategory?.questions?.length || 0;
    const totalCategories = currentSection?.categories?.length || 0;
    const totalSections = framework?.sections?.length || 0;

    if (direction === 'next') {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else if (currentCategoryIndex < totalCategories - 1) {
        setCurrentCategoryIndex(prev => prev + 1);
        setCurrentQuestionIndex(0);
      } else if (currentSectionIndex < totalSections - 1) {
        setCurrentSectionIndex(prev => prev + 1);
        setCurrentCategoryIndex(0);
        setCurrentQuestionIndex(0);
      }
    } else {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(prev => prev - 1);
      } else if (currentCategoryIndex > 0) {
        setCurrentCategoryIndex(prev => prev - 1);
        const prevCategory = currentSection?.categories?.[currentCategoryIndex - 1];
        setCurrentQuestionIndex((prevCategory?.questions?.length || 1) - 1);
      } else if (currentSectionIndex > 0) {
        setCurrentSectionIndex(prev => prev - 1);
        const prevSection = framework?.sections?.[currentSectionIndex - 1];
        if (prevSection) {
          setCurrentCategoryIndex((prevSection.categories?.length || 1) - 1);
          const prevCategory = prevSection.categories?.[(prevSection.categories?.length || 1) - 1];
          setCurrentQuestionIndex((prevCategory?.questions?.length || 1) - 1);
        }
      }
    }
  };

  const getProgress = () => {
    const totalQuestions = framework?.sections?.reduce((sum, section) => 
      sum + section.categories.reduce((catSum, category) => 
        catSum + (category.questions?.length || 0), 0), 0) || 0;
    const answeredQuestions = Object.keys(localAssessment.responses).length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  const isFirstQuestion = currentSectionIndex === 0 && currentCategoryIndex === 0 && currentQuestionIndex === 0;
  
  // Calculate if this is the last question
  const lastSection = framework?.sections?.[(framework?.sections?.length || 1) - 1];
  const lastCategory = lastSection?.categories?.[(lastSection?.categories?.length || 1) - 1];
  const lastQuestionIndex = lastCategory?.questions?.length || 0;
  const isLastQuestion = currentSectionIndex === (framework?.sections?.length || 1) - 1 && 
                        currentCategoryIndex === (lastSection?.categories?.length || 1) - 1 && 
                        currentQuestionIndex === lastQuestionIndex - 1;

  const renderQuestion = (question: Question) => {
    const currentResponse = localAssessment.responses[question.id];
    const currentNote = localAssessment.questionNotes?.[question.id] || '';

    return (
      <div className="space-y-8">
        {/* Question Text */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-8 shadow-lg border border-support-light dark:border-support-dark">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4 leading-relaxed">
                {question.text}
              </h2>
              <div className="flex items-center space-x-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-3 py-1 rounded-full font-medium">
                  Question {currentQuestionIndex + 1} of {currentCategory?.questions.length || 0}
                </span>
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full font-medium">
                  {question.priority} priority
                </span>
              </div>
            </div>
          </div>


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
              <div className="bg-success-50 dark:bg-success-900/20 rounded-xl p-6 border border-success-200 dark:border-success-800">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <FileCheck className="w-6 h-6 text-success-600 dark:text-success-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-success-900 dark:text-success-100 mb-4">
                      Evidence Required
                    </h3>
                    <div className="space-y-4">
                      {question.evidenceRequirements.map((evidence, index) => (
                        <div key={index} className="bg-surface-light dark:bg-surface-dark rounded-lg p-4 border border-success-200 dark:border-success-600">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${evidence.required ? 'bg-error-100 dark:bg-error-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'}`}>
                              <FileText className={`w-4 h-4 ${evidence.required ? 'text-error-600 dark:text-error-400' : 'text-yellow-600 dark:text-yellow-400'}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h5 className="font-medium text-text-primary-light dark:text-text-primary-dark capitalize">
                                  {evidence.type.replace('-', ' ')}
                                </h5>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  evidence.required 
                                    ? 'bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-300'
                                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                                }`}>
                                  {evidence.required ? 'Required' : 'Optional'}
                                </span>
                              </div>
                              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
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
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-6">
              Implementation Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {/* Fully Implemented */}
              <div
                onClick={() => handleResponseChange(question.id, 4)}
                className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                  currentResponse === 4
                    ? 'border-success-500 bg-success-50 dark:bg-success-900/20 shadow-lg'
                    : 'border-support-light dark:border-support-dark bg-surface-light dark:bg-surface-dark hover:border-success-300 dark:hover:border-success-600'
                }`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    currentResponse === 4 
                      ? 'bg-success-100 dark:bg-success-900/40' 
                      : 'bg-support-light dark:bg-surface-dark'
                  }`}>
                    <Check className={`w-8 h-8 ${
                      currentResponse === 4 
                        ? 'text-success-600 dark:text-success-400' 
                        : 'text-text-muted-dark dark:text-text-muted-light'
                    }`} />
                  </div>
                  <h4 className={`font-semibold mb-2 ${
                    currentResponse === 4 
                      ? 'text-success-900 dark:text-success-100' 
                      : 'text-text-primary-light dark:text-text-primary-dark'
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
                    : 'border-support-light dark:border-support-dark bg-surface-light dark:bg-surface-dark hover:border-yellow-300 dark:hover:border-yellow-600'
                }`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    currentResponse === 3 
                      ? 'bg-yellow-100 dark:bg-yellow-900/40' 
                      : 'bg-support-light dark:bg-surface-dark'
                  }`}>
                    <Clock className={`w-8 h-8 ${
                      currentResponse === 3 
                        ? 'text-yellow-600 dark:text-yellow-400' 
                        : 'text-text-muted-dark dark:text-text-muted-light'
                    }`} />
                  </div>
                  <h4 className={`font-semibold mb-2 ${
                    currentResponse === 3 
                      ? 'text-yellow-900 dark:text-yellow-100' 
                      : 'text-text-primary-light dark:text-text-primary-dark'
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
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg'
                    : 'border-support-light dark:border-support-dark bg-surface-light dark:bg-surface-dark hover:border-primary-300 dark:hover:border-primary-600'
                }`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    currentResponse === 2 
                      ? 'bg-primary-100 dark:bg-primary-900/40' 
                      : 'bg-support-light dark:bg-surface-dark'
                  }`}>
                    <Target className={`w-8 h-8 ${
                      currentResponse === 2 
                        ? 'text-primary-600 dark:text-primary-400' 
                        : 'text-text-muted-dark dark:text-text-muted-light'
                    }`} />
                  </div>
                  <h4 className={`font-semibold mb-2 ${
                    currentResponse === 2 
                      ? 'text-primary-900 dark:text-primary-100' 
                      : 'text-text-primary-light dark:text-text-primary-dark'
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
                    : 'border-support-light dark:border-support-dark bg-surface-light dark:bg-surface-dark hover:border-orange-300 dark:hover:border-orange-600'
                }`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    currentResponse === 1 
                      ? 'bg-orange-100 dark:bg-orange-900/40' 
                      : 'bg-support-light dark:bg-surface-dark'
                  }`}>
                    <Clock className={`w-8 h-8 ${
                      currentResponse === 1 
                        ? 'text-orange-600 dark:text-orange-400' 
                        : 'text-text-muted-dark dark:text-text-muted-light'
                    }`} />
                  </div>
                  <h4 className={`font-semibold mb-2 ${
                    currentResponse === 1 
                      ? 'text-orange-900 dark:text-orange-100' 
                      : 'text-text-primary-light dark:text-text-primary-dark'
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
                    ? 'border-support-light bg-background-light dark:bg-surface-dark/50 shadow-lg'
                    : 'border-support-light dark:border-support-dark bg-surface-light dark:bg-surface-dark hover:border-support-light dark:hover:border-support-light'
                }`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    currentResponse === 0 
                      ? 'bg-support-light dark:bg-primary-600' 
                      : 'bg-support-light dark:bg-surface-dark'
                  }`}>
                    <Info className={`w-8 h-8 ${
                      currentResponse === 0 
                        ? 'text-text-secondary-light dark:text-text-secondary-dark' 
                        : 'text-text-muted-dark dark:text-text-muted-light'
                    }`} />
                  </div>
                  <h4 className={`font-semibold mb-2 ${
                    currentResponse === 0 
                      ? 'text-text-primary-light dark:text-text-primary-light' 
                      : 'text-text-primary-light dark:text-text-primary-dark'
                  }`}>
                    Not Applicable
                  </h4>
                </div>
              </div>
            </div>

            {/* Show selected option details */}
            {currentResponse !== undefined && question.options && (
              <div className="mt-6 p-4 bg-background-light dark:bg-surface-dark/50 rounded-lg border">
                <h5 className="font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  Selected: {question.options.find(opt => opt.value === currentResponse)?.label || 'Not Applicable'}
                </h5>
                {question.options.find(opt => opt.value === currentResponse)?.description && (
                  <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm leading-relaxed mb-3">
                    {question.options.find(opt => opt.value === currentResponse)?.description}
                  </p>
                )}
                {(() => {
                  const selectedOption = question.options.find(opt => opt.value === currentResponse);
                  return selectedOption?.recommendedActions && selectedOption.recommendedActions.length > 0 && (
                    <div>
                      <h6 className="font-medium text-text-primary-light dark:text-text-primary-light mb-2">Recommended Actions:</h6>
                      <ul className="space-y-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        {selectedOption.recommendedActions.map((action, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-primary-500 mt-1">•</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Justification/Comments */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <MessageCircle className="w-5 h-5 text-text-secondary-light dark:text-text-muted-dark" />
              <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                Justification/Comments
              </h4>
            </div>
            <textarea
              value={currentNote}
              onChange={(e) => handleNoteChange(question.id, e.target.value)}
              className="w-full px-4 py-3 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="Provide justification for your implementation status selection, additional context, or notes about current state and planned improvements..."
            />
            <div className="mt-2 text-xs text-text-muted-light dark:text-text-muted-dark">
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
              try {
                // Validate file
                if (!file || file.size === 0) {
                  addNotification('error', 'Please select a valid file');
                  return;
                }

                // Check file size (max 50MB)
                const maxSize = 50 * 1024 * 1024; // 50MB
                if (file.size > maxSize) {
                  addNotification('error', 'File size must be less than 50MB');
                  return;
                }

                // Validate file type
                const allowedTypes = [
                  'application/pdf',
                  'application/msword',
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  'image/jpeg',
                  'image/png',
                  'image/gif',
                  'image/webp',
                  'application/vnd.ms-excel',
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                ];

                if (!allowedTypes.includes(file.type)) {
                  addNotification('error', 'File type not supported. Please upload PDF, Word, Excel, or image files.');
                  return;
                }

                // Create evidence item with proper validation
                const newEvidence: EvidenceItem = {
                  id: `evidence_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                  name: metadata.name || file.name,
                  type: metadata.type || 'document',
                  description: metadata.description || '',
                  uploadedAt: new Date(),
                  uploadedBy: userProfile?.name || 'Current User',
                  fileSize: file.size,
                  mimeType: file.type,
                  tags: metadata.tags || [],
                  linkedQuestions: [question.id],
                  version: '1.0',
                  status: 'active',
                  confidentialityLevel: metadata.confidentialityLevel || 'internal',
                  metadata: {
                    version: '1.0',
                    source: 'assessment-upload',
                    validFrom: new Date(),
                    approvalRequired: false,
                    originalFileName: file.name,
                    uploadTimestamp: Date.now()
                  }
                };

                // Update assessment with new evidence
                setLocalAssessment(prev => ({
                  ...prev,
                  evidenceLibrary: [...(prev.evidenceLibrary || []), newEvidence],
                  lastModified: new Date()
                }));

                addNotification('success', `Evidence "${newEvidence.name}" uploaded successfully`);
              } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to upload evidence';
                addNotification('error', `Upload failed: ${errorMessage}`);
                console.error('Evidence upload error:', error);
              }
            }}
          />
        </div>
      </div>
    );
  };

  if (!currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <AlertTriangle className="w-16 h-16 text-error-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
          Question Not Found
        </h2>
        <p className="text-text-secondary-light dark:text-text-secondary-dark">
          Unable to load the current question. Please try refreshing the page.
        </p>
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
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
        <div className="p-6">
          {/* Title and Description Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-xl">
                <Building className="w-8 h-8 text-error-600 dark:text-error-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  CMMC (Cybersecurity Maturity Model Certification) Assessment Version 2.0
                </h1>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  Advanced complexity • Military Contractor Compliance • CUI Protection
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
              className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Progress'}</span>
            </button>
            
            <button
              onClick={() => onGenerateReport(localAssessment)}
              className="flex items-center space-x-2 bg-success-600 text-white px-4 py-2 rounded-lg hover:bg-success-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Report</span>
            </button>
            
            <button
              onClick={() => addNotification('info', 'Version history feature coming soon')}
              className="flex items-center space-x-2 border border-support-light dark:border-support-dark text-text-primary-light dark:text-text-secondary-dark px-4 py-2 rounded-lg hover:bg-background-light dark:hover:bg-surface-dark transition-colors"
            >
              <Clock className="w-4 h-4" />
              <span>Version History</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">Assessment Progress</h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              Section: {currentSection?.name} • Category: {currentCategory?.name}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {getProgress()}%
            </div>
            <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Complete</div>
          </div>
        </div>
        
        <div className="w-full bg-support-light dark:bg-surface-dark rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
        
        {lastSaved && (
          <div className="mt-3 flex items-center space-x-2 text-sm text-text-muted-light dark:text-text-muted-dark">
            <CheckCircle className="w-4 h-4 text-success-500" />
            <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
          </div>
        )}
      </div>

      {/* Question Content */}
      {renderQuestion(currentQuestion)}

      {/* Navigation */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateToQuestion('prev')}
            disabled={isFirstQuestion}
            className="flex items-center space-x-2 px-6 py-3 bg-support-light dark:bg-surface-dark text-text-primary-light dark:text-text-secondary-dark rounded-lg hover:bg-support-light dark:hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="text-center">
            <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Question {currentQuestionIndex + 1} of {currentCategory?.questions.length || 0}
            </div>
            <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
              {currentSection?.name} → {currentCategory?.name}
            </div>
          </div>

          {isLastQuestion ? (
            <button
              onClick={onComplete}
              className="flex items-center space-x-2 px-6 py-3 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Complete Assessment</span>
            </button>
          ) : (
            <button
              onClick={() => navigateToQuestion('next')}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
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