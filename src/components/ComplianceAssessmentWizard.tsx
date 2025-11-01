import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Clock, Target, FileText, BarChart3 } from 'lucide-react';

interface AssessmentQuestion {
  id: string;
  question: string;
  description: string;
  category: string;
  controlId: string;
  options: Array<{
    text: string;
    score: number;
  }>;
}

interface AssessmentAnswer {
  questionId: string;
  selectedOption: number;
  score: number;
  notes?: string;
}

interface ComplianceAssessmentWizardProps {
  onComplete?: (results: any) => void;
  onSave?: (answers: AssessmentAnswer[]) => void;
}

const ComplianceAssessmentWizard: React.FC<ComplianceAssessmentWizardProps> = ({
  onComplete,
  onSave
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const assessmentQuestions: AssessmentQuestion[] = [
    {
      id: 'ac-001',
      question: 'How is user access to systems and applications managed?',
      description: 'This question assesses whether your organization has proper access control procedures in place.',
      category: 'Access Control',
      controlId: 'AC.1.001',
      options: [
        { text: 'No formal access management process', score: 0 },
        { text: 'Basic access management with manual processes', score: 25 },
        { text: 'Formal access management with documented procedures', score: 50 },
        { text: 'Automated access management with regular reviews', score: 75 },
        { text: 'Advanced access management with continuous monitoring', score: 100 }
      ]
    },
    {
      id: 'ac-002',
      question: 'How are user accounts provisioned and deprovisioned?',
      description: 'This question evaluates your account lifecycle management processes.',
      category: 'Access Control',
      controlId: 'AC.1.002',
      options: [
        { text: 'No formal account management process', score: 0 },
        { text: 'Manual account creation and deletion', score: 25 },
        { text: 'Documented account management procedures', score: 50 },
        { text: 'Automated account provisioning with approval workflows', score: 75 },
        { text: 'Fully automated with integration to HR systems', score: 100 }
      ]
    },
    {
      id: 'au-001',
      question: 'How are system activities logged and monitored?',
      description: 'This question assesses your audit and accountability capabilities.',
      category: 'Audit & Accountability',
      controlId: 'AU.1.076',
      options: [
        { text: 'No logging or monitoring capabilities', score: 0 },
        { text: 'Basic logging on critical systems only', score: 25 },
        { text: 'Comprehensive logging on all systems', score: 50 },
        { text: 'Centralized logging with automated monitoring', score: 75 },
        { text: 'Advanced SIEM with real-time threat detection', score: 100 }
      ]
    },
    {
      id: 'at-001',
      question: 'How is security awareness training provided to personnel?',
      description: 'This question evaluates your security awareness and training program.',
      category: 'Awareness & Training',
      controlId: 'AT.2.056',
      options: [
        { text: 'No formal security training program', score: 0 },
        { text: 'Annual security awareness training only', score: 25 },
        { text: 'Regular training with basic phishing simulations', score: 50 },
        { text: 'Comprehensive training with advanced simulations', score: 75 },
        { text: 'Continuous training with personalized content', score: 100 }
      ]
    },
    {
      id: 'cm-001',
      question: 'How are system configurations managed and controlled?',
      description: 'This question assesses your configuration management processes.',
      category: 'Configuration Management',
      controlId: 'CM.2.061',
      options: [
        { text: 'No formal configuration management', score: 0 },
        { text: 'Manual configuration documentation', score: 25 },
        { text: 'Documented configuration baselines', score: 50 },
        { text: 'Automated configuration management with change control', score: 75 },
        { text: 'Continuous configuration monitoring and compliance', score: 100 }
      ]
    },
    {
      id: 'ia-001',
      question: 'How is user authentication implemented?',
      description: 'This question evaluates your identification and authentication controls.',
      category: 'Identification & Authentication',
      controlId: 'IA.2.081',
      options: [
        { text: 'Password-only authentication', score: 0 },
        { text: 'Strong password requirements', score: 25 },
        { text: 'Multi-factor authentication for privileged accounts', score: 50 },
        { text: 'Multi-factor authentication for all users', score: 75 },
        { text: 'Advanced authentication with risk-based factors', score: 100 }
      ]
    },
    {
      id: 'ir-001',
      question: 'How is incident response handled?',
      description: 'This question assesses your incident response capabilities.',
      category: 'Incident Response',
      controlId: 'IR.1.076',
      options: [
        { text: 'No formal incident response process', score: 0 },
        { text: 'Basic incident response procedures', score: 25 },
        { text: 'Documented incident response plan', score: 50 },
        { text: 'Tested incident response with regular exercises', score: 75 },
        { text: 'Advanced incident response with automation', score: 100 }
      ]
    },
    {
      id: 'sc-001',
      question: 'How is network security implemented?',
      description: 'This question evaluates your system and communications protection.',
      category: 'System & Communications Protection',
      controlId: 'SC.1.175',
      options: [
        { text: 'Basic firewall configuration only', score: 0 },
        { text: 'Standard firewall and network segmentation', score: 25 },
        { text: 'Advanced network security with monitoring', score: 50 },
        { text: 'Comprehensive network security with intrusion detection', score: 75 },
        { text: 'Advanced network security with AI-powered threat detection', score: 100 }
      ]
    }
  ];

  const currentQuestion = assessmentQuestions[currentStep];
  const progress = ((currentStep + 1) / assessmentQuestions.length) * 100;

  const handleAnswerSelect = (optionIndex: number) => {
    setCurrentAnswer(optionIndex);
  };

  const handleNext = () => {
    if (currentAnswer !== null) {
      const newAnswer: AssessmentAnswer = {
        questionId: currentQuestion.id,
        selectedOption: currentAnswer,
        score: currentQuestion.options[currentAnswer].score,
        notes: notes.trim() || undefined
      };

      const updatedAnswers = [...answers, newAnswer];
      setAnswers(updatedAnswers);

      if (onSave) {
        onSave(updatedAnswers);
      }

      if (currentStep < assessmentQuestions.length - 1) {
        setCurrentStep(currentStep + 1);
        setCurrentAnswer(null);
        setNotes('');
      } else {
        setIsComplete(true);
        if (onComplete) {
          onComplete({
            answers: updatedAnswers,
            score: calculateComplianceScore(updatedAnswers),
            level: getComplianceLevel(calculateComplianceScore(updatedAnswers))
          });
        }
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      const previousAnswer = answers[currentStep - 1];
      setCurrentAnswer(previousAnswer?.selectedOption || null);
      setNotes(previousAnswer?.notes || '');
    }
  };

  const calculateComplianceScore = (answers: AssessmentAnswer[]): number => {
    if (answers.length === 0) return 0;
    const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0);
    return Math.round(totalScore / answers.length);
  };

  const getComplianceLevel = (score: number): string => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 40) return 'Needs Improvement';
    return 'Critical';
  };

  const getScoreBreakdown = () => {
    const categories = [...new Set(assessmentQuestions.map(q => q.category))];
    return categories.map(category => {
      const categoryAnswers = answers.filter(answer => {
        const question = assessmentQuestions.find(q => q.id === answer.questionId);
        return question?.category === category;
      });
      const categoryScore = categoryAnswers.length > 0 
        ? Math.round(categoryAnswers.reduce((sum, answer) => sum + answer.score, 0) / categoryAnswers.length)
        : 0;
      return { category, score: categoryScore };
    });
  };

  if (isComplete) {
    const overallScore = calculateComplianceScore(answers);
    const complianceLevel = getComplianceLevel(overallScore);
    const scoreBreakdown = getScoreBreakdown();

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Link to="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
                <img 
                  src="/cybercertitude.png" 
                  alt="CyberCertitude" 
                  className="w-16 h-16 flex-shrink-0" 
                />
              </Link>
            </div>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Assessment Complete!</h1>
            <p className="text-gray-600">Your CMMC 2.0 compliance assessment results</p>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{overallScore}%</div>
                <div className="text-lg font-semibold text-gray-800">Overall Score</div>
                <div className="text-sm text-gray-600">CMMC 2.0 Compliance</div>
              </div>

              <div className="bg-green-50 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">{complianceLevel}</div>
                <div className="text-lg font-semibold text-gray-800">Compliance Level</div>
                <div className="text-sm text-gray-600">Assessment Grade</div>
              </div>

              <div className="bg-purple-50 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">{answers.length}</div>
                <div className="text-lg font-semibold text-gray-800">Questions Answered</div>
                <div className="text-sm text-gray-600">Out of {assessmentQuestions.length}</div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Score Breakdown by Category</h2>
              <div className="space-y-4">
                {scoreBreakdown.map(({ category, score }) => (
                  <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-gray-800">{category}</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className={`h-2 rounded-full ${
                            score >= 75 ? 'bg-green-500' :
                            score >= 50 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold text-gray-800 w-12 text-right">{score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Next Steps</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Immediate Actions</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Review low-scoring categories</li>
                    <li>• Download relevant templates</li>
                    <li>• Create implementation plan</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Long-term Goals</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Implement missing controls</li>
                    <li>• Collect supporting evidence</li>
                    <li>• Prepare for C3PAO assessment</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  setIsComplete(false);
                  setCurrentStep(0);
                  setAnswers([]);
                  setCurrentAnswer(null);
                  setNotes('');
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Retake Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Link to="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
                <img 
                  src="/cybercertitude.png" 
                  alt="CyberCertitude" 
                  className="w-12 h-12 flex-shrink-0" 
                />
              </Link>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-800">CMMC 2.0 Compliance Assessment</h1>
                  <div className="text-sm text-gray-600">
                    Question {currentStep + 1} of {assessmentQuestions.length}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{currentQuestion.question}</h2>
                <p className="text-gray-600 mb-2">{currentQuestion.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded mr-2">{currentQuestion.category}</span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{currentQuestion.controlId}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Answer Options */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select your current implementation level:</h3>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    currentAnswer === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={index}
                    checked={currentAnswer === index}
                    onChange={() => handleAnswerSelect(index)}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{option.text}</div>
                    <div className="text-sm text-gray-600 mt-1">Score: {option.score}%</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional context or details about your current implementation..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={currentAnswer === null}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {currentStep === assessmentQuestions.length - 1 ? 'Complete Assessment' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceAssessmentWizard;
