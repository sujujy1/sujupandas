import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { problems } from '../utils/problems';
import { Lightbulb, RotateCcw, Check, ArrowLeft, Puzzle, Sparkles } from 'lucide-react';

interface Piece {
  id: number;
  content: string;
  type: 'name' | 'desc';
  correctIndex: number;
}

const FunLearningPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const problem = problems.find(p => p.id === id);

  // 状态
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [checkResult, setCheckResult] = useState<boolean[] | null>(null);
  const [moves, setMoves] = useState(0);

  // 初始化碎片
  useEffect(() => {
    if (problem?.puzzlePieces) {
      const allPieces: Piece[] = [];
      problem.puzzlePieces.forEach((func, i) => {
        allPieces.push({ id: i * 2, content: func.name, type: 'name', correctIndex: i * 2 });
        allPieces.push({ id: i * 2 + 1, content: func.description, type: 'desc', correctIndex: i * 2 + 1 });
      });
      // 打乱
      const shuffled = [...allPieces];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setPieces(shuffled);
    }
  }, [problem?.id]);

  // 点击选中
  const handlePieceClick = (index: number) => {
    setCheckResult(null);
    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else if (selectedIndex === index) {
      setSelectedIndex(null);
    } else {
      const newPieces = [...pieces];
      [newPieces[selectedIndex], newPieces[index]] = [newPieces[index], newPieces[selectedIndex]];
      setPieces(newPieces);
      setSelectedIndex(null);
      setMoves(m => m + 1);
    }
  };

  // 拖拽
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (index: number) => {
    if (dragIndex !== null && dragIndex !== index) {
      const newPieces = [...pieces];
      [newPieces[dragIndex], newPieces[index]] = [newPieces[index], newPieces[dragIndex]];
      setPieces(newPieces);
      setMoves(m => m + 1);
    }
    setDragIndex(null);
  };

  // 检查答案
  const handleCheck = () => {
    const result = pieces.map((p, i) => p.correctIndex === i);
    setCheckResult(result);
  };

  // 重新打乱
  const handleShuffle = () => {
    const shuffled = [...pieces];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setPieces(shuffled);
    setSelectedIndex(null);
    setCheckResult(null);
    setMoves(0);
  };

  if (!problem) return <div>找不到项目</div>;

  const correctCount = checkResult ? checkResult.filter(Boolean).length : 0;
  const isComplete = checkResult && correctCount === 16;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 顶部导航 */}
        <div className="mb-6 flex items-center justify-between">
          <Link to={`/problem/${problem.id}`} className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
            <ArrowLeft className="w-5 h-5 mr-1" /> 返回项目
          </Link>
          <h1 className="text-2xl font-bold text-indigo-900 flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-yellow-500" />
            Pandas趣味学习 - {problem.title}
          </h1>
          <div className="w-20" />
        </div>

        {/* 概念学习区 */}
        {problem.funConcepts && problem.funConcepts.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-indigo-800 mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
              📚 概念学习
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {problem.funConcepts.map((concept, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-5 border-2 border-indigo-100 hover:border-indigo-300 transition-all">
                  <div className="flex items-start mb-3">
                    <span className="text-3xl mr-3">{concept.emoji}</span>
                    <h3 className="font-bold text-indigo-900 text-lg">{concept.title}</h3>
                  </div>
                  <p className="text-gray-700 mb-3 text-sm leading-relaxed">{concept.explanation}</p>
                  <div className="bg-indigo-50 rounded-lg p-3 text-sm font-mono text-indigo-700 border-l-4 border-indigo-300">
                    💡 {concept.example}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 拼图游戏区 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-100">
          <h2 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
            <Puzzle className="w-5 h-5 mr-2 text-purple-500" />
            🧩 函数拼图游戏
            <span className="ml-auto text-sm font-normal text-gray-500">移动次数: {moves}</span>
          </h2>
          
          <p className="text-gray-600 mb-5 text-sm bg-purple-50 rounded-lg p-3">
            🎯 <strong>游戏规则</strong>：把 <strong>8 个函数</strong> 的"函数名"和"函数作用"拼回正确位置！每2格为一个函数（函数名在左，函数作用在右）。
            <br />点击两个格子可以互换位置，也可以直接拖拽。
          </p>

          {/* 拼图格子 */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {pieces.map((piece, index) => {
              const isSelected = selectedIndex === index;
              const isChecked = checkResult !== null;
              const isCorrect = checkResult?.[index];
              
              let bgClass = 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 hover:border-purple-400';
              if (piece.type === 'name') bgClass = 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:border-blue-400';
              if (piece.type === 'desc') bgClass = 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-400';
              if (isSelected) bgClass = 'bg-gradient-to-br from-yellow-100 to-orange-100 border-orange-400 ring-2 ring-orange-400';
              if (isChecked && isCorrect) bgClass = 'bg-gradient-to-br from-green-200 to-emerald-300 border-green-500';
              if (isChecked && !isCorrect) bgClass = 'bg-gradient-to-br from-red-200 to-pink-300 border-red-500';
              
              return (
                <div
                  key={piece.id}
                  draggable
                  onClick={() => handlePieceClick(index)}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                  className={`
                    min-h-20 p-3 rounded-xl border-2 cursor-pointer
                    transition-all duration-200 hover:scale-105 hover:shadow-lg
                    flex items-center justify-center text-center
                    ${bgClass}
                    ${dragIndex === index ? 'opacity-50' : ''}
                  `}
                >
                  <div className="w-full">
                    <div className={`text-xs font-bold mb-1 uppercase tracking-wider ${piece.type === 'name' ? 'text-blue-600' : 'text-green-600'}`}>
                      {piece.type === 'name' ? '📌 函数' : '📝 作用'}
                    </div>
                    <div className={`font-mono text-sm font-semibold ${piece.type === 'name' ? 'text-blue-800' : 'text-green-800'}`}>
                      {piece.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 按钮区 */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleShuffle}
              className="px-6 py-3 bg-gradient-to-r from-gray-500 to-slate-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center"
            >
              <RotateCcw className="w-5 h-5 mr-2" /> 重新打乱
            </button>
            <button
              onClick={handleCheck}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center"
            >
              <Check className="w-5 h-5 mr-2" /> 检查答案
            </button>
          </div>

          {/* 结果展示 */}
          {checkResult && (
            <div className={`mt-6 p-5 rounded-xl text-center ${isComplete ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300' : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200'}`}>
              <div className="text-4xl mb-2">{isComplete ? '🎉🎊✨' : '📊'}</div>
              <div className="text-xl font-bold text-gray-800 mb-1">
                {isComplete ? '太棒了！全部正确！' : `当前正确率: ${correctCount}/16 (${Math.round(correctCount/16*100)}%)`}
              </div>
              {!isComplete && <div className="text-sm text-gray-600">继续加油，再试试吧！绿色=正确，红色=位置不对</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FunLearningPage;
