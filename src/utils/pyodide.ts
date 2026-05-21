import { loadPyodide } from 'pyodide';

let pyodide: any = null;
let isLoading = false;

export async function initializePyodide(): Promise<void> {
  if (pyodide) return;
  if (isLoading) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return initializePyodide();
  }
  
  isLoading = true;
  try {
    console.log('正在加载 Pyodide...');
    pyodide = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.29.3/full/',
      stdout: (text: string) => console.log('Python stdout:', text),
      stderr: (text: string) => console.log('Python stderr:', text),
    });
    
    await pyodide.loadPackage(['pandas', 'numpy', 'matplotlib']);
    console.log('Pyodide 初始化完成！');
  } finally {
    isLoading = false;
  }
}

export async function runPythonCode(code: string, testData: string): Promise<{
  output: string;
  error: string;
  plots: string[];
}> {
  await initializePyodide();
  
  let output = '';
  let error = '';
  const plots: string[] = [];
  
  try {
    const capturedOutput: string[] = [];
    const capturedError: string[] = [];
    
    const setupCode = `
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io
import base64
import warnings
warnings.filterwarnings('ignore')

def display_plot():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight')
    buf.seek(0)
    img_data = base64.b64encode(buf.read()).decode('utf-8')
    plt.close('all')
    return img_data

def print(*args, sep=' ', end='\\n'):
    result = sep.join(str(arg) for arg in args) + end
    __pyodide_output_buffer__.append(result)

def sys_stdout_write(text):
    __pyodide_output_buffer__.append(text)

def sys_stderr_write(text):
    __pyodide_error_buffer__.append(text)
`;
    
    await pyodide.runPythonAsync(setupCode);
    
    pyodide.globals.set('__pyodide_output_buffer__', []);
    pyodide.globals.set('__pyodide_error_buffer__', []);
    
    pyodide.runPython(`
import sys
sys.stdout = type('Dummy', (), {'write': sys_stdout_write, 'flush': lambda: None})
sys.stderr = type('Dummy', (), {'write': sys_stderr_write, 'flush': lambda: None})
`);
    
    const fullCode = setupCode + '\n' + code;
    
    await pyodide.runPythonAsync(fullCode);
    
    output = pyodide.globals.get('__pyodide_output_buffer__').join('');
    error = pyodide.globals.get('__pyodide_error_buffer__').join('');
    
    try {
      const plotResult = await pyodide.runPythonAsync('display_plot()');
      if (plotResult && typeof plotResult === 'string' && plotResult.length > 0) {
        plots.push(plotResult);
      }
    } catch (plotErr) {
      console.log('No plot generated or plot error:', plotErr);
    }
    
  } catch (err: any) {
    error = err.message || String(err);
    console.error('Python执行错误:', error);
  }
  
  return { output, error, plots };
}

export function validateOutput(output: string, expectedOutput: string): number {
  if (output.includes(expectedOutput)) {
    return 10;
  } else if (output.length > 0) {
    return 5;
  }
  return 0;
}

export async function getDatasets(): Promise<any[]> {
  return [
    { name: 'iris', rows: 150, columns: 5, size: '4.1KB' },
    { name: 'titanic', rows: 891, columns: 15, size: '61.2KB' },
    { name: 'tips', rows: 244, columns: 7, size: '7.2KB' },
  ];
}

export async function getExamples(): Promise<any[]> {
  return [
    {
      name: '数据探索',
      description: '探索数据集的基本信息',
      code: `import pandas as pd

df = pd.read_csv('https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv')

print("数据形状:", df.shape)
print("\\n数据类型:\\n", df.dtypes)
print("\\n统计描述:\\n", df.describe())
print("\\n前5行:\\n", df.head())`,
    },
    {
      name: '分组分析',
      description: '按组分析数据特征',
      code: `import pandas as pd

df = pd.read_csv('https://raw.githubusercontent.com/mwaskom/seaborn-data/master/titanic.csv')

print("各舱位存活率:\\n", df.groupby('pclass')['survived'].mean())
print("\\n性别存活率:\\n", df.groupby('sex')['survived'].mean())`,
    },
    {
      name: '数据可视化',
      description: '创建图表展示数据',
      code: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv')

fig, axes = plt.subplots(1, 2, figsize=(12, 5))

df['sepal_length'].hist(ax=axes[0])
axes[0].set_title('Sepal Length Distribution')

df.plot(kind='scatter', x='sepal_length', y='sepal_width', ax=axes[1])
axes[1].set_title('Sepal Length vs Width')

plt.tight_layout()
plt.show()`,
    },
  ];
}