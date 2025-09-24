import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, AlertCircle, Clock, Users, Shield, FileText, ArrowRight, Download, Upload } from 'lucide-react';
import { cmmc2Level1Framework } from '../data/frameworks/cmmc-2.0-level1';
import { Question, Option } from '../shared/types';
import { Level1DataService, Level1AssessmentData } from '../services/level1DataService';
import { logger } from '../utils/logger';

interface AssessmentState {
  [questionId: string]: number;
}

interface EvidenceState {
  [questionId: string]: {
    documents: File[];
    screenshots: File[];
    notes: string;
  };
}

const CMMCLevel1GuidedImplementation: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentDomain, setCurrentDomain] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [assessmentState, setAssessmentState] = useState<AssessmentState>({});
  const [evidenceState, setEvidenceState] = useState<EvidenceState>({});
  const [completedDomains, setCompletedDomains] = useState<Set<number>>(new Set());
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);

  const framework = cmmc2Level1Framework;
  const currentSection = framework.sections[currentDomain];
  const currentQ = currentSection.categories[0].questions[currentQuestion];

  const totalQuestions = framework.sections.reduce((total, section) => 
    total + section.categories.reduce((sectionTotal, category) => 
      sectionTotal + category.questions.length, 0), 0);

  const completedQuestions = Object.keys(assessmentState).length;
  const progressPercentage = (completedQuestions / totalQuestions) * 100;

  const handleAnswerChange = (questionId: string, value: number) => {
    setAssessmentState(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < currentSection.categories[0].questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentDomain < framework.sections.length - 1) {
      setCompletedDomains(prev => new Set([...prev, currentDomain]));
      setCurrentDomain(currentDomain + 1);
      setCurrentQuestion(0);
    } else {
      // Assessment complete
      setCompletedDomains(prev => new Set([...prev, currentDomain]));
      setCurrentStep(1); // Move to implementation phase
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentDomain > 0) {
      setCurrentDomain(currentDomain - 1);
      setCurrentQuestion(framework.sections[currentDomain - 1].categories[0].questions.length - 1);
    }
  };

  const handleEvidenceUpload = (questionId: string, type: 'documents' | 'screenshots', files: File[]) => {
    setEvidenceState(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [type]: files,
        notes: prev[questionId]?.notes || ''
      }
    }));
  };

  const handleNotesChange = (questionId: string, notes: string) => {
    setEvidenceState(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        notes,
        documents: prev[questionId]?.documents || [],
        screenshots: prev[questionId]?.screenshots || []
      }
    }));
  };

  const exportData = () => {
    try {
      // Create assessment data
      const assessmentData: Level1AssessmentData = {
        id: Date.now().toString(),
        frameworkId: 'cmmc-2.0-level1',
        frameworkName: framework.name,
        responses: assessmentState,
        evidence: evidenceState,
        completedDomains: Array.from(completedDomains),
        createdAt: new Date(),
        lastModified: new Date(),
        isComplete: currentStep === 1,
        version: framework.version
      };

      // Save to local storage
      Level1DataService.saveAssessmentData(assessmentData);

      // Export for main project integration
      const exportData = Level1DataService.exportAllData();
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cmmc-2.0-level1-assessment-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      logger.error('Failed to export data:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          
          // Handle Level 1 format
          if (data.framework === 'cmmc-level1' || data.framework === 'cmmc-2.0-level1') {
            if (data.assessmentData) {
              setAssessmentState(data.assessmentData.responses || {});
              setEvidenceState(data.assessmentData.evidence || {});
              setCompletedDomains(new Set(data.assessmentData.completedDomains || []));
            } else {
              // Legacy format
              setAssessmentState(data.assessmentState || {});
              setEvidenceState(data.evidenceState || {});
              setCompletedDomains(new Set(data.completedDomains || []));
            }
          } else {
            // Try to import from main project format
            Level1DataService.importData(data);
            const importedData = Level1DataService.getAllAssessmentData()[0];
            if (importedData) {
              setAssessmentState(importedData.responses || {});
              setEvidenceState(importedData.evidence || {});
              setCompletedDomains(new Set(importedData.completedDomains || []));
            }
          }
        } catch (error) {
          logger.error('Import error:', error);
          alert('Invalid file format or failed to import data');
        }
      };
      reader.readAsText(file);
    }
  };

  const getImplementationPriority = (question: Question): 'high' | 'medium' | 'low' => {
    const answer = assessmentState[question.id];
    if (answer === undefined || answer === 0) return 'high';
    if (answer === 1) return 'medium';
    return 'low';
  };

  const getRiskLevel = (question: Question): 'critical' | 'high' | 'medium' | 'low' => {
    const answer = assessmentState[question.id];
    const option = question.options.find(opt => opt.value === answer);
    return option?.riskLevel || 'medium';
  };

  const renderAssessmentStep = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">CMMC 2.0 Level 1 Assessment</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={exportData}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <label className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Progress</h2>
            <span className="text-sm text-gray-600">{completedQuestions} / {totalQuestions} questions</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex space-x-2 mb-6">
          {framework.sections.map((section, index) => (
            <div
              key={section.id}
              className={`flex-1 p-3 rounded-lg text-center ${
                completedDomains.has(index)
                  ? 'bg-green-100 text-green-800'
                  : index === currentDomain
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <div className="font-medium">{section.name}</div>
              <div className="text-sm">{section.categories[0].questions.length} practices</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">{currentSection.name}</h3>
          <p className="text-gray-600 mb-4">{currentSection.description}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>Practice {currentQuestion + 1} of {currentSection.categories[0].questions.length}</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
              {currentQ.priority} priority
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3">{currentQ.text}</h4>
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h5 className="font-medium mb-2">Guidance:</h5>
            <p className="text-sm text-gray-700">{currentQ.guidance}</p>
          </div>
          
          {currentQ.examples && currentQ.examples.length > 0 && (
            <div className="mb-4">
              <h5 className="font-medium mb-2">Examples:</h5>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {currentQ.examples.map((example, index) => (
                  <li key={index}>{example}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h5 className="font-medium mb-3">Current Implementation Status:</h5>
          <div className="space-y-3">
            {currentQ.options.map((option: Option) => (
              <label
                key={option.value}
                className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  assessmentState[currentQ.id] === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQ.id}`}
                  value={option.value}
                  checked={assessmentState[currentQ.id] === option.value}
                  onChange={(e) => handleAnswerChange(currentQ.id, parseInt(e.target.value))}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                  {option.riskLevel && (
                    <span className={`inline-block mt-1 px-2 py-1 text-xs rounded ${
                      option.riskLevel === 'critical' ? 'bg-red-100 text-red-800' :
                      option.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                      option.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {option.riskLevel} risk
                    </span>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentDomain === 0 && currentQuestion === 0}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={handleNextQuestion}
            disabled={assessmentState[currentQ.id] === undefined}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentDomain === framework.sections.length - 1 && currentQuestion === currentSection.categories[0].questions.length - 1
              ? 'Complete Assessment'
              : 'Next Practice'
            }
          </button>
        </div>
      </div>
    </div>
  );

  const renderImplementationStep = () => {
    const highPriorityQuestions = framework.sections.flatMap(section =>
      section.categories.flatMap(category =>
        category.questions.filter(q => getImplementationPriority(q) === 'high')
      )
    );

    const mediumPriorityQuestions = framework.sections.flatMap(section =>
      section.categories.flatMap(category =>
        category.questions.filter(q => getImplementationPriority(q) === 'medium')
      )
    );

    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">CMMC 2.0 Level 1 Implementation Guide</h1>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <h3 className="font-semibold text-green-800">Assessment Complete!</h3>
                <p className="text-green-700">You've completed the CMMC 2.0 Level 1 assessment. Now let's implement the missing practices.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {highPriorityQuestions.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                  <h2 className="text-xl font-semibold text-red-800">High Priority Implementation</h2>
                </div>
                <p className="text-gray-600 mb-4">These practices need immediate attention to protect your Federal Contract Information (FCI) and achieve CMMC 2.0 Level 1 compliance.</p>
                <div className="space-y-4">
                  {highPriorityQuestions.map((question) => (
                    <div key={question.id} className="border border-red-200 rounded-lg p-4">
                      <h3 className="font-medium mb-2">{question.text}</h3>
                      <div className="text-sm text-gray-600 mb-3">{question.guidance}</div>
                      {question.improvementSuggestions && question.improvementSuggestions.length > 0 && (
                        <div className="bg-red-50 p-3 rounded">
                          <h4 className="font-medium text-red-800 mb-2">Implementation Steps:</h4>
                          {question.improvementSuggestions.map((suggestion, index) => (
                            <div key={index} className="text-sm text-red-700 mb-2">
                              <div className="font-medium">{suggestion.description}</div>
                              <div className="text-xs text-red-600">
                                Timeframe: {suggestion.timeframe} | Effort: {suggestion.effort}
                              </div>
                              {suggestion.resources && (
                                <div className="text-xs text-red-600 mt-1">
                                  Resources: {suggestion.resources.join(', ')}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mediumPriorityQuestions.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 text-yellow-600 mr-3" />
                  <h2 className="text-xl font-semibold text-yellow-800">Medium Priority Implementation</h2>
                </div>
                <p className="text-gray-600 mb-4">These practices should be implemented after addressing high priority items to complete your CMMC 2.0 Level 1 implementation.</p>
                <div className="space-y-4">
                  {mediumPriorityQuestions.map((question) => (
                    <div key={question.id} className="border border-yellow-200 rounded-lg p-4">
                      <h3 className="font-medium mb-2">{question.text}</h3>
                      <div className="text-sm text-gray-600 mb-3">{question.guidance}</div>
                      {question.improvementSuggestions && question.improvementSuggestions.length > 0 && (
                        <div className="bg-yellow-50 p-3 rounded">
                          <h4 className="font-medium text-yellow-800 mb-2">Implementation Steps:</h4>
                          {question.improvementSuggestions.map((suggestion, index) => (
                            <div key={index} className="text-sm text-yellow-700 mb-2">
                              <div className="font-medium">{suggestion.description}</div>
                              <div className="text-xs text-yellow-600">
                                Timeframe: {suggestion.timeframe} | Effort: {suggestion.effort}
                              </div>
                              {suggestion.resources && (
                                <div className="text-xs text-yellow-600 mt-1">
                                  Resources: {suggestion.resources.join(', ')}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Implementation Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">High Priority</span>
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                    {highPriorityQuestions.length} practices
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Medium Priority</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                    {mediumPriorityQuestions.length} practices
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Low Priority</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                    {totalQuestions - highPriorityQuestions.length - mediumPriorityQuestions.length} practices
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</div>
                  <div>
                    <div className="font-medium">Address High Priority Items</div>
                    <div className="text-gray-600">Implement critical security practices first</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</div>
                  <div>
                    <div className="font-medium">Document Evidence</div>
                    <div className="text-gray-600">Collect and organize compliance evidence</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</div>
                  <div>
                    <div className="font-medium">Annual Self-Assessment</div>
                    <div className="text-gray-600">Conduct annual self-assessment for CMMC 2.0 Level 1</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Data Management</h3>
              <div className="space-y-3">
                <button
                  onClick={exportData}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Assessment</span>
                </button>
                <label className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Import Assessment</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentStep === 0 ? renderAssessmentStep() : renderImplementationStep()}
    </div>
  );
};

export default CMMCLevel1GuidedImplementation;