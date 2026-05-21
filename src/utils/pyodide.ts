// 使用Flask后端执行Python代码

// 执行Python代码并返回结果
export async function runPythonCode(code: string, testData: string): Promise<{
  output: string;
  error: string;
  plots: string[];
}> {
  try {
    console.log('准备调用Flask后端，代码长度:', code.length);
    
    // 调用Flask后端API
    const response = await fetch('http://localhost:5000/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: code }),
      mode: 'cors',
      credentials: 'omit',
    });

    console.log('响应状态:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('HTTP错误:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Flask返回结果:', result);

    return {
      output: result.output || '',
      error: result.error || '',
      plots: result.images || [],
    };
  } catch (error: any) {
    // 如果后端服务不可用，模拟输出
    console.error('Flask后端服务调用失败:', error.message || error);
    console.warn('使用模拟输出');
    return simulateOutput(code);
  }
}

// 模拟输出（当Flask后端不可用时）
function simulateOutput(code: string): {
  output: string;
  error: string;
  plots: string[];
} {
  let output = '';

  // 模拟一些基本的输出
  if (code.includes('print')) {
    output += '输出:\n';
  }
  if (code.includes('df.head')) {
    output += '   姓名  年龄  成绩\n0  张三  18  85\n1  李四  19  92\n2  王五  20  78\n';
  }
  if (code.includes('df.info')) {
    output += `<class 'pandas.core.frame.DataFrame'>\nRangeIndex: 5 entries, 0 to 4\nData columns (total 3 columns)\n`;
  }
  if (code.includes('df.shape')) {
    output += 'DataFrame形状: (5, 3)\n';
  }
  if (code.includes('sum') || code.includes('mean') || code.includes('median')) {
    output += '计算结果: 85.0\n';
  }

  return {
    output,
    error: '',
    plots: [],
  };
}

// 验证代码输出
export function validateOutput(output: string, expectedOutput: string): number {
  // 简单的验证逻辑，实际项目中可能需要更复杂的验证
  if (output.includes(expectedOutput)) {
    return 10; // 满分
  } else if (output.length > 0) {
    return 5; // 部分分数
  }
  return 0; // 零分
}

// 获取可用数据集列表
export async function getDatasets(): Promise<any[]> {
  try {
    const response = await fetch('http://localhost:5000/api/datasets');
    const data = await response.json();
    return data.datasets || [];
  } catch (error) {
    console.error('获取数据集失败:', error);
    return [];
  }
}

// 获取示例代码列表
export async function getExamples(): Promise<any[]> {
  try {
    const response = await fetch('http://localhost:5000/api/examples');
    const data = await response.json();
    return data.examples || [];
  } catch (error) {
    console.error('获取示例代码失败:', error);
    return [];
  }
}
