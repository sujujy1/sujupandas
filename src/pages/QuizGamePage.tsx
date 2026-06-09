import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Trophy, Star, Heart, Zap, Target, Flag, Clock,
  User, Bot, Gift, Sparkles, Rocket, Fish, Timer, Play, Pause,
  RotateCcw, Music, Volume2, VolumeX
} from 'lucide-react';
import { problems } from '../utils/problems';

type GameType =
  | 'wheel'
  | 'jump'
  | 'whack'
  | 'match'
  | 'bounce'
  | 'catch'
  | 'maze'
  | 'flip'
  | 'basket'
  | 'slice'
  | 'connect'
  | 'puzzle'
  | 'grab'
  | 'fish';

const gameTypes: Record<string, GameType> = {
  '1': 'wheel',
  '2': 'jump',
  '3': 'whack',
  '4': 'match',
  '5': 'bounce',
  '6': 'catch',
  '7': 'maze',
  '8': 'flip',
  '9': 'basket',
  '10': 'slice',
  '11': 'connect',
  '12': 'puzzle',
  '13': 'grab',
  '14': 'fish'
};

const gameNames: Record<GameType, string> = {
  'wheel': '幸运转盘',
  'jump': '跳跳答题',
  'whack': '打地鼠答题',
  'match': '消消乐答题',
  'bounce': '弹球答题',
  'catch': '接水果答题',
  'maze': '迷宫答题',
  'flip': '翻牌答题',
  'basket': '投篮答题',
  'slice': '切切答题',
  'connect': '连线答题',
  'puzzle': '拼图答题',
  'grab': '抓娃娃答题',
  'fish': '钓鱼答题'
};

const gameDescriptions: Record<GameType, string> = {
  'wheel': '转动转盘决定答题时间，在规定时间内完成答题！',
  'jump': '控制小人跳到正确答案的平台，答对才能继续前进！',
  'whack': '快速点击出现正确答案的地鼠，答错会扣时间！',
  'match': '消除显示正确答案的方块，答对才能消除！',
  'bounce': '发射弹球击中正确答案的目标！',
  'catch': '接住显示正确答案的水果，答对才能得分！',
  'maze': '选择正确答案的方向，走出迷宫到达终点！',
  'flip': '翻开卡片找到正确答案，答对才能继续翻！',
  'basket': '把球投进正确答案的篮筐，答对才能进球！',
  'slice': '切中显示正确答案的水果，答错会扣分！',
  'connect': '把问题和正确答案用线连接起来！',
  'puzzle': '拼出正确答案的图案，答对才能拼下一块！',
  'grab': '用爪子抓取正确答案的娃娃，答对才能抓到！',
  'fish': '钓到显示正确答案的鱼，答对才能钓上来！'
};

const QuizGamePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const problem = problems.find(p => p.id === id);
  const gameType = id ? gameTypes[id] : 'wheel';
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [gameState, setGameState] = useState<any>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [combo, setCombo] = useState(0);

  useEffect(() => {
    if (problem) {
      initGame(gameType);
    }
  }, [problem, gameType]);

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isTimerRunning, timeLeft]);

  const initGame = (type: GameType) => {
    switch(type) {
      case 'wheel':
        setGameState({ spinning: false, resultTime: 0, wheelAngle: 0, wheelSpinning: false });
        break;
      case 'jump':
        setGameState({ position: 0, platforms: 10, jumped: 0, isJumping: false, jumpHeight: 0 });
        break;
      case 'whack':
        setGameState({ molesWhacked: 0, totalMoles: 10, activeMole: null, hitEffects: [] });
        break;
      case 'match':
        setGameState({ matched: 0, totalBlocks: 10, grid: Array(10).fill(false), matchedBlocks: [] });
        break;
      case 'bounce':
        setGameState({ ballsThrown: 0, totalBalls: 10, hits: 0, ballInFlight: false, ballPosition: {x: 0, y: 0} });
        break;
      case 'catch':
        setGameState({ fruitsCaught: 0, totalFruits: 10, fallingFruit: null, caughtEffects: [] });
        break;
      case 'maze':
        setGameState({ position: { x: 0, y: 0 }, steps: 0, goal: { x: 3, y: 3 }, path: [] });
        break;
      case 'flip':
        setGameState({ flipped: 0, totalCards: 10, revealed: Array(10).fill(false), flipAnimations: [] });
        break;
      case 'basket':
        setGameState({ shotsMade: 0, totalShots: 10, shooting: false, ballPath: [] });
        break;
      case 'slice':
        setGameState({ sliced: 0, totalFruits: 10, slicingFruit: null, sliceEffects: [] });
        break;
      case 'connect':
        setGameState({ connected: 0, totalLines: 10, connections: [] });
        break;
      case 'puzzle':
        setGameState({ piecesPlaced: 0, totalPieces: 10, placedPieces: [] });
        break;
      case 'grab':
        setGameState({ grabbed: 0, totalDolls: 10, clawPosition: 0, grabbing: false });
        break;
      case 'fish':
        setGameState({ fishCaught: 0, totalFish: 10, fishing: false, fishOnLine: null });
        break;
    }
  };

  if (!problem || !problem.questions || problem.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">暂无测试题</h1>
          <p className="text-gray-600 mb-6">该项目暂未配置小游戏测试</p>
          <Link 
            to={`/problem/${id}`} 
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 inline-flex items-center"
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
      setCombo(prev => prev + 1);
      updateGameProgress(true);
    } else {
      setCombo(0);
      updateGameProgress(false);
    }
  };

  const updateGameProgress = (correct: boolean) => {
    setGameState(prev => {
      const newState = { ...prev };
      switch(gameType) {
        case 'wheel':
          break;
        case 'jump':
          if (correct) {
            newState.isJumping = true;
            setTimeout(() => {
              setGameState(s => ({ ...s, jumped: Math.min(s.jumped + 1, s.platforms), position: s.jumped + 1, isJumping: false }));
            }, 500);
          }
          break;
        case 'whack':
          if (correct) {
            newState.molesWhacked = Math.min(newState.molesWhacked + 1, newState.totalMoles);
            newState.hitEffects = [...(newState.hitEffects || []), newState.activeMole];
            setTimeout(() => {
              setGameState(s => ({ ...s, hitEffects: s.hitEffects.filter((h: number) => h !== newState.activeMole) }));
            }, 300);
          }
          newState.activeMole = null;
          break;
        case 'match':
          if (correct) {
            newState.matched = Math.min(newState.matched + 1, newState.totalBlocks);
            newState.grid = newState.grid.map((v: boolean, i: number) => i < newState.matched ? true : v);
            newState.matchedBlocks = [...(newState.matchedBlocks || []), newState.matched - 1];
            setTimeout(() => {
              setGameState(s => ({ ...s, matchedBlocks: s.matchedBlocks.filter((m: number) => m !== newState.matched - 1) }));
            }, 300);
          }
          break;
        case 'bounce':
          if (correct) {
            newState.hits = Math.min(newState.hits + 1, newState.totalBalls);
          }
          newState.ballsThrown = Math.min(newState.ballsThrown + 1, newState.totalBalls);
          newState.ballInFlight = true;
          setTimeout(() => {
            setGameState(s => ({ ...s, ballInFlight: false }));
          }, 500);
          break;
        case 'catch':
          if (correct) {
            newState.fruitsCaught = Math.min(newState.fruitsCaught + 1, newState.totalFruits);
            newState.caughtEffects = [...(newState.caughtEffects || []), newState.fruitsCaught - 1];
            setTimeout(() => {
              setGameState(s => ({ ...s, caughtEffects: s.caughtEffects.filter((c: number) => c !== newState.fruitsCaught - 1) }));
            }, 500);
          }
          newState.fallingFruit = null;
          break;
        case 'maze':
          if (correct) {
            newState.steps += 1;
            newState.path = [...(newState.path || []), { ...newState.position }];
            if (newState.position.x < newState.goal.x) newState.position.x += 1;
            else if (newState.position.y < newState.goal.y) newState.position.y += 1;
          }
          break;
        case 'flip':
          if (correct) {
            newState.flipped = Math.min(newState.flipped + 1, newState.totalCards);
            newState.revealed = newState.revealed.map((v: boolean, i: number) => i < newState.flipped ? true : v);
            newState.flipAnimations = [...(newState.flipAnimations || []), newState.flipped - 1];
            setTimeout(() => {
              setGameState(s => ({ ...s, flipAnimations: s.flipAnimations.filter((f: number) => f !== newState.flipped - 1) }));
            }, 300);
          }
          break;
        case 'basket':
          if (correct) {
            newState.shotsMade = Math.min(newState.shotsMade + 1, newState.totalShots);
          }
          newState.shooting = true;
          setTimeout(() => {
            setGameState(s => ({ ...s, shooting: false }));
          }, 500);
          break;
        case 'slice':
          if (correct) {
            newState.sliced = Math.min(newState.sliced + 1, newState.totalFruits);
            newState.sliceEffects = [...(newState.sliceEffects || []), newState.sliced - 1];
            setTimeout(() => {
              setGameState(s => ({ ...s, sliceEffects: s.sliceEffects.filter((s: number) => s !== newState.sliced - 1) }));
            }, 300);
          }
          break;
        case 'connect':
          if (correct) {
            newState.connected = Math.min(newState.connected + 1, newState.totalLines);
            newState.connections = [...(newState.connections || []), newState.connected - 1];
          }
          break;
        case 'puzzle':
          if (correct) {
            newState.piecesPlaced = Math.min(newState.piecesPlaced + 1, newState.totalPieces);
            newState.placedPieces = [...(newState.placedPieces || []), newState.piecesPlaced - 1];
          }
          break;
        case 'grab':
          if (correct) {
            newState.grabbed = Math.min(newState.grabbed + 1, newState.totalDolls);
          }
          newState.grabbing = true;
          setTimeout(() => {
            setGameState(s => ({ ...s, grabbing: false }));
          }, 500);
          break;
        case 'fish':
          if (correct) {
            newState.fishCaught = Math.min(newState.fishCaught + 1, newState.totalFish);
          }
          newState.fishing = true;
          setTimeout(() => {
            setGameState(s => ({ ...s, fishing: false, fishOnLine: null }));
          }, 500);
          break;
      }
      return newState;
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsTimerRunning(false);
      setTimeLeft(0);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setIsFinished(false);
    setIsTimerRunning(false);
    setTimeLeft(0);
    setCombo(0);
    initGame(gameType);
  };

  const spinWheel = () => {
    if (gameState.spinning) return;
    setGameState(prev => ({ ...prev, spinning: true, wheelSpinning: true }));
    
    setTimeout(() => {
      const times = [5, 10, 15, 20, 30, 45];
      const randomTime = times[Math.floor(Math.random() * times.length)];
      setGameState(prev => ({ ...prev, spinning: false, wheelSpinning: false, resultTime: randomTime }));
      setTimeLeft(randomTime);
      setIsTimerRunning(true);
    }, 3000);
  };

  const renderGame = () => {
    switch(gameType) {
      case 'wheel':
        return <WheelGame state={gameState} timeLeft={timeLeft} spinWheel={spinWheel} isTimerRunning={isTimerRunning} />;
      case 'jump':
        return <JumpGame state={gameState} />;
      case 'whack':
        return <WhackGame state={gameState} />;
      case 'match':
        return <MatchGame state={gameState} />;
      case 'bounce':
        return <BounceGame state={gameState} />;
      case 'catch':
        return <CatchGame state={gameState} />;
      case 'maze':
        return <MazeGame state={gameState} />;
      case 'flip':
        return <FlipGame state={gameState} />;
      case 'basket':
        return <BasketGame state={gameState} />;
      case 'slice':
        return <SliceGame state={gameState} />;
      case 'connect':
        return <ConnectGame state={gameState} />;
      case 'puzzle':
        return <PuzzleGame state={gameState} />;
      case 'grab':
        return <GrabGame state={gameState} />;
      case 'fish':
        return <FishGame state={gameState} />;
      default:
        return <WheelGame state={gameState} timeLeft={timeLeft} spinWheel={spinWheel} isTimerRunning={isTimerRunning} />;
    }
  };

  if (isFinished) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const grade = percentage >= 90 ? '🏆 优秀' : percentage >= 70 ? '🌟 良好' : percentage >= 60 ? '✅ 及格' : '💪 继续加油';
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link to={`/problem/${id}`} className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回项目
              </Link>
              <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {gameNames[gameType]} - 完成！
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl animate-bounce">
              <Trophy className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              太棒了！
            </h1>
            <p className="text-xl text-gray-600 mb-8">你已完成「{problem.title}」的{gameNames[gameType]}!</p>
            
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 mb-8">
              <div className="text-7xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {score}/{totalQuestions}
              </div>
              <div className="text-2xl font-semibold text-gray-700">{grade} ({percentage}%)</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRestart}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center text-lg font-semibold"
              >
                <RotateCcw className="w-6 h-6 mr-2" />
                再玩一次
              </button>
              <Link 
                to={`/problem/${id}`} 
                className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 inline-flex items-center justify-center text-lg font-semibold"
              >
                返回项目
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to={`/problem/${id}`} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回项目
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {gameNames[gameType]}
              </span>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-purple-700">{score}分</span>
              </div>
              {combo > 1 && (
                <div className="flex items-center space-x-1 bg-gradient-to-r from-orange-100 to-red-100 px-3 py-1 rounded-full animate-pulse">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span className="font-bold text-orange-600">{combo}连击!</span>
                </div>
              )}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {soundEnabled ? <Volume2 className="w-5 h-5 text-gray-600" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 text-center text-sm text-gray-500">
          {gameDescriptions[gameType]}
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="lg:order-1">
            {renderGame()}
          </div>

          <div className="lg:order-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
                    <p className="text-purple-100">第 {currentQuestionIndex + 1}/{totalQuestions} 题</p>
                  </div>
                  {gameType === 'wheel' && isTimerRunning && (
                    <div className={`flex items-center px-4 py-2 rounded-full ${timeLeft <= 5 ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`}>
                      <Clock className="w-5 h-5 text-white mr-2" />
                      <span className="text-white font-bold">{timeLeft}s</span>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-white to-purple-200 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mr-4">
                      <span className="text-2xl font-bold text-purple-600">{currentQuestionIndex + 1}</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">{currentQuestion.question}</h2>
                  </div>
                  
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                      let optionClass = "p-4 border-2 rounded-xl transition-all duration-200 cursor-pointer";
                      
                      if (showResult) {
                        if (index === currentQuestion.correctAnswer) {
                          optionClass += " border-green-500 bg-green-50 animate-pulse";
                        } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                          optionClass += " border-red-500 bg-red-50";
                        } else {
                          optionClass += " border-gray-200 bg-white opacity-50";
                        }
                      } else {
                        if (selectedAnswer === index) {
                          optionClass += " border-purple-500 bg-purple-50 scale-[1.02]";
                        } else {
                          optionClass += " border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50 hover:scale-[1.01]";
                        }
                      }
                      
                      return (
                        <div
                          key={index}
                          onClick={() => handleAnswer(index)}
                          className={optionClass}
                        >
                          <div className="flex items-center">
                            <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg mr-4 transition-all ${
                              showResult && index === currentQuestion.correctAnswer 
                                ? 'bg-green-500 text-white scale-110' 
                                : showResult && index === selectedAnswer && index !== currentQuestion.correctAnswer
                                ? 'bg-red-500 text-white'
                                : selectedAnswer === index
                                ? 'bg-purple-500 text-white scale-110'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span className="text-gray-700 text-lg">{option}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {showResult && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl animate-slideIn">
                      <div className="flex items-center mb-2">
                        <Sparkles className="w-5 h-5 text-yellow-600 mr-2" />
                        <span className="font-semibold text-yellow-800">小贴士</span>
                      </div>
                      <p className="text-yellow-700">{currentQuestion.explanation}</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNext}
                  disabled={!showResult}
                  className={`w-full py-4 rounded-xl text-lg font-bold transition-all duration-300 flex items-center justify-center ${
                    !showResult 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02]'
                  }`}
                >
                  {currentQuestionIndex < totalQuestions - 1 ? '下一题 →' : '完成游戏 🏆'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// ========== 14种交互小游戏组件 ==========

const WheelGame = ({ state, timeLeft, spinWheel, isTimerRunning }: { state: any; timeLeft: number; spinWheel: () => void; isTimerRunning: boolean }) => {
  const segments = ['5s', '10s', '15s', '20s', '30s', '45s'];
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <Target className="w-8 h-8 mr-2 text-orange-500" />
        幸运转盘
      </h3>
      
      <div className="relative w-64 h-64 mx-auto mb-6">
        {/* 转盘背景 */}
        <div 
          className={`absolute inset-0 rounded-full border-8 border-purple-300 shadow-xl ${state.wheelSpinning ? 'animate-spin-fast' : ''}`}
          style={{
            animationDuration: '3s',
            background: `conic-gradient(${colors.map((c, i) => `${c} ${i * 60}deg ${(i + 1) * 60}deg`).join(', ')})`
          }}
        >
          {/* 分割线 */}
          {segments.map((_, i) => (
            <div key={i} className="absolute top-1/2 left-1/2 w-1 h-32 bg-white/30 origin-left"
              style={{ transform: `rotate(${i * 60}deg) translateX(-50%)` }}
            />
          ))}
          {/* 数字标签 */}
          {segments.map((text, i) => {
            const angle = i * 60 + 30;
            const radius = 90;
            const x = 128 + radius * Math.cos((angle - 90) * Math.PI / 180);
            const y = 128 + radius * Math.sin((angle - 90) * Math.PI / 180);
            return (
              <div key={i} className="absolute font-bold text-white text-sm"
                style={{ left: x - 15, top: y - 10, transform: `rotate(${angle}deg)` }}>
                {text}
              </div>
            );
          })}
          {/* 中心点 */}
          <div className="absolute top-1/2 left-1/2 w-16 h-16 -mt-8 -ml-8 bg-white rounded-full shadow-lg flex items-center justify-center">
            <span className="text-2xl font-bold text-purple-600">🎯</span>
          </div>
        </div>
        
        {/* 指针 */}
        <div className="absolute top-0 left-1/2 -ml-4 w-8 h-12 bg-gradient-to-b from-red-500 to-red-600 rounded-b-full shadow-lg z-10"
          style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}
        >
          <div className="absolute -top-1 left-1/2 -ml-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
        </div>
      </div>
      
      {/* 时间显示 */}
      {state.resultTime > 0 && (
        <div className="text-center mb-4">
          <div className={`inline-flex items-center px-6 py-3 rounded-full transition-all duration-300 ${
            isTimerRunning 
              ? timeLeft <= 5 
                ? 'bg-red-100 text-red-600 animate-pulse scale-110' 
                : 'bg-green-100 text-green-600'
              : 'bg-green-100 text-green-600'
          }`}>
            <Clock className="w-6 h-6 mr-2" />
            <span className="text-2xl font-bold">{timeLeft}s</span>
          </div>
        </div>
      )}
      
      {/* 转盘按钮 */}
      {!isTimerRunning && state.resultTime === 0 && (
        <button
          onClick={spinWheel}
          disabled={state.spinning}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
        >
          {state.spinning ? (
            <>
              <div className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              转动中...
            </>
          ) : (
            <>🎡 转动转盘</>
          )}
        </button>
      )}
      
      <div className="text-center text-gray-600 mt-4">
        答题时间限制: {state.resultTime > 0 ? `${state.resultTime}秒` : '等待转盘'}
      </div>
    </div>
  );
};

const JumpGame = ({ state }: { state: any }) => {
  const platforms = Array.from({ length: state.platforms }, (_, i) => i);
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <Rocket className="w-8 h-8 mr-2 text-blue-500" />
        跳跳答题
      </h3>
      
      <div className="relative h-64 bg-gradient-to-b from-sky-200 via-sky-300 to-green-300 rounded-xl overflow-hidden">
        {/* 云朵 */}
        <div className="absolute top-4 left-8 w-16 h-8 bg-white rounded-full opacity-60" />
        <div className="absolute top-8 left-12 w-12 h-6 bg-white rounded-full opacity-60" />
        <div className="absolute top-6 right-12 w-20 h-10 bg-white rounded-full opacity-60" />
        
        {/* 平台 */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-around px-4">
          {platforms.map(i => (
            <div key={i} className="relative">
              {/* 平台 */}
              <div className={`w-16 h-4 rounded-t-lg transition-all duration-300 shadow-lg ${
                i < state.jumped 
                  ? 'bg-gradient-to-r from-green-400 to-green-500' 
                  : i === state.jumped 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 shadow-yellow-400/50' 
                  : 'bg-gradient-to-r from-gray-300 to-gray-400'
              }`}>
                {/* 小人 */}
                {i === state.position && (
                  <div className={`absolute -top-12 left-1/2 -ml-6 transition-all duration-500 ${
                    state.isJumping ? 'animate-jump' : ''
                  }`}>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-8 h-8 text-white" />
                    </div>
                  </div>
                )}
                {/* 完成标记 */}
                {i < state.jumped && (
                  <div className="absolute -top-8 left-1/2 -ml-4">
                    <Star className="w-8 h-8 text-yellow-500 animate-pulse" />
                  </div>
                )}
              </div>
              {/* 平台编号 */}
              <div className="text-center text-xs mt-1 text-gray-500 font-medium">{i + 1}</div>
            </div>
          ))}
        </div>
        
        {/* 终点旗帜 */}
        <div className="absolute top-4 right-4">
          <Flag className="w-10 h-10 text-red-500 animate-wave" />
        </div>
      </div>
      
      <div className="text-center text-gray-600 mt-4">
        <span className="text-lg font-bold text-purple-600">{state.jumped}</span> / {state.platforms} 平台 ✅
      </div>
    </div>
  );
};

const WhackGame = ({ state }: { state: any }) => {
  const holes = Array.from({ length: 9 }, (_, i) => i);
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <Target className="w-8 h-8 mr-2 text-amber-600" />
        打地鼠答题
      </h3>
      
      <div className="grid grid-cols-3 gap-4 bg-gradient-to-b from-green-300 to-green-400 rounded-xl p-4">
        {holes.map(i => {
          const isHit = state.hitEffects?.includes(i);
          return (
            <div key={i} className="relative">
              {/* 地洞 */}
              <div className="w-20 h-20 mx-auto bg-gradient-to-b from-amber-900 to-stone-900 rounded-full shadow-inner border-4 border-amber-800">
                {/* 地鼠 */}
                {i < state.molesWhacked ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Star className="w-10 h-10 text-yellow-500 animate-pulse" />
                  </div>
                ) : i === state.activeMole ? (
                  <div className={`absolute -top-6 inset-x-2 flex items-center justify-center transition-transform ${isHit ? 'animate-hit' : 'animate-pop-up'}`}>
                    <div className="w-14 h-14 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full flex items-center justify-center shadow-lg border-2 border-amber-800">
                      <span className="text-2xl">🐹</span>
                    </div>
                  </div>
                ) : null}
                {/* 击中特效 */}
                {isHit && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl animate-bounce">💥</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="text-center text-gray-600 mt-4">
        <span className="text-lg font-bold text-amber-600">{state.molesWhacked}</span> / {state.totalMoles} 地鼠 🎯
      </div>
    </div>
  );
};

const MatchGame = ({ state }: { state: any }) => {
  const blocks = Array.from({ length: state.totalBlocks }, (_, i) => i);
  const colors = ['bg-gradient-to-br from-red-400 to-red-600', 'bg-gradient-to-br from-blue-400 to-blue-600', 'bg-gradient-to-br from-green-400 to-green-600', 'bg-gradient-to-br from-yellow-400 to-yellow-600', 'bg-gradient-to-br from-purple-400 to-purple-600', 'bg-gradient-to-br from-pink-400 to-pink-600'];
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <Sparkles className="w-8 h-8 mr-2 text-purple-500" />
        消消乐答题
      </h3>
      
      <div className="grid grid-cols-5 gap-2 bg-gradient-to-b from-indigo-100 to-purple-100 rounded-xl p-4">
        {blocks.map(i => {
          const isMatched = state.matchedBlocks?.includes(i);
          return (
            <div 
              key={i} 
              className={`aspect-square rounded-lg transition-all duration-500 shadow-lg ${
                state.grid[i] 
                  ? isMatched 
                    ? 'bg-white scale-0 opacity-0 animate-pop-out' 
                    : 'bg-white opacity-0'
                  : `${colors[i % colors.length]} animate-pulse hover:scale-110`
              }`}
            >
              {!state.grid[i] && (
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg drop-shadow-lg">
                  {i + 1}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="text-center text-gray-600 mt-4">
        <span className="text-lg font-bold text-purple-600">{state.matched}</span> / {state.totalBlocks} 方块 ✨
      </div>
    </div>
  );
};

const BounceGame = ({ state }: { state: any }) => {
  const targets = Array.from({ length: state.totalBalls }, (_, i) => i);
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <Zap className="w-8 h-8 mr-2 text-yellow-500" />
        弹球答题
      </h3>
      
      <div className="relative h-64 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden">
        {/* 发射区 */}
        <div className="absolute bottom-4 left-4">
          <div className={`w-14 h-14 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-lg flex items-center justify-center transition-transform ${state.ballInFlight ? 'scale-90' : ''}`}>
            <span className="text-white text-xl">🔵</span>
          </div>
        </div>
        
        {/* 目标区 */}
        <div className="absolute top-4 right-4 grid grid-cols-5 gap-2">
          {targets.slice(0, 10).map(i => (
            <div key={i} className={`w-10 h-10 rounded-full transition-all duration-300 ${
              i < state.hits 
                ? 'bg-green-400 scale-0 opacity-0' 
                : 'bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-500/50 animate-pulse'
            }`}>
              {!(i < state.hits) && (
                <div className="w-full h-full flex items-center justify-center text-white text-sm">
                  🎯
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* 弹球轨迹 */}
        {state.ballInFlight && (
          <div className="absolute bottom-16 left-16 w-6 h-6 bg-blue-400 rounded-full animate-bounce"
            style={{ animation: 'ballFly 0.5s ease-out forwards' }}
          />
        )}
        
        {/* 击中特效 */}
        {state.ballInFlight && (
          <div className="absolute top-12 right-16">
            <span className="text-3xl animate-ping">💥</span>
          </div>
        )}
      </div>
      
      <div className="text-center text-gray-600 mt-4">
        <span className="text-lg font-bold text-blue-600">{state.hits}</span> / {state.totalBalls} 目标 🎱
      </div>
    </div>
  );
};

const CatchGame = ({ state }: { state: any }) => {
  const fruits = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🥝', '🍌', '🍒', '🫐'];
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <Gift className="w-8 h-8 mr-2 text-red-500" />
        接水果答题
      </h3>
      
      <div className="relative h-64 bg-gradient-to-b from-sky-200 via-sky-300 to-green-300 rounded-xl overflow-hidden">
        {/* 已接水果 */}
        <div className="absolute bottom-20 left-4 right-4 flex flex-wrap gap-2 justify-center">
          {Array.from({ length: state.fruitsCaught }, (_, i) => (
            <span key={i} className={`text-2xl transition-all ${state.caughtEffects?.includes(i) ? 'animate-bounce scale-125' : ''}`}>
              {fruits[i]}
            </span>
          ))}
        </div>
        
        {/* 接收篮 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <div className="w-32 h-16 bg-gradient-to-b from-amber-600 to-amber-800 rounded-b-xl flex items-end justify-center pb-2 shadow-lg">
            <span className="text-3xl">🧺</span>
          </div>
        </div>
        
        {/* 下落水果 */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          {state.fallingFruit !== null && state.fallingFruit < state.totalFruits && (
            <span className={`text-5xl transition-all duration-500 ${state.caughtEffects?.includes(state.fallingFruit) ? 'animate-pulse scale-0' : ''}`}>
              {fruits[state.fallingFruit]}
            </span>
          )}
        </div>
        
        {/* 接住特效 */}
        {state.caughtEffects?.length > 0 && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
            <span className="text-4xl animate-ping">✨</span>
          </div>
        )}
      </div>
      
      <div className="text-center text-gray-600 mt-4">
        <span className="text-lg font-bold text-red-500">{state.fruitsCaught}</span> / {state.totalFruits} 水果 🍎
      </div>
    </div>
  );
};

const MazeGame = ({ state }: { state: any }) => {
  const mazeSize = 4;
  const maze = Array.from({ length: mazeSize }, (_, y) => 
    Array.from({ length: mazeSize }, (_, x) => ({ x, y }))
  );
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <Flag className="w-8 h-8 mr-2 text-blue-500" />
        迷宫答题
      </h3>
      
      <div className="grid grid-cols-4 gap-1 bg-gray-800 rounded-xl p-2">
        {maze.flat().map((cell, i) => {
          const isPath = state.path?.some((p: {x: number, y: number}) => p.x === cell.x && p.y === cell.y);
          const isCurrent = cell.x === state.position.x && cell.y === state.position.y;
          const isGoal = cell.x === state.goal.x && cell.y === state.goal.y;
          
          return (
            <div key={i} className={`aspect-square rounded-lg transition-all duration-300 ${
              isCurrent
                ? 'bg-gradient-to-br from-yellow-400 to-orange-400 shadow-lg shadow-yellow-400/50'
                : isGoal
                ? 'bg-gradient-to-br from-green-400 to-emerald-400'
                : isPath
                ? 'bg-blue-300'
                : 'bg-gray-600'
            }`}>
              <div className="w-full h-full flex items-center justify-center">
                {isCurrent && (
                  <div className="animate-bounce">
                    <User className="w-6 h-6 text-gray-800" />
                  </div>
                )}
                {isGoal && (
                  <Flag className="w-6 h-6 text-white" />
                )}
                {isPath && !isCurrent && !isGoal && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="text-center text-gray-600 mt-4">
        <span className="text-lg font-bold text-blue-600">{state.steps}</span> 步 | 目标: 到达终点 🗺️
      </div>
    </div>
  );
};

const FlipGame = ({ state }: { state: any }) => {
  const cards = Array.from({ length: state.totalCards }, (_, i) => i);
  const symbols = ['♠', '♥', '♦', '♣', '★', '◆', '●', '▲', '■', '✦'];
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <Gift className="w-8 h-8 mr-2 text-purple-500" />
        翻牌答题
      </h3>
      
      <div className="grid grid-cols-5 gap-2 bg-gradient-to-b from-purple-100 to-pink-100 rounded-xl p-4">
        {cards.map(i => {
          const isFlipping = state.flipAnimations?.includes(i);
          return (
            <div 
              key={i} 
              className={`aspect-square rounded-lg transition-all duration-500 ${
                state.revealed[i] 
                  ? isFlipping 
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400 rotate-y-180' 
                    : 'bg-gradient-to-r from-purple-400 to-pink-400'
                  : 'bg-gradient-to-r from-blue-400 to-indigo-400 hover:scale-105'
              }`}
            >
              <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl drop-shadow-lg">
                {state.revealed[i] ? symbols[i] : '❓'}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="text-center text-gray-600 mt-4">
        <span className="text-lg font-bold text-purple-600">{state.flipped}</span> / {state.totalCards} 卡片 🃏
      </div>
    </div>
  );
};

const BasketGame = ({ state }: { state: any }) => {
  const baskets = Array.from({ length: state.totalShots }, (_, i) => i);
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <Target className="w-8 h-8 mr-2 text-orange-500" />
        投篮答题
      </h3>
      
      <div className="relative h-64 bg-gradient-to-b from-orange-100 to-orange-200 rounded-xl overflow-hidden">
        {/* 篮筐 */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-4">
          {baskets.slice(0, 5).map(i => (
            <div key={i} className="relative">
              <div className={`w-14 h-14 rounded-full border-4 transition-all duration-300 ${
                i < state.shotsMade 
                  ? 'border-green-500 bg-green-200' 
                  : 'border-orange-500 bg-white'
              }`}>
                {/* 球网 */}
                <div className={`absolute inset-2 rounded-full border-2 border-dashed ${
                  i < state.shotsMade ? 'border-green-400' : 'border-orange-300'
                }`} />
                {i < state.shotsMade && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl">🏀</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* 投篮者 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <div className={`w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center transition-transform ${state.shooting ? 'scale-90' : ''}`}>
            <User className="w-10 h-10 text-white" />
          </div>
        </div>
        
        {/* 投篮轨迹 */}
        {state.shooting && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
            <span className="text-2xl" style={{ animation: 'shootBall 0.5s ease-out forwards' }}>🏀</span>
          </div>
        )}
        
        {/* 进球特效 */}
        {state.shooting && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2">
            <span className="text-3xl animate-ping">✨</span>
          </div>
        )}
      </div>
      
      <div className="text-center text-gray-600 mt-4">
        <span className="text-lg font-bold text-orange-600">{state.shotsMade}</span> / {state.totalShots} 进球 🏀
      </div>
    </div>
  );
};

const SliceGame = ({ state }: { state: any }) => {
  const fruits = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🥝', '🍌', '🍒', '🫐'];
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <Zap className="w-8 h-8 mr-2 text-red-500" />
        切切答题
      </h3>
      
      <div className="relative h-64 bg-gradient-to-b from-yellow-100 to-orange-100 rounded-xl overflow-hidden">
        {/* 已切水果 */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-1">
          {Array.from({ length: state.sliced }, (_, i) => (
            <span key={i} className={`text-xl ${state.sliceEffects?.includes(i) ? 'animate-pulse' : 'opacity-50'}`}>
              {fruits[i]}
            </span>
          ))}
        </div>
        
        {/* 待切水果 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {state.sliced < state.totalFruits && (
            <span className={`text-6xl transition-all ${state.sliceEffects?.includes(state.sliced) ? 'animate-spin scale-0' : 'animate-bounce'}`}>
              {fruits[state.sliced]}
            </span>
          )}
        </div>
        
        {/* 刀 */}
        <div className="absolute bottom-4 right-4">
          <span className={`text-4xl transition-transform ${state.sliceEffects?.length > 0 ? 'rotate-45' : ''}`}>🔪</span>
        </div>
        
        {/* 切割特效 */}
        {state.sliceEffects?.length > 0 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="text-4xl animate-ping">💫</span>
          </div>
        )}
      </div>
      
      <div className="text-center text-gray-600 mt-4">
        <span className="text-lg font-bold text-red-500">{state.sliced}</span> / {state.totalFruits} 水果 🍊
      </div>
    </div>
  );
};

const ConnectGame = ({ state }: { state: any }) => {
  const lines = Array.from({ length: state.totalLines }, (_, i) => i);
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <Target className="w-8 h-8 mr-2 text-blue-500" />
        连线答题
      </h3>
      
      <div className="relative h-64 bg-gradient-to-b from-blue-50 to-indigo-50 rounded-xl overflow-hidden">
        {/* 左侧问题点 */}
        <div className="absolute left-4 top-4 flex flex-col gap-4">
          {lines.slice(0, 5).map(i => (
            <div key={i} className={`w-10 h-10 rounded-full transition-all duration-300 ${
              i < state.connected 
                ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-400/50' 
                : 'bg-gradient-to-br from-blue-400 to-blue-600'
            }`}>
              <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                Q{i + 1}
              </div>
            </div>
          ))}
        </div>
        
        {/* 右侧答案点 */}
        <div className="absolute right-4 top-4 flex flex-col gap-4">
          {lines.slice(0, 5).map(i => (
            <div key={i} className={`w-10 h-10 rounded-full transition-all duration-300 ${
              i < state.connected 
                ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-400/50' 
                : 'bg-gradient-to-br from-purple-400 to-purple-600'
            }`}>
              <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                A{i + 1}
              </div>
            </div>
          ))}
        </div>
        
        {/* 连线 */}
        {Array.from({ length: state.connected }, (_, i) => (
          <div 
            key={i} 
            className="absolute h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-lg"
            style={{ 
              top: `${8 + i * 40}px`, 
              left: '60px',
              right: '60px',
              animation: 'drawLine 0.5s ease-out forwards'
            }}
          />
        ))}
        
        {/* 连线动画 */}
        {state.connections?.map((c: number) => (
          <div 
            key={c}
            className="absolute h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-lg animate-pulse"
            style={{ 
              top: `${8 + c * 40}px`, 
              left: '60px',
              right: '60px'
            }}
          />
        ))}
      </div>
      
      <div className="text-center text-gray-600 mt-4">
        <span className="text-lg font-bold text-blue-600">{state.connected}</span> / {state.totalLines} 连线 🔗
      </div>
    </div>
  );
};

const PuzzleGame = ({ state }: { state: any }) => {
  const pieces = Array.from({ length: state.totalPieces }, (_, i) => i);
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <Sparkles className="w-8 h-8 mr-2 text-yellow-500" />
        拼图答题
      </h3>
      
      <div className="grid grid-cols-5 gap-1 bg-gray-200 rounded-xl p-2">
        {pieces.map(i => {
          const isPlaced = state.placedPieces?.includes(i);
          return (
            <div 
              key={i} 
              className={`aspect-square rounded-lg transition-all duration-500 ${
                i < state.piecesPlaced 
                  ? isPlaced 
                    ? 'bg-gradient-to-br from-purple-400 to-pink-400 scale-110 shadow-lg' 
                    : 'bg-gradient-to-br from-purple-400 to-pink-400'
                  : 'bg-gray-300'
              }`}
            >
              <div className="w-full h-full flex items-center justify-center text-white font-bold">
                {i < state.piecesPlaced ? '✓' : ''}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="text-center text-gray-600 mt-4">
        <span className="text-lg font-bold text-purple-600">{state.piecesPlaced}</span> / {state.totalPieces} 拼图 🧩
      </div>
    </div>
  );
};

const GrabGame = ({ state }: { state: any }) => {
  const dolls = ['🧸', '🎀', '🎁', '🎪', '🎠', '🎡', '🎢', '🎯', '🎲', '🎮'];
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <Gift className="w-8 h-8 mr-2 text-pink-500" />
        抓娃娃答题
      </h3>
      
      <div className="relative h-64 bg-gradient-to-b from-pink-100 to-purple-100 rounded-xl overflow-hidden">
        {/* 抓取爪 */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <div className={`w-16 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-b-xl transition-all duration-300 ${state.grabbing ? 'translate-y-16' : ''}`}>
            <div className="flex justify-center">
              <div className="w-2 h-12 bg-gray-600 animate-bounce"></div>
            </div>
          </div>
        </div>
        
        {/* 娃娃展示柜 */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-around">
          {dolls.slice(0, 5).map((doll, i) => (
            <div key={i} className={`transition-all duration-300 ${
              i < state.grabbed ? 'opacity-0 scale-0' : ''
            }`}>
              <span className={`text-3xl ${state.grabbing && i === state.grabbed ? 'animate-bounce' : ''}`}>
                {doll}
              </span>
            </div>
          ))}
        </div>
        
        {/* 已抓娃娃 */}
        <div className="absolute top-20 right-4 flex flex-col gap-1">
          {Array.from({ length: state.grabbed }, (_, i) => (
            <span key={i} className="text-xl animate-pulse">
              {dolls[i]}
            </span>
          ))}
        </div>
        
        {/* 抓取特效 */}
        {state.grabbing && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2">
            <span className="text-4xl animate-ping">✨</span>
          </div>
        )}
      </div>
      
      <div className="text-center text-gray-600 mt-4">
        <span className="text-lg font-bold text-pink-600">{state.grabbed}</span> / {state.totalDolls} 娃娃 🧸
      </div>
    </div>
  );
};

const FishGame = ({ state }: { state: any }) => {
  const fishTypes = ['🐟', '🐠', '🐡', '🦈', '🐙', '🦑', '🦐', '🦞', '🦀', '🐬'];
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <Fish className="w-8 h-8 mr-2 text-blue-500" />
        钓鱼答题
      </h3>
      
      <div className="relative h-64 bg-gradient-to-b from-blue-200 via-blue-300 to-blue-400 rounded-xl overflow-hidden">
        {/* 水面 */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-blue-100 to-blue-200 opacity-50">
          {/* 水波 */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-wave" />
        </div>
        
        {/* 钓竿 */}
        <div className="absolute top-4 left-4">
          <div className="w-2 h-32 bg-gradient-to-b from-amber-600 to-amber-800">
            <div className="absolute bottom-0 left-0 w-8 h-8">
              <span className="text-xl">🎣</span>
            </div>
          </div>
        </div>
        
        {/* 鱼线 */}
        <div className={`absolute top-8 left-8 w-2 h-32 bg-gray-400 transition-all duration-500 ${state.fishing ? 'animate-swing' : ''}`} 
          style={{ transformOrigin: 'top' }}
        />
        
        {/* 水中的鱼 */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-around">
          {fishTypes.slice(0, 5).map((fish, i) => (
            <div key={i} className={`transition-all duration-300 ${
              i < state.fishCaught ? 'opacity-0 scale-0' : 'animate-pulse'
            }`}>
              <span className="text-3xl">{fish}</span>
            </div>
          ))}
        </div>
        
        {/* 已钓到的鱼 */}
        <div className="absolute top-20 right-4 flex flex-col gap-1">
          {Array.from({ length: state.fishCaught }, (_, i) => (
            <span key={i} className="text-xl animate-bounce">
              {fishTypes[i]}
            </span>
          ))}
        </div>
        
        {/* 上钩特效 */}
        {state.fishing && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
            <span className="text-3xl animate-ping">💦</span>
          </div>
        )}
      </div>
      
      <div className="text-center text-gray-600 mt-4">
        <span className="text-lg font-bold text-blue-600">{state.fishCaught}</span> / {state.totalFish} 鱼 🐟
      </div>
    </div>
  );
};

export default QuizGamePage;