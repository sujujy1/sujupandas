import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Trophy, Heart, Target, Zap } from 'lucide-react';

// 函数数据：函数名 + 正确含义
const FUNCTION_DATA: { name: string; desc: string }[] = [
  { name: 'pd.DataFrame()', desc: '创建二维表格数据结构' },
  { name: '.head()', desc: '查看数据前几行预览' },
  { name: '.info()', desc: '查看数据结构和类型信息' },
  { name: '.shape', desc: '查看数据行列数量' },
  { name: '.describe()', desc: '生成统计描述信息' },
  { name: '.dropna()', desc: '删除包含缺失值的行' },
  { name: '.fillna()', desc: '用指定值填充缺失数据' },
  { name: '.groupby()', desc: '按指定列进行分组' },
  { name: '.merge()', desc: '按关键字合并两个表' },
  { name: '.sort_values()', desc: '按指定列的值排序' },
  { name: 'pd.cut()', desc: '将数据分箱分段' },
  { name: '.rolling()', desc: '创建移动窗口计算' },
  { name: '.apply()', desc: '对数据应用自定义函数' },
  { name: '.pivot_table()', desc: '创建数据透视表' },
  { name: '.to_datetime()', desc: '转换为日期时间类型' },
  { name: '.value_counts()', desc: '统计每个值出现次数' },
];

interface Monster {
  id: number;
  x: number;
  y: number;
  funcIndex: number;
  speed: number;
  width: number;
  height: number;
}

interface Bullet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  funcIndex: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

const TowerGamePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [selectedFunc, setSelectedFunc] = useState<number | null>(null);
  const [showIntro, setShowIntro] = useState(true);

  const gameState = useRef({
    monsters: [] as Monster[],
    bullets: [] as Bullet[],
    particles: [] as Particle[],
    nextMonsterId: 0,
    nextBulletId: 0,
    spawnTimer: 0,
    animationId: 0,
    lastTime: 0,
    width: 900,
    height: 600,
  });

  const scoreRef = useRef(score);
  const livesRef = useRef(lives);
  const selectedRef = useRef(selectedFunc);
  const gameOverRef = useRef(gameOver);
  const mousePosRef = useRef({ x: 450, y: 300 });

  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { livesRef.current = lives; }, [lives]);
  useEffect(() => { selectedRef.current = selectedFunc; }, [selectedFunc]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);

  // 生成函数插槽的显示顺序（底部5个）
  const [slottedFuncs, setSlottedFuncs] = useState<number[]>([]);

  const pickNewSlotFunctions = useCallback(() => {
    const shuffled = [...FUNCTION_DATA.keys()].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }, []);

  useEffect(() => {
    setSlottedFuncs(pickNewSlotFunctions());
  }, [pickNewSlotFunctions]);

  // 粒子爆炸
  const spawnExplosion = (x: number, y: number, color: string, count: number = 15) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = 2 + Math.random() * 4;
      gameState.current.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color,
        size: 3 + Math.random() * 4,
      });
    }
  };

  // 生成怪物
  const spawnMonster = () => {
    const gs = gameState.current;
    const funcIndex = Math.floor(Math.random() * FUNCTION_DATA.length);
    const monster: Monster = {
      id: gs.nextMonsterId++,
      x: 50 + Math.random() * (gs.width - 100),
      y: -40,
      funcIndex,
      speed: 0.3 + Math.random() * 0.25,
      width: 120,
      height: 36,
    };
    gs.monsters.push(monster);
  };

  // 重置游戏
  const resetGame = () => {
    setScore(0);
    setLives(5);
    setGameOver(false);
    setSelectedFunc(null);
    gameState.current.monsters = [];
    gameState.current.bullets = [];
    gameState.current.particles = [];
    gameState.current.spawnTimer = 0;
    gameState.current.nextMonsterId = 0;
    gameState.current.nextBulletId = 0;
    setSlottedFuncs(pickNewSlotFunctions());
    setShowIntro(true);
  };

  // 绘制函数
  const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  // 绘制怪物
  const drawMonster = (ctx: CanvasRenderingContext2D, m: Monster) => {
    const funcName = FUNCTION_DATA[m.funcIndex].name;

    ctx.save();
    const bodyW = 90;
    const bodyH = 60;
    const bodyX = m.x + m.width / 2 - bodyW / 2;
    const bodyY = m.y;

    // 阴影
    ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
    drawRoundedRect(ctx, bodyX + 3, bodyY + 3, bodyW, bodyH, 12);
    ctx.fill();

    // 身体
    const gradient = ctx.createLinearGradient(bodyX, bodyY, bodyX, bodyY + bodyH);
    gradient.addColorStop(0, '#ef4444');
    gradient.addColorStop(1, '#b91c1c');
    ctx.fillStyle = gradient;
    drawRoundedRect(ctx, bodyX, bodyY, bodyW, bodyH, 12);
    ctx.fill();

    // 眼睛
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(bodyX + 25, bodyY + 22, 7, 0, Math.PI * 2);
    ctx.arc(bodyX + 65, bodyY + 22, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(bodyX + 25, bodyY + 22, 3, 0, Math.PI * 2);
    ctx.arc(bodyX + 65, bodyY + 22, 3, 0, Math.PI * 2);
    ctx.fill();

    // 嘴巴
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bodyX + 30, bodyY + 42);
    ctx.quadraticCurveTo(bodyX + 45, bodyY + 35, bodyX + 60, bodyY + 42);
    ctx.stroke();

    // 函数名标签
    const labelW = 130;
    const labelH = 28;
    const labelX = m.x + m.width / 2 - labelW / 2;
    const labelY = bodyY + bodyH + 4;

    ctx.fillStyle = '#fef3c7';
    drawRoundedRect(ctx, labelX, labelY, labelW, labelH, 8);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#92400e';
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(funcName, labelX + labelW / 2, labelY + labelH / 2);

    ctx.restore();
  };

  // 绘制炮塔/炮弹插槽
  const drawSlots = (ctx: CanvasRenderingContext2D) => {
    const gs = gameState.current;
    const slotGap = 20;
    const slotW = (gs.width - slotGap * 6) / 5;
    const slotH = 70;
    const slotY = gs.height - slotH - 20;

    slottedFuncs.forEach((funcIdx, i) => {
      const slotX = slotGap + i * (slotW + slotGap);
      const isSelected = selectedRef.current === i;

      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      drawRoundedRect(ctx, slotX + 3, slotY + 3, slotW, slotH, 12);
      ctx.fill();

      const grad = ctx.createLinearGradient(slotX, slotY, slotX, slotY + slotH);
      if (isSelected) {
        grad.addColorStop(0, '#34d399');
        grad.addColorStop(1, '#059669');
      } else {
        grad.addColorStop(0, '#60a5fa');
        grad.addColorStop(1, '#2563eb');
      }
      ctx.fillStyle = grad;
      drawRoundedRect(ctx, slotX, slotY, slotW, slotH, 12);
      ctx.fill();

      if (isSelected) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('📌 ' + FUNCTION_DATA[funcIdx].name, slotX + slotW / 2, slotY + 18);

      ctx.font = '11px sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      const desc = FUNCTION_DATA[funcIdx].desc;
      const charsPerLine = Math.floor((slotW - 16) / 10);
      let lineY = slotY + 38;
      for (let c = 0; c < desc.length; c += charsPerLine) {
        const line = desc.substring(c, c + charsPerLine);
        ctx.fillText(line, slotX + slotW / 2, lineY);
        lineY += 15;
      }

      if (isSelected) {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        const ax = slotX + slotW / 2;
        const ay = slotY - 8;
        ctx.moveTo(ax, ay);
        ctx.lineTo(ax - 10, ay - 12);
        ctx.lineTo(ax + 10, ay - 12);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    });

    // 炮塔塔尖
    if (selectedRef.current !== null) {
      const slotX = slotGap + selectedRef.current * (slotW + slotGap);
      ctx.save();
      ctx.fillStyle = '#fbbf24';
      drawRoundedRect(ctx, slotX + slotW / 2 - 15, slotY - 30, 30, 30, 8);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🎯', slotX + slotW / 2, slotY - 15);
      ctx.restore();
    }
  };

  // 绘制子弹
  const drawBullets = (ctx: CanvasRenderingContext2D, gs: typeof gameState.current) => {
    gs.bullets.forEach(b => {
      ctx.save();

      // 拖尾效果
      for (let i = 0; i < 5; i++) {
        const alpha = 0.3 - i * 0.06;
        ctx.fillStyle = `rgba(251, 191, 36, ${alpha})`;
        ctx.beginPath();
        ctx.arc(b.x - b.vx * i * 0.5, b.y - b.vy * i * 0.5, 8 - i, 0, Math.PI * 2);
        ctx.fill();
      }

      // 炮弹主体
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(b.x, b.y, 10, 0, Math.PI * 2);
      ctx.fill();

      // 发光效果
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  };

  // 主绘制循环
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gs = gameState.current;
    gs.width = canvas.width;
    gs.height = canvas.height;

    const loop = (time: number) => {
      if (gameOverRef.current) return;
      const delta = Math.min(time - gs.lastTime, 50);
      gs.lastTime = time;

      // 清屏 + 背景
      const bg = ctx.createLinearGradient(0, 0, 0, gs.height);
      bg.addColorStop(0, '#1e1b4b');
      bg.addColorStop(0.6, '#312e81');
      bg.addColorStop(1, '#4c1d95');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, gs.width, gs.height);

      // 星星背景
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      for (let i = 0; i < 40; i++) {
        const sx = (i * 137 + Math.floor(time / 100)) % gs.width;
        const sy = (i * 73) % (gs.height - 120);
        ctx.fillRect(sx, sy, 2, 2);
      }

      // 生成怪物
      gs.spawnTimer += delta;
      const spawnInterval = Math.max(1200, 2500 - Math.floor(scoreRef.current / 30) * 150);
      if (gs.spawnTimer > spawnInterval) {
        gs.spawnTimer = 0;
        spawnMonster();
      }

      // 更新怪物
      const bottomY = gs.height - 110;
      for (let i = gs.monsters.length - 1; i >= 0; i--) {
        const m = gs.monsters[i];
        m.y += m.speed * delta * 0.1;
        if (m.y > bottomY) {
          gs.monsters.splice(i, 1);
          spawnExplosion(m.x + m.width / 2, bottomY, '#ef4444', 25);
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setGameOver(true);
            }
            return newLives;
          });
        }
      }

      // 更新子弹（追踪鼠标）
      for (let i = gs.bullets.length - 1; i >= 0; i--) {
        const b = gs.bullets[i];

        // 追踪鼠标位置
        const targetX = mousePosRef.current.x;
        const targetY = mousePosRef.current.y;
        const dx = targetX - b.x;
        const dy = targetY - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 5) {
          const speed = 14;
          b.vx = (dx / dist) * speed;
          b.vy = (dy / dist) * speed;
        } else {
          b.vx *= 0.95;
          b.vy *= 0.95;
        }

        b.x += b.vx;
        b.y += b.vy;

        // 出界检查
        if (b.x < -50 || b.x > gs.width + 50 || b.y < -50 || b.y > gs.height + 50) {
          gs.bullets.splice(i, 1);
          continue;
        }

        // 碰撞检测
        let hit = false;
        for (let j = gs.monsters.length - 1; j >= 0; j--) {
          const m = gs.monsters[j];
          const mx = m.x + m.width / 2;
          const my = m.y + 30;
          const hitDx = b.x - mx;
          const hitDy = b.y - my;
          if (Math.sqrt(hitDx * hitDx + hitDy * hitDy) < 55) {
            hit = true;
            if (m.funcIndex === b.funcIndex) {
              spawnExplosion(mx, my, '#10b981', 20);
              gs.monsters.splice(j, 1);
              setScore(prev => prev + 10);
            } else {
              spawnExplosion(mx, my, '#f59e0b', 20);
              gs.monsters.splice(j, 1);
              setScore(prev => Math.max(0, prev - 5));
              setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) setGameOver(true);
                return newLives;
              });
            }
            break;
          }
        }
        if (hit) {
          gs.bullets.splice(i, 1);
        }
      }

      // 更新粒子
      for (let i = gs.particles.length - 1; i >= 0; i--) {
        const p = gs.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.life -= 0.025;
        if (p.life <= 0) gs.particles.splice(i, 1);
      }

      // 绘制粒子
      gs.particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 绘制怪物
      gs.monsters.forEach(m => drawMonster(ctx, m));

      // 绘制子弹
      drawBullets(ctx, gs);

      // 绘制插槽
      drawSlots(ctx);

      // 危险线
      ctx.save();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.setLineDash([10, 8]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, gs.height - 110);
      ctx.lineTo(gs.width, gs.height - 110);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // 鼠标位置指示器（选中炮塔后显示追踪光标）
      if (selectedRef.current !== null) {
        const mx = mousePosRef.current.x;
        const my = mousePosRef.current.y;
        ctx.save();
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(mx, my, 25, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      gs.animationId = requestAnimationFrame(loop);
    };

    gs.lastTime = performance.now();
    gs.animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(gs.animationId);
    };
  }, [slottedFuncs]);

  // 鼠标移动处理
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      mousePosRef.current = {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 点击处理
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameOverRef.current || showIntro) return;

    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const gs = gameState.current;
    const slotGap = 20;
    const slotW = (gs.width - slotGap * 6) / 5;
    const slotH = 70;
    const slotY = gs.height - slotH - 20;

    // 点击插槽发射炮弹
    for (let i = 0; i < 5; i++) {
      const slotX = slotGap + i * (slotW + slotGap);
      if (x >= slotX && x <= slotX + slotW && y >= slotY && y <= slotY + slotH) {
        setSelectedFunc(i);
        // 发射炮弹（初始向上发射）
        const funcIdx = slottedFuncs[i];
        gs.bullets.push({
          id: gs.nextBulletId++,
          x: slotX + slotW / 2,
          y: slotY - 10,
          vx: 0,
          vy: -14,
          funcIndex: funcIdx,
        });
        return;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 顶部导航 */}
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="flex items-center text-white/80 hover:text-white font-medium">
            <ArrowLeft className="w-5 h-5 mr-2" /> 返回首页
          </Link>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Zap className="w-7 h-7 mr-2 text-yellow-400" />
            Pandas 函数炮塔大挑战
          </h1>
          <div className="w-24" />
        </div>

        {/* 状态栏 */}
        <div className="flex items-center justify-between mb-4 bg-white/10 backdrop-blur rounded-xl px-6 py-3">
          <div className="flex items-center text-white">
            <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
            <span className="font-semibold">得分: {score}</span>
          </div>
          <div className="flex items-center text-white">
            <Heart className="w-5 h-5 mr-2 text-red-400" />
            <span className="font-semibold">生命: </span>
            {Array.from({ length: lives }).map((_, i) => (
              <span key={i} className="ml-1 text-red-400">❤️</span>
            ))}
            {lives === 0 && <span className="text-gray-500 ml-1">💔</span>}
          </div>
          <button
            onClick={resetGame}
            className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition font-medium"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> 重新开始
          </button>
        </div>

        {/* 游戏画布 */}
        <div className="relative bg-slate-800 rounded-2xl p-3 shadow-2xl border border-purple-500/30">
          <canvas
            ref={canvasRef}
            width={900}
            height={600}
            onClick={handleCanvasClick}
            className="w-full rounded-xl cursor-pointer bg-indigo-950"
            style={{ imageRendering: 'crisp-edges' }}
          />

          {/* 介绍遮罩 */}
          {showIntro && !gameOver && (
            <div className="absolute inset-0 bg-black/75 flex items-center justify-center rounded-2xl">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-2xl max-w-lg shadow-2xl text-white">
                <h2 className="text-3xl font-bold mb-4 flex items-center">
                  <Target className="w-8 h-8 mr-3 text-yellow-400" />
                  游戏规则
                </h2>
                <ul className="space-y-2 mb-6 text-lg">
                  <li>👹 怪物从上方入侵，每个怪物带着一个函数名</li>
                  <li>🎯 底部有 5 个炮塔，每个炮塔对应一个函数含义</li>
                  <li>📌 <b>点击炮塔</b>选中并发射炮弹（会变绿色 + 显示🎯）</li>
                  <li>🖱️ 发射后 <b>移动鼠标</b>控制炮弹追踪怪物</li>
                  <li>💥 如果炮弹打中的函数名和炮塔含义匹配就消灭它！</li>
                  <li>❤️ 错杀或怪物到达底部会扣生命值</li>
                  <li>🏆 消灭越多怪物，分数越高！</li>
                </ul>
                <button
                  onClick={() => setShowIntro(false)}
                  className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold rounded-xl text-lg transition-all hover:scale-105"
                >
                  🚀 开始挑战
                </button>
              </div>
            </div>
          )}

          {/* 游戏结束画面 */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-2xl">
              <div className="bg-gradient-to-br from-red-600 to-orange-600 p-10 rounded-2xl text-white text-center shadow-2xl">
                <div className="text-6xl mb-4">💀</div>
                <h2 className="text-4xl font-bold mb-4">游戏结束</h2>
                <p className="text-xl mb-2">最终得分</p>
                <p className="text-6xl font-bold mb-6 text-yellow-300">{score}</p>
                <p className="text-lg mb-6 opacity-90">
                  {score >= 100 ? '🏆 Pandas大师！' : score >= 50 ? '👍 不错的成绩！' : '💪 继续加油！'}
                </p>
                <button
                  onClick={resetGame}
                  className="px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold rounded-xl text-xl transition-all hover:scale-105"
                >
                  🔄 再来一局
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 说明 */}
        <div className="mt-4 text-center text-white/60 text-sm">
          💡 提示：点击炮塔发射 → 移动鼠标控制炮弹追踪怪物 → 匹配函数名和含义即可消灭
        </div>
      </div>
    </div>
  );
};

export default TowerGamePage;
