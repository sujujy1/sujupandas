import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Code, BookOpen, Target, Clock, FileText, GripVertical } from 'lucide-react';
import { caseStudy } from '../utils/problems';
import SimpleCodeEditor from '../components/SimpleCodeEditor';

const CaseStudyPage: React.FC = () => {
  // 可拖动分隔线状态
  const [splitPosition, setSplitPosition] = useState(40); // 默认左侧占40%
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    const splitterWidth = 8;
    const x = e.clientX - rect.left - (splitterWidth / 2);
    const percentage = (x / (rect.width - splitterWidth)) * 100;
    const clampedPercentage = Math.max(25, Math.min(65, percentage));
    setSplitPosition(clampedPercentage);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

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
          <div className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <span className="text-5xl mr-4">🎯</span>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold text-white">{caseStudy.title}</h1>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                      困难
                    </span>
                  </div>
                  <p className="text-red-100">综合实战案例</p>
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
              {/* 左侧：案例描述区域 */}
              <div 
                className="space-y-6 overflow-auto"
                style={{ flexBasis: `${splitPosition}%`, minWidth: '25%', maxWidth: '65%' }}
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Code className="w-5 h-5 text-blue-500 mr-2" />
                    案例描述
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    一个完整的数据分析案例，包含数据加载、清洗、探索、可视化和结论总结。
                    通过这个实战案例，你将综合运用所学的Pandas技能，解决真实的业务问题。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Target className="w-5 h-5 text-blue-500 mr-2" />
                    学习目标
                  </h3>
                  <ul className="space-y-2">
                    {caseStudy.steps.map((step) => (
                      <li key={step.id} className="flex items-start text-gray-600">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">
                          {step.id}
                        </span>
                        <div>
                          <span className="font-medium text-gray-900">{step.title}</span>
                          <p className="text-sm text-gray-500">{step.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-2 text-blue-500" />
                    <span>约60分钟</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FileText className="w-5 h-5 mr-2 text-blue-500" />
                    综合评分
                  </div>
                </div>
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
                className="bg-slate-50 rounded-xl p-4 border border-slate-100 overflow-hidden flex flex-col"
                style={{ flexBasis: `${100 - splitPosition}%`, minWidth: '35%', maxWidth: '75%' }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Code className="w-5 h-5 text-blue-500 mr-2" />
                  代码编辑器
                </h3>
                <div className="flex-1 overflow-hidden">
                  <SimpleCodeEditor />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CaseStudyPage;
