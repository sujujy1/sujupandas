import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, RotateCcw, Code, Terminal, Lightbulb, X, GripVertical } from 'lucide-react';

interface SimpleCodeEditorProps {
  initialCode?: string;
  solution?: string;
}

const SimpleCodeEditor: React.FC<SimpleCodeEditorProps> = ({ initialCode, solution }) => {
  const defaultCode = `import pandas as pd
import numpy as np

# 创建一个简单的DataFrame
data = {'name': ['Alice', 'Bob', 'Charlie', 'David'], 'age': [25, 30, 35, 28], 'score': [85, 92, 78, 95]}
df = pd.DataFrame(data)

print("数据预览:")
print(df)
print("统计信息:")
print(df.describe())`;

  const [code, setCode] = useState(initialCode || defaultCode);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  
  // 可拖动分隔线状态
  const [splitPosition, setSplitPosition] = useState(50); // 默认50%
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleRun = async () => {
    if (!code.trim()) {
      setOutput('');
      setError('错误：代码为空');
      return;
    }

    setIsRunning(true);
    setOutput('');
    setError('');

    try {
      const startTime = Date.now();
      const response = await fetch('/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();
      const endTime = Date.now();

      setExecutionTime((endTime - startTime) / 1000);
      setOutput(result.output || '');
      setError(result.error || '');

      if (result.images && result.images.length > 0) {
        setOutput(prev => prev + `\n生成了 ${result.images.length} 张图表`);
      }
    } catch (err) {
      setError(`请求失败: ${(err as Error).message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleClear = () => {
    setOutput('');
    setError('');
    setExecutionTime(0);
  };

  const handleShowSolution = () => {
    setShowSolutionModal(true);
  };

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
    // 减去拖动线宽度的一半，使拖动更精确
    const splitterWidth = 32; // w-8 = 32px
    const x = e.clientX - rect.left - (splitterWidth / 2);
    const percentage = (x / (rect.width - splitterWidth)) * 100;
    
    // 限制最小和最大宽度（20% - 80%）
    const clampedPercentage = Math.max(20, Math.min(80, percentage));
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

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 shadow-lg">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="flex items-center space-x-2 text-slate-400">
            <Terminal className="w-4 h-4" />
            <span className="text-sm font-medium">code.py</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {solution && (
            <button
              onClick={handleShowSolution}
              className="flex items-center px-3 py-1.5 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors text-sm"
              disabled={isRunning}
            >
              <Lightbulb className="w-4 h-4 mr-1.5" />
              参考答案
            </button>
          )}
          <button
            onClick={handleClear}
            className="flex items-center px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors text-sm"
            disabled={isRunning}
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            清空
          </button>
          <button
            onClick={handleRun}
            className="flex items-center px-4 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/25 transition-all text-sm font-medium"
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5"></div>
                运行中...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-1.5" />
                运行代码
              </>
            )}
          </button>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="flex h-[600px]"
      >
        {/* 代码编辑区 */}
        <div 
          className="overflow-hidden"
          style={{ flexBasis: `${splitPosition}%`, minWidth: '20%', maxWidth: '80%' }}
        >
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full p-4 font-mono text-sm bg-slate-900 text-emerald-400 resize-none focus:outline-none placeholder-slate-500"
            placeholder="在此输入Python代码..."
            spellCheck={false}
          />
        </div>

        {/* 可拖动分隔线 */}
        <div
          className={`
            w-8 flex-shrink-0 cursor-col-resize
            flex items-center justify-center
            group relative
            ${isDragging ? 'bg-blue-500/30' : 'bg-slate-800 hover:bg-blue-500/20'}
          `}
          onMouseDown={handleMouseDown}
        >
          {/* 拖动指示器 */}
          <div className={`
            w-1 h-20 rounded-full transition-all duration-200
            ${isDragging 
              ? 'bg-blue-400 shadow-lg shadow-blue-400/50' 
              : 'bg-slate-500 group-hover:bg-blue-300 group-hover:shadow-lg group-hover:shadow-blue-300/50'
            }
          `}>
            {/* 点状装饰 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 pointer-events-none">
              <div className={`w-1.5 h-1.5 rounded-full ${isDragging ? 'bg-white' : 'bg-slate-400 group-hover:bg-white'}`}></div>
              <div className={`w-1.5 h-1.5 rounded-full ${isDragging ? 'bg-white' : 'bg-slate-400 group-hover:bg-white'}`}></div>
              <div className={`w-1.5 h-1.5 rounded-full ${isDragging ? 'bg-white' : 'bg-slate-400 group-hover:bg-white'}`}></div>
            </div>
          </div>
          
          {/* 拖动图标 */}
          <div className={`
            absolute w-8 h-8 rounded-full flex items-center justify-center
            transition-all duration-200 border-2 pointer-events-none
            ${isDragging 
              ? 'bg-blue-500 text-white scale-110 border-blue-400 shadow-lg shadow-blue-500/50' 
              : 'bg-slate-700 text-slate-300 border-slate-600 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-400 group-hover:shadow-lg group-hover:shadow-blue-500/50'
            }
          `}>
            <GripVertical className="w-5 h-5" />
          </div>
        </div>

        {/* 输出区 */}
        <div 
          className="bg-slate-900 overflow-hidden"
          style={{ flexBasis: `${100 - splitPosition}%`, minWidth: '20%', maxWidth: '80%' }}
        >
          <div className="bg-slate-800/50 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-400">
              <Code className="w-4 h-4" />
              <span className="text-sm">输出结果</span>
            </div>
            {executionTime > 0 && (
              <span className="text-xs text-slate-500">⏱ {executionTime.toFixed(2)}s</span>
            )}
          </div>
          <div className="w-full h-[calc(100%-40px)] p-4 font-mono text-sm overflow-auto">
            {output && (
              <pre className="text-emerald-400 whitespace-pre-wrap">{output}</pre>
            )}
            {error && (
              <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>
            )}
            {!output && !error && (
              <span className="text-slate-500">点击"运行代码"按钮执行您的代码...</span>
            )}
          </div>
        </div>
      </div>

      {/* 拖动提示 */}
      {isDragging && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50">
          代码区: {Math.round(splitPosition)}% | 输出区: {Math.round(100 - splitPosition)}%
        </div>
      )}

      {showSolutionModal && solution && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="bg-slate-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">参考答案</h3>
                  <p className="text-slate-400 text-sm">点击关闭按钮或按 ESC 关闭</p>
                </div>
              </div>
              <button
                onClick={() => setShowSolutionModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-600/50 text-slate-400 hover:bg-slate-600 hover:text-white transition-colors flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-auto max-h-[65vh]">
              <pre className="text-emerald-400 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                {solution}
              </pre>
            </div>
            <div className="bg-slate-700 px-6 py-4 flex justify-end">
              <button
                onClick={() => setShowSolutionModal(false)}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all font-medium"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleCodeEditor;