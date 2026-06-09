import pandas as pd
import numpy as np

print("=" * 50)
print("Python数据分析示例脚本")
print("=" * 50)
print()

# 创建示例数据
data = {
    '姓名': ['张三', '李四', '王五', '赵六', '孙七', '周八'],
    '年龄': [20, 21, 22, 23, 21, 20],
    '专业': ['商务数据分析', '商务数据分析', '市场营销', '商务数据分析', '市场营销', '商务数据分析'],
    '成绩': [85, 90, 78, 92, 88, 76]
}

# 创建DataFrame
df = pd.DataFrame(data)
print("原始数据:")
print(df)
print()

# 基本统计信息
print("基本统计信息:")
print(df.describe())
print()

# 计算平均成绩
mean_score = df['成绩'].mean()
print(f"平均成绩: {mean_score:.2f}")
print()

# 添加等级列
df['等级'] = np.where(df['成绩'] >= 90, '优秀', np.where(df['成绩'] >= 80, '良好', '及格'))
print("添加等级后:")
print(df)
print()

# 按成绩排序
sorted_df = df.sort_values('成绩', ascending=False)
print("按成绩排序:")
print(sorted_df)
print()

# 分组统计
grouped = df.groupby('专业')['成绩'].agg(['mean', 'count'])
print("按专业分组统计:")
print(grouped)
print()

# 使用numpy创建数组
print("NumPy数组示例:")
arr = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print("3x3数组:")
print(arr)
print()

print(f"数组形状: {arr.shape}")
print(f"数组总和: {arr.sum()}")
print(f"每行均值: {arr.mean(axis=1)}")
print(f"每列均值: {arr.mean(axis=0)}")
print()

# 简单的数学运算
print("数学运算示例:")
x = np.linspace(0, 10, 5)
print(f"x = {x}")
print(f"sin(x) = {np.array2string(np.sin(x), precision=4)}")
print(f"exp(x) = {np.array2string(np.exp(x), precision=2)}")
print()

print("=" * 50)
print("示例运行完成！")
print("=" * 50)
