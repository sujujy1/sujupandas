#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Python在线代码编辑器 - Flask后端
支持数据分析、可视化和安全代码执行
"""

import os
import sys
import json
import subprocess
import tempfile
import shutil
import base64
import time
import re
import traceback
from pathlib import Path
from datetime import datetime
from functools import wraps

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import seaborn as sns

# 创建Flask应用
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

@app.after_request
def add_security_headers(response):
    response.headers['X-Frame-Options'] = 'ALLOWALL'
    response.headers['Content-Security-Policy'] = "frame-ancestors 'self' *"
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

# 配置
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 最大上传16MB
app.config['JSON_AS_ASCII'] = False  # 支持中文JSON

# 工作目录配置
WORKSPACE_DIR = Path(__file__).parent / 'user_workspace'
DATASET_DIR = Path(__file__).parent / 'datasets'
WORKSPACE_DIR.mkdir(exist_ok=True)
DATASET_DIR.mkdir(exist_ok=True)

# 执行超时时间（秒）
EXECUTION_TIMEOUT = 10

# 内存限制（MB）
MEMORY_LIMIT = 500

# 危险模块黑名单
DANGEROUS_MODULES = ['os', 'sys', 'subprocess', 'shutil', 'pty', 'signal', 'socket', 'pickle']

# 危险函数黑名单
DANGEROUS_FUNCTIONS = ['__import__', 'eval', 'exec', 'compile', 'open', 'input']


def prepare_datasets():
    """
    准备内置数据集
    从seaborn加载iris, titanic, tips数据集并保存为CSV
    """
    datasets = {
        'iris': sns.load_dataset('iris'),
        'titanic': sns.load_dataset('titanic'),
        'tips': sns.load_dataset('tips')
    }
    
    for name, df in datasets.items():
        csv_path = DATASET_DIR / f'{name}.csv'
        if not csv_path.exists():
            df.to_csv(csv_path, index=False)
            print(f"已创建数据集: {name}.csv")


def check_dangerous_code(code: str) -> str:
    """
    检查代码中是否包含危险操作
    
    Args:
        code: 用户提交的Python代码
        
    Returns:
        错误信息，如果没有危险代码则返回空字符串
    """
    # 检查危险模块导入
    for module in DANGEROUS_MODULES:
        # 检查 import xxx
        if re.search(rf'\bimport\s+{module}\b', code):
            return f"安全警告：禁止导入 '{module}' 模块"
        # 检查 from xxx import
        if re.search(rf'\bfrom\s+{module}\b', code):
            return f"安全警告：禁止从 '{module}' 模块导入"
    
    # 检查危险函数
    for func in DANGEROUS_FUNCTIONS:
        if re.search(rf'\b{func}\s*\(', code):
            return f"安全警告：禁止使用 '{func}()' 函数"
    
    # 检查文件写入操作
    if re.search(r'\.write\s*\(', code) and 'plt.savefig' not in code:
        return "安全警告：禁止文件写入操作"
    
    # 检查系统命令执行
    if re.search(r'\.system\s*\(', code):
        return "安全警告：禁止执行系统命令"
    
    return ""


def inject_imports(code: str) -> str:
    """
    在用户代码头部注入必要的导入语句
    
    Args:
        code: 用户提交的Python代码
        
    Returns:
        注入导入语句后的完整代码
    """
    imports = """# 自动注入的导入语句
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

"""
    return imports + code


def process_matplotlib_code(code: str) -> str:
    """
    处理matplotlib代码，将plt.show()替换为保存图片
    
    Args:
        code: 用户提交的Python代码
        
    Returns:
        处理后的代码
    """
    # 生成唯一的时间戳作为图片文件名
    timestamp = int(time.time() * 1000)
    
    # 替换plt.show()为保存图片
    if 'plt.show()' in code:
        save_code = f"""
# 自动保存图片
import os
for i, fignum in enumerate(plt.get_fignums()):
    plt.figure(fignum)
    plt.savefig('plot_{timestamp}_{i}.png', dpi=100, bbox_inches='tight')
    plt.close()
"""
        code = code.replace('plt.show()', save_code)
    
    return code


def execute_code(code: str) -> dict:
    """
    执行Python代码并返回结果
    
    Args:
        code: 用户提交的Python代码
        
    Returns:
        包含输出、错误、图片和执行时间的字典
    """
    start_time = time.time()
    
    # 创建临时工作目录
    temp_dir = tempfile.mkdtemp(dir=WORKSPACE_DIR)
    
    try:
        # 检查危险代码
        danger_msg = check_dangerous_code(code)
        if danger_msg:
            return {
                'output': '',
                'error': danger_msg,
                'images': [],
                'execution_time': time.time() - start_time
            }
        
        # 注入导入语句
        full_code = inject_imports(code)
        
        # 处理matplotlib代码
        full_code = process_matplotlib_code(full_code)
        
        # 复制数据集到工作目录
        for csv_file in DATASET_DIR.glob('*.csv'):
            shutil.copy(csv_file, temp_dir)
        
        # 创建Python脚本文件
        script_path = Path(temp_dir) / 'user_code.py'
        with open(script_path, 'w', encoding='utf-8') as f:
            f.write(full_code)
        
        # 执行代码
        try:
            # 设置资源限制
            result = subprocess.run(
                [sys.executable, str(script_path)],
                cwd=temp_dir,
                capture_output=True,
                text=True,
                timeout=EXECUTION_TIMEOUT,
                env={**os.environ, 'MALLOC_ARENA_MAX': '2'}  # 限制内存分配
            )
            
            output = result.stdout
            error = result.stderr
            
        except subprocess.TimeoutExpired:
            error = f"执行超时：代码执行时间超过{EXECUTION_TIMEOUT}秒"
            output = ""
        except MemoryError:
            error = f"内存不足：代码执行内存超过{MEMORY_LIMIT}MB"
            output = ""
        except Exception as e:
            error = f"执行错误：{str(e)}"
            output = ""
        
        # 收集生成的图片
        images = []
        for png_file in Path(temp_dir).glob('*.png'):
            try:
                with open(png_file, 'rb') as f:
                    img_data = base64.b64encode(f.read()).decode('utf-8')
                    images.append(img_data)
            except Exception as e:
                print(f"读取图片失败: {e}")
        
        execution_time = time.time() - start_time
        
        return {
            'output': output,
            'error': error,
            'images': images,
            'execution_time': round(execution_time, 3)
        }
        
    except Exception as e:
        return {
            'output': '',
            'error': f'服务器错误: {str(e)}',
            'images': [],
            'execution_time': time.time() - start_time
        }
    finally:
        # 清理临时目录
        try:
            shutil.rmtree(temp_dir)
        except Exception as e:
            print(f"清理临时目录失败: {e}")


# ==================== 路由定义 ====================

@app.route('/')
def index():
    """返回编辑器主页面"""
    return render_template('index.html')


@app.route('/run', methods=['POST'])
def run_code():
    """
    执行Python代码
    
    请求:
        {"code": "用户代码"}
        
    响应:
        {"output": "标准输出", "error": "错误信息", "images": ["base64图片"], "execution_time": 耗时秒数}
    """
    try:
        data = request.get_json()
        
        if not data or 'code' not in data:
            return jsonify({
                'output': '',
                'error': '错误：未提供代码',
                'images': [],
                'execution_time': 0
            })
        
        code = data['code']
        
        if not code.strip():
            return jsonify({
                'output': '',
                'error': '错误：代码为空',
                'images': [],
                'execution_time': 0
            })
        
        # 执行代码
        result = execute_code(code)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'output': '',
            'error': f'服务器错误: {str(e)}',
            'images': [],
            'execution_time': 0
        })


@app.route('/api/datasets')
def get_datasets():
    """返回可用数据集列表"""
    datasets = []
    for csv_file in DATASET_DIR.glob('*.csv'):
        name = csv_file.stem
        df = pd.read_csv(csv_file)
        datasets.append({
            'name': name,
            'rows': len(df),
            'columns': len(df.columns),
            'size': f"{csv_file.stat().st_size / 1024:.1f}KB"
        })
    
    return jsonify({
        'datasets': datasets
    })


@app.route('/api/dataset/<name>')
def get_dataset(name):
    """返回数据集CSV内容"""
    csv_path = DATASET_DIR / f'{name}.csv'
    
    if not csv_path.exists():
        return jsonify({
            'error': f'数据集 {name} 不存在'
        }), 404
    
    try:
        df = pd.read_csv(csv_path)
        
        return jsonify({
            'name': name,
            'columns': list(df.columns),
            'data': df.head(100).to_dict('records'),
            'shape': list(df.shape)
        })
    except Exception as e:
        return jsonify({
            'error': f'读取数据集失败: {str(e)}'
        }), 500


@app.route('/api/examples')
def get_examples():
    """返回示例代码列表"""
    examples = [
        {
            'name': '数据探索',
            'description': '探索数据集的基本信息',
            'code': '''import pandas as pd
import numpy as np

# 使用上方"导入数据集"按钮加载iris.csv
df = pd.read_csv('iris.csv')

print("数据形状:", df.shape)
print("\\n数据类型:\\n", df.dtypes)
print("\\n统计描述:\\n", df.describe())
print("\\n缺失值:\\n", df.isnull().sum())
print("\\n前10行:\\n", df.head(10))'''
        },
        {
            'name': '分组分析',
            'description': '按组分析数据特征',
            'code': '''import pandas as pd

df = pd.read_csv('titanic.csv')

print("各舱位存活率:\\n", df.groupby('Pclass')['Survived'].mean())
print("\\n性别存活率:\\n", df.groupby('Sex')['Survived'].mean())
print("\\n年龄分布:\\n", df['Age'].describe())

age_survived = df.groupby(pd.cut(df['Age'], bins=[0,18,35,50,100]))['Survived'].mean()
print("\\n各年龄段存活率:\\n", age_survived)'''
        },
        {
            'name': '数据可视化',
            'description': '创建多种图表展示数据',
            'code': '''import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('iris.csv')

fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# 萼片散点图
for species, color in zip(df['species'].unique(), ['red','blue','green']):
    d = df[df['species']==species]
    axes[0,0].scatter(d['sepal_length'], d['sepal_width'], c=color, label=species)
axes[0,0].set_xlabel('Sepal Length')
axes[0,0].set_ylabel('Sepal Width')
axes[0,0].legend()
axes[0,0].set_title('Sepal Analysis')

# 花瓣散点图
for species, color in zip(df['species'].unique(), ['red','blue','green']):
    d = df[df['species']==species]
    axes[0,1].scatter(d['petal_length'], d['petal_width'], c=color, label=species)
axes[0,1].set_xlabel('Petal Length')
axes[0,1].set_ylabel('Petal Width')
axes[0,1].legend()
axes[0,1].set_title('Petal Analysis')

# 物种分布
df['species'].value_counts().plot(kind='bar', ax=axes[1,0])
axes[1,0].set_title('Species Distribution')

# 直方图
df.hist(ax=axes[1,1])

plt.tight_layout()
plt.show()'''
        },
        {
            'name': '统计分析',
            'description': '使用seaborn进行统计分析',
            'code': '''import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

df = pd.read_csv('tips.csv')

print("小费数据集分析:\\n")
print("总账单统计:\\n", df['total_bill'].describe())
print("\\n小费比例:\\n", (df['tip']/df['total_bill']).describe())

fig, axes = plt.subplots(1, 3, figsize=(14, 4))

sns.boxplot(x='day', y='total_bill', data=df, ax=axes[0])
axes[0].set_title('账单分布')

sns.scatterplot(x='total_bill', y='tip', hue='sex', data=df, ax=axes[1])
axes[1].set_title('账单与小费关系')

sns.barplot(x='day', y='tip', hue='sex', data=df, ax=axes[2])
axes[2].set_title('每日小费统计')

plt.tight_layout()
plt.show()'''
        },
        {
            'name': '时间序列',
            'description': '创建和分析时间序列数据',
            'code': '''import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# 创建时间序列数据
dates = pd.date_range('2023-01-01', periods=365)
df = pd.DataFrame({
    'date': dates,
    'sales': np.random.randint(50, 200, 365) + np.sin(np.arange(365)*2*np.pi/365)*30,
    'customers': np.random.randint(10, 100, 365)
})
df.set_index('date', inplace=True)

print("时间序列数据:\\n", df.head(10))
print("\\n月度统计:\\n", df.resample('M').mean())

fig, ax1 = plt.subplots(figsize=(14, 5))

ax1.plot(df.index, df['sales'], 'b-', label='Sales')
ax1.set_xlabel('Date')
ax1.set_ylabel('Sales', color='b')
ax1.tick_params(axis='y', labelcolor='b')

ax2 = ax1.twinx()
ax2.plot(df.index, df['customers'], 'r-', label='Customers')
ax2.set_ylabel('Customers', color='r')
ax2.tick_params(axis='y', labelcolor='r')

plt.title('销售与客户趋势')
plt.show()'''
        }
    ]
    
    return jsonify({'examples': examples})


# ==================== 错误处理 ====================

@app.errorhandler(404)
def not_found(error):
    """404错误处理"""
    return jsonify({'error': '资源未找到'}), 404


@app.errorhandler(500)
def internal_error(error):
    """500错误处理"""
    return jsonify({'error': '服务器内部错误'}), 500


# ==================== 主程序入口 ====================

if __name__ == '__main__':
    print("=" * 50)
    print("Python在线代码编辑器")
    print("=" * 50)
    
    # 准备数据集
    print("\n正在准备数据集...")
    prepare_datasets()
    print("数据集准备完成！")
    
    # 启动Flask应用
    print("\n启动服务器...")
    print("访问地址: http://localhost:5000")
    print("按 Ctrl+C 停止服务器")
    print("=" * 50)
    
    app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False, threaded=True)
