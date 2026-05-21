import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Trophy, Clock, ChevronRight, BookOpen, Lightbulb } from 'lucide-react';
import { problems } from '../utils/problems';

const QuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const problem = problems.find(p => p.id === id);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (problem) {
      setAnsweredQuestions(new Array(problem.questions.length).fill(false));
    }
  }, [problem]);

  if (!problem || !problem.questions || problem.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
          <BookOpen className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">暂无测试题</h1>
          <p className="text-gray-600 mb-6">该项目暂未配置选择题测试</p>
          <Link 
            to={`/problem/${id}`} 
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回项目
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = problem.questions[currentQuestionIndex];
  const totalQuestions = problem.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    
    if (index === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
    
    const newAnswered = [...answeredQuestions];
    newAnswered[currentQuestionIndex] = true;
    setAnsweredQuestions(newAnswered);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions(new Array(totalQuestions).fill(false));
    setIsFinished(false);
  };

  if (isFinished) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const grade = percentage >= 90 ? '优秀' : percentage >= 70 ? '良好' : percentage >= 60 ? '及格' : '需努力';
    const gradeColor = percentage >= 90 ? 'text-green-600' : percentage >= 70 ? 'text-blue-600' : percentage >= 60 ? 'text-yellow-600' : 'text-red-600';
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Pandas Lab
                  </span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link 
                  to={`/problem/${id}`} 
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回项目
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-500/30">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">测试完成！</h1>
            <p className="text-gray-600 mb-8">你已完成「{problem.title}」的选择题测试</p>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-8">
              <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                {score}/{totalQuestions}
              </div>
              <div className="text-2xl font-semibold">
                <span className={gradeColor}>{grade}</span>
                <span className="text-gray-500"> ({percentage}%)</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{score}</div>
                <div className="text-sm text-gray-500">正确</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600">{totalQuestions - score}</div>
                <div className="text-sm text-gray-500">错误</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{percentage}%</div>
                <div className="text-sm text-gray-500">正确率</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRestart}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center"
              >
                <Clock className="w-5 h-5 mr-2" />
                重新测试
              </button>
              <Link 
                to={`/problem/${id}`} 
                className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 inline-flex items-center justify-center"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                返回项目
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Pandas Lab
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to={`/problem/${id}`} 
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回项目
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
                <p className="text-blue-100">选择题测试</p>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full">
                <Clock className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">{currentQuestionIndex + 1}/{totalQuestions}</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* 当前题目 */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">
                  {currentQuestionIndex + 1}
                </span>
                <h2 className="text-xl font-semibold text-gray-900">{currentQuestion.question}</h2>
              </div>
              
              {/* 选项 */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  let optionClass = "p-4 border-2 rounded-xl transition-all duration-200 cursor-pointer";
                  
                  if (showResult) {
                    if (index === currentQuestion.correctAnswer) {
                      optionClass += " border-green-500 bg-green-50";
                    } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                      optionClass += " border-red-500 bg-red-50";
                    } else {
                      optionClass += " border-gray-200 bg-white opacity-50";
                    }
                  } else {
                    if (selectedAnswer === index) {
                      optionClass += " border-blue-500 bg-blue-50";
                    } else {
                      optionClass += " border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50";
                    }
                  }
                  
                  return (
                    <div
                      key={index}
                      onClick={() => handleAnswer(index)}
                      className={optionClass}
                    >
                      <div className="flex items-center">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold mr-4 ${
                          showResult && index === currentQuestion.correctAnswer 
                            ? 'bg-green-500 text-white' 
                            : showResult && index === selectedAnswer && index !== currentQuestion.correctAnswer
                            ? 'bg-red-500 text-white'
                            : selectedAnswer === index
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {showResult && index === currentQuestion.correctAnswer ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : showResult && index === selectedAnswer && index !== currentQuestion.correctAnswer ? (
                            <XCircle className="w-5 h-5" />
                          ) : (
                            String.fromCharCode(65 + index)
                          )}
                        </span>
                        <span className="text-gray-700">{option}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 解析 */}
              {showResult && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-center mb-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
                    <span className="font-semibold text-yellow-800">解析</span>
                  </div>
                  <p className="text-yellow-700">{currentQuestion.explanation}</p>
                </div>
              )}
            </div>

            {/* 导航按钮 */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className={`flex items-center px-6 py-3 rounded-lg transition-all duration-200 ${
                  currentQuestionIndex === 0 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                上一题
              </button>
              
              {/* 进度指示 */}
              <div className="flex items-center space-x-1">
                {answeredQuestions.map((answered, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentQuestionIndex 
                        ? 'bg-blue-500 scale-110' 
                        : answered 
                          ? 'bg-green-500' 
                          : 'bg-gray-200'
                    }`}
                  ></div>
                ))}
              </div>
              
              <button
                onClick={handleNext}
                disabled={!showResult}
                className={`flex items-center px-6 py-3 rounded-lg transition-all duration-200 ${
                  !showResult 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/30'
                }`}
              >
                {currentQuestionIndex < totalQuestions - 1 ? (
                  <>
                    下一题
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                ) : (
                  <>
                    完成测试
                    <Trophy className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizPage;
