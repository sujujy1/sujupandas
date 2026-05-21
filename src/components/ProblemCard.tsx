import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

interface ProblemCardProps {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  score: number;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ id, title, difficulty, completed, score }) => {
  // 根据难度获取颜色和标签
  const getDifficultyInfo = () => {
    switch (difficulty) {
      case 'easy':
        return { color: 'bg-green-100 text-green-800', label: '简单' };
      case 'medium':
        return { color: 'bg-orange-100 text-orange-800', label: '中等' };
      case 'hard':
        return { color: 'bg-red-100 text-red-800', label: '困难' };
      default:
        return { color: 'bg-gray-100 text-gray-800', label: '未知' };
    }
  };

  const { color, label } = getDifficultyInfo();

  return (
    <Link
      to={`/problem/${id}`}
      className="block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 group transform hover:-translate-y-1"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-gray-800 mr-3">{id}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${color} transition-all duration-300 group-hover:scale-105`}>
            {label}
          </span>
        </div>
        {completed && (
          <CheckCircle className="w-6 h-6 text-green-500 transition-all duration-300 group-hover:scale-110" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
        {title}
      </h3>
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-800">得分: {score}/10</span>
        <span className="text-sm text-blue-600 font-medium transition-all duration-300 group-hover:translate-x-1">开始练习 →</span>
      </div>
    </Link>
  );
};

export default ProblemCard;