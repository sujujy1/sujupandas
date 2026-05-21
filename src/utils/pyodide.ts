import { loadPyodide } from 'pyodide';

let pyodideInstance: any = null;
let initializationPromise: Promise<void> | null = null;

export async function initializePyodide(): Promise<void> {
  if (pyodideInstance) {
    return;
  }
  
  if (initializationPromise) {
    return initializationPromise;
  }
  
  initializationPromise = (async () => {
    try {
      console.log('Loading Pyodide...');
      pyodideInstance = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.29.3/full/',
      });
      
      console.log('Loading packages...');
      await pyodideInstance.loadPackage(['pandas', 'numpy', 'matplotlib']);
      console.log('Pyodide ready!');
    } catch (error) {
      console.error('Failed to initialize Pyodide:', error);
      throw error;
    }
  })();
  
  return initializationPromise;
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
    const result = await pyodideInstance.runPythonAsync(`
import sys
import io
import base64
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# Capture output
output_buffer = io.StringIO()
error_buffer = io.StringIO()
sys.stdout = output_buffer
sys.stderr = error_buffer

try:
    ${code.replace(/`/g, '\\`')}
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    import traceback
    traceback.print_exc()

# Get output
captured_output = output_buffer.getvalue()
captured_error = error_buffer.getvalue()

# Try to get plot
plot_data = ''
try:
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight')
    buf.seek(0)
    plot_data = base64.b64encode(buf.read()).decode('utf-8')
    plt.close('all')
except:
    pass

# Return results
{'output': captured_output, 'error': captured_error, 'plot': plot_data}
`);
    
    output = result.get('output', '');
    error = result.get('error', '');
    
    const plotData = result.get('plot', '');
    if (plotData && plotData.length > 0) {
      plots.push(plotData);
    }
    
  } catch (err: any) {
    error = `Execution error: ${err.message || String(err)}`;
    console.error('Python execution error:', err);
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
  ];
}
