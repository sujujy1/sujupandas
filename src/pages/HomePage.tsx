import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProblemCard from '../components/ProblemCard';
import { problems, caseStudy } from '../utils/problems';
import useProgressStore from '../store/useProgressStore';
import { BookOpen, BarChart3, Award, ChevronRight, Database, Code, TrendingUp, Trophy, Clock, FileText } from 'lucide-react';

const HomePage: React.FC = () => {
  const { totalScore, completedProblems, totalProblems, problemScores } = useProgressStore();
  const progressRef = useRef<HTMLDivElement>(null);

  const completionPercentage = (completedProblems / totalProblems) * 100;

  const getProblemScore = (problemId: string) => {
    const score = problemScores.find((s) => s.problemId === problemId);
    return score ? score.score : 0;
  };

  const getProblemCompleted = (problemId: string) => {
    const score = problemScores.find((s) => s.problemId === problemId);
    return score ? score.completed : false;
  };

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = '0%';
      setTimeout(() => {
        if (progressRef.current) {
          progressRef.current.style.width = `${completionPercentage}%`;
        }
      }, 100);
    }
  }, [completionPercentage]);

  const features = [
    { icon: Database, title: '真实数据集', description: '使用真实业务数据进行练习' },
    { icon: Code, title: '实时运行代码', description: '代码即时执行，所见即所得' },
    { icon: TrendingUp, title: '循序渐进', description: '从入门到进阶，逐步提升' },
    { icon: Trophy, title: '徽章认证', description: '完成挑战，获得成就徽章' },
  ];

  const difficultyLabels: Record<string, { text: string; color: string; bg: string }> = {
    easy: { text: '入门', color: 'text-green-700', bg: 'bg-green-100' },
    medium: { text: '进阶', color: 'text-yellow-700', bg: 'bg-yellow-100' },
    hard: { text: '高级', color: 'text-red-700', bg: 'bg-red-100' },
  };

  const problemIcons = ['🛒', '📊', '🧹', '📈', '🔍', '🔗', '📋', '⏰', '🎯', '⚡', '🔄', '🔬', '⚙️', '⚠️'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Pandas Lab
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/case-study" 
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                综合实战
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Code className="w-4 h-4 mr-2" />
            实战课程 · 无需安装
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Pandas 数据分析
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">实战训练营</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            10个精选实战项目，从入门到进阶，完全在浏览器中运行代码
            <br />
            让你从零开始掌握数据分析核心技能
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center px-4 py-2 bg-white rounded-full shadow-sm text-sm text-gray-700">
                <feature.icon className="w-4 h-4 mr-2 text-blue-500" />
                {feature.title}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 text-center hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-4"></div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">精选项目</h2>
                <p className="text-sm text-gray-500">共 {problems.length} 个项目 · 选择一个开始学习之旅</p>
              </div>
            </div>
            <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
              <Award className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="font-semibold text-gray-900">{totalScore}/150</span>
              <span className="text-gray-500 text-sm ml-2">分</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((problem, index) => {
              const difficulty = difficultyLabels[problem.difficulty] || difficultyLabels.easy;
              return (
                <Link
                  key={problem.id}
                  to={`/problem/${problem.id}`}
                  className="block bg-white rounded-xl p-6 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{problemIcons[index] || '📊'}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficulty.bg} ${difficulty.color}`}>
                        {difficulty.text}
                      </span>
                      {getProblemCompleted(problem.id) && (
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {problem.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{problem.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      {problem.difficulty === 'easy' ? '30分钟' : problem.difficulty === 'medium' ? '45分钟' : '60分钟'}
                    </div>
                    <div className="flex items-center text-sm font-medium text-blue-600 group-hover:translate-x-1 transition-transform">
                      开始学习 <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mb-16">
          <div className="flex items-center mb-8">
            <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-orange-500 rounded-full mr-4"></div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">综合实战案例</h2>
              <p className="text-sm text-gray-500">将所学知识应用到真实业务场景中</p>
            </div>
          </div>

          <Link
            to="/case-study"
            className="block bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white hover:shadow-2xl hover:shadow-slate-800/50 transition-all duration-300 transform hover:-translate-y-2 group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center">
                <span className="text-5xl mr-4">🎯</span>
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300">
                    困难
                  </span>
                </div>
              </div>
              {getProblemCompleted('case-study') && (
                <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
              )}
            </div>
            <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-300 transition-colors">
              {caseStudy.title}
            </h3>
            <p className="text-gray-300 mb-6">
              一个完整的数据分析案例，包含数据加载、清洗、探索、可视化和结论总结
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-300">
                  <Clock className="w-4 h-4 mr-2" />
                  60分钟
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <FileText className="w-4 h-4 mr-2" />
                  得分: {getProblemScore('case-study')}/50
                </div>
              </div>
              <span className="flex items-center font-medium text-blue-300 group-hover:translate-x-1 transition-transform">
                开始挑战 <ChevronRight className="w-5 h-5 ml-2" />
              </span>
            </div>
          </Link>
        </div>

        <div className="text-center py-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-4">开始你的数据分析之旅</h2>
          <p className="text-blue-100 mb-8">无需任何安装，点击上方项目卡片即可开始练习</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to={`/problem/1`} 
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-xl hover:shadow-white/20 transition-all duration-300 transform hover:-translate-y-1"
            >
              开始学习
              <ChevronRight className="w-4 h-4 ml-2 inline" />
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Pandas Lab</span>
            </div>
            <div className="text-center md:text-right text-gray-500 text-sm">
              <p>© {new Date().getFullYear()} Pandas数据分析实战训练营</p>
              <p className="mt-1">提升你的数据分析技能</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;