import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Code, Terminal, HelpCircle, BookOpen, Target, GripVertical } from 'lucide-react';
import { problems } from '../utils/problems';
import SimpleCodeEditor from '../components/SimpleCodeEditor';

const ProblemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const [problem, setProblem] = useState<typeof problems[0] | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  
  const getGameName = (id: string) => {
    const gameNames: Record<string, string> = {
      '1': '幸运转盘',
      '2': '跳跳答题',
      '3': '打地鼠答题',
      '4': '消消乐答题',
      '5': '弹球答题',
      '6': '接水果答题',
      '7': '迷宫答题',
      '8': '翻牌答题',
      '9': '投篮答题',
      '10': '切切答题',
      '11': '连线答题',
      '12': '拼图答题',
      '13': '抓娃娃答题',
      '14': '钓鱼答题'
    };
    return gameNames[id] || '闯关游戏';
  };
  
  // 可拖动分隔线状态
  const [splitPosition, setSplitPosition] = useState(20); // 默认左侧占20%，代码编辑器占80%
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      const foundProblem = problems.find(p => p.id === id);
      setProblem(foundProblem);
      setIsLoading(false);
    }
  }, [id]);

  // 拖动处理函数
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const splitterWidth = 8; // 线宽8px
    const x = e.clientX - rect.left - (splitterWidth / 2);
    const percentage = (x / (rect.width - splitterWidth)) * 100;
    
    // 限制最小和最大宽度（25% - 65%）
    const clampedPercentage = Math.max(25, Math.min(65, percentage));
    setSplitPosition(clampedPercentage);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 添加和移除全局事件监听器
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-900">加载中...</h1>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">题目不存在</h1>
          <Link 
            to="/" 
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const difficultyConfig = {
    easy: { label: '入门', color: 'text-green-700', bg: 'bg-green-100', border: 'border-green-200' },
    medium: { label: '进阶', color: 'text-yellow-700', bg: 'bg-yellow-100', border: 'border-yellow-200' },
    hard: { label: '高级', color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-200' },
  };
  
  const config = difficultyConfig[problem.difficulty] || difficultyConfig.easy;

  const problemIcons = ['📊', '🧹', '📈', '🔍', '🔗', '📋', '⏰', '🎯', '⚡', '🔄'];
  const iconIndex = parseInt(problem.id) - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                to="/" 
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回首页
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="h-[calc(100vh-64px)]">
        <div className="h-full bg-white shadow-xl">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <span className="text-5xl mr-4">{problemIcons[iconIndex] || '📊'}</span>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-blue-100">题目 {problem.id}</p>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 h-[calc(100%-90px)]">
            <div 
              ref={containerRef}
              className="flex gap-4 h-full"
            >
              {/* 左侧：题目描述区域 */}
              <div 
                className="space-y-6 overflow-auto"
                style={{ flexBasis: `${splitPosition}%`, minWidth: '25%', maxWidth: '65%' }}
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <BookOpen className="w-5 h-5 text-blue-500 mr-2" />
                    {problem.learningContent?.concept || '学习目标'}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {problem.learningContent?.explanation || problem.description}
                  </p>
                  {problem.learningContent?.keyPoints && (
                    <ul className="mt-4 space-y-2">
                      {problem.learningContent.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start text-gray-600 text-sm">
                          <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-2 flex-shrink-0 mt-0.5">
                            ✓
                          </span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                  {problem.learningContent?.examples && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">常用示例：</h4>
                      <div className="space-y-2">
                        {problem.learningContent.examples.map((example, index) => (
                          <div key={index} className="px-3 py-2 bg-gray-50 rounded-lg text-sm font-mono text-gray-600">
                            {example}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Terminal className="w-5 h-5 text-blue-500 mr-2" />
                    任务要求
                  </h3>
                  <ul className="space-y-2">
                    {problem.requirements.split('\n').map((requirement, index) => (
                      <li key={index} className="flex items-start text-gray-600">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">
                          {index + 1}
                        </span>
                        {requirement.replace(/^\d+\.\s*/, '')}
                      </li>
                    ))}
                  </ul>
                </div>

                {problem.steps && problem.steps.length > 0 && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Target className="w-5 h-5 text-purple-500 mr-2" />
                      操作流程
                    </h3>
                    <div className="space-y-3">
                      {problem.steps.map((step, index) => (
                        <div key={step.step} className="flex gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/25">
                              {step.step}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-gray-800">{step.title}</h4>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                            {step.code && (
                              <div className="mt-2 px-3 py-2 bg-gray-900 rounded-lg text-sm font-mono text-green-400 overflow-x-auto">
                                {step.code}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Code className="w-5 h-5 text-blue-500 mr-2" />
                    参考API
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {problem.hints.map((hint, index) => (
                      <span 
                        key={index} 
                        className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg text-sm font-mono border border-blue-100"
                      >
                        {hint}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 趣味概念学习按钮 */}
                {problem.puzzlePieces && problem.puzzlePieces.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <Link
                      to={`/problem/${problem.id}/fun`}
                      className="block w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl font-bold text-center hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 flex items-center justify-center space-x-3 group"
                    >
                      <span className="text-2xl group-hover:animate-bounce">🧩</span>
                      <span className="text-lg">趣味概念学习与函数记忆</span>
                      <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                )}

                {/* 测试按钮 */}
                {problem.questions && problem.questions.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <Link
                      to={`/problem/${problem.id}/quiz`}
                      className="block w-full py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-xl font-bold text-center hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 flex items-center justify-center space-x-3 group"
                    >
                      <span className="text-2xl group-hover:animate-bounce">🎮</span>
                      <span className="text-lg">开始游戏 - {getGameName(problem.id)} ({problem.questions.length}关)</span>
                      <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* 可拖动分隔线 */}
              <div
                className={`
                  w-2 flex-shrink-0 cursor-col-resize
                  flex items-center justify-center
                  group relative
                  rounded-full
                  ${isDragging ? 'bg-blue-400' : 'bg-slate-300 hover:bg-blue-300'}
                  transition-colors duration-200
                `}
                onMouseDown={handleMouseDown}
              >
                <div className={`
                  w-1.5 h-8 rounded-full
                  ${isDragging ? 'bg-white' : 'bg-slate-400 group-hover:bg-white'}
                  transition-colors duration-200
                `}>
                  <GripVertical className={`w-3 h-3 absolute ${isDragging ? 'text-white' : 'text-slate-500'}`} />
                </div>
              </div>

              {/* 右侧：代码编辑器区域 */}
              <div 
                className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col"
                style={{ flexBasis: `${100 - splitPosition}%`, minWidth: '35%', maxWidth: '75%' }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Terminal className="w-5 h-5 text-blue-500 mr-2" />
                  代码编辑器
                </h3>
                <div className="flex-1">
                  <SimpleCodeEditor solution={problem.solution} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProblemPage;
