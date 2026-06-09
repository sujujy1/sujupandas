export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ProblemStep {
  step: number;
  title: string;
  description: string;
  code?: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  requirements: string;
  hints: string[];
  testData: string;
  expectedOutput: string;
  solution: string;
  steps?: ProblemStep[];
  learningContent?: {
    concept: string;
    explanation: string;
    keyPoints: string[];
    examples: string[];
  };
  funConcepts?: {
    title: string;
    emoji: string;
    explanation: string;
    example: string;
  }[];
  puzzlePieces?: {
    name: string;
    description: string;
  }[];
  questions?: Question[];
}

export interface CaseStudyStep {
  id: string;
  title: string;
  description: string;
  score: number;
  testData: string;
  expectedOutput: string;
  solution: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  steps: CaseStudyStep[];
}

export const problems: Problem[] = [
  {
    id: "11",
    title: "购物篮分析",
    difficulty: "medium",
    description: "通过分析顾客的购买行为，发现商品之间的关联关系。",
    requirements: "1. 加载购物篮数据\n2. 计算商品支持度\n3. 使用Apriori算法挖掘关联规则\n4. 分析商品之间的关联关系",
    hints: ["pd.read_csv()", "支持度", "置信度", "提升度"],
    testData: `{
      "订单ID": ["O1", "O1", "O1", "O2", "O2", "O3", "O3", "O4", "O4", "O4"],
      "商品": ["牛奶", "面包", "鸡蛋", "牛奶", "面包", "牛奶", "鸡蛋", "面包", "鸡蛋", "牛奶"]
    }`,
    expectedOutput: "商品关联规则分析结果",
    solution: `import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules

# 创建购物篮数据
data = {
    "订单ID": ["O1", "O1", "O1", "O2", "O2", "O3", "O3", "O4", "O4", "O4"],
    "商品": ["牛奶", "面包", "鸡蛋", "牛奶", "面包", "牛奶", "鸡蛋", "面包", "鸡蛋", "牛奶"]
}
df = pd.DataFrame(data)

# 创建购物篮矩阵
basket = df.groupby(['订单ID', '商品'])['商品'].count().unstack().fillna(0)
basket = basket.map(lambda x: 1 if x > 0 else 0)

print("购物篮矩阵:")
print(basket)

# 寻找频繁项集
print("")\nprint("频繁项集:")
frequent_itemsets = apriori(basket, min_support=0.5, use_colnames=True)
print(frequent_itemsets)

# 生成关联规则
print("")\nprint("关联规则:")
rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=0.7)
print(rules[['antecedents', 'consequents', 'support', 'confidence', 'lift']])`,
    learningContent: {
      concept: "购物篮分析",
      explanation: "购物篮分析通过分析顾客的购买行为，发现商品之间的关联关系。它是数据挖掘中的经典应用，广泛用于零售行业的商品推荐、促销策略制定和货架摆放优化。核心概念包括支持度、置信度和提升度，常用Apriori算法挖掘频繁项集和关联规则。",
      keyPoints: [
        "支持度(Support)：商品组合在所有交易中出现的频率，衡量商品组合的普遍性",
        "置信度(Confidence)：买了A后也买B的条件概率P(B|A)，衡量规则的可靠性",
        "提升度(Lift)：规则的有效性，Lift>1表示A和B正相关，Lift=1表示独立",
        "Apriori算法：先找频繁项集（支持度达标），再从中生成关联规则",
        "购物篮矩阵：0-1编码的商品购买情况，每行是一个订单",
        "频繁项集：支持度大于最小阈值的商品组合",
        "关联规则：形如A→B的规则，表示购买A的顾客很可能购买B",
        "前件(antecedent)：规则左边的商品集合，后件(consequent)：规则右边的商品"
      ],
      examples: [
        "创建购物篮矩阵：df.groupby(['订单','商品'])['商品'].count().unstack().fillna(0)",
        "转换为0-1编码：basket = basket.map(lambda x: 1 if x>0 else 0)",
        "找频繁项集：apriori(basket, min_support=0.5, use_colnames=True)",
        "生成规则：association_rules(frequent_itemsets, metric='confidence', min_threshold=0.7)",
        "筛选有效规则：rules[rules['lift'] > 1]",
        "按提升度排序：rules.sort_values('lift', ascending=False)",
        "查看关键指标：rules[['antecedents', 'consequents', 'support', 'confidence', 'lift']]"
      ]
    },
    questions: [
      { id: "q1", question: "购物篮分析中，支持度指的是?", options: ["商品组合出现的频率", "买了A后买B的概率", "规则的有效性", "商品价格"], correctAnswer: 0, explanation: "支持度是商品组合在所有订单中出现的频率。" },
      { id: "q2", question: "置信度大于1是否可能?", options: ["可能", "不可能", "取决于数据", "取决于算法"], correctAnswer: 1, explanation: "置信度是条件概率P(B|A)，概率值范围是0-1，不可能大于1。" },
      { id: "q3", question: "提升度在什么情况下规则有价值?", options: ["大于0", "大于1", "小于1", "等于1"], correctAnswer: 1, explanation: "提升度>1表示A和B正相关，规则有效；=1表示独立；<1表示负相关。" },
      { id: "q4", question: "Apriori算法的核心思想是?", options: ["先找频繁项集再生成规则", "直接生成所有规则", "随机搜索规则", "只找单商品"], correctAnswer: 0, explanation: "Apriori先找频繁出现的商品组合，再从中生成关联规则。" },
      { id: "q5", question: "购物篮矩阵通常是哪种编码?", options: ["0-1编码", "独热编码", "标签编码", "数值编码"], correctAnswer: 0, explanation: "购物篮矩阵是0-1编码，1表示购买了该商品，0表示未购买。" },
      { id: "q6", question: "关联规则A→B中的A称为?", options: ["后件", "前件", "支持项", "置信项"], correctAnswer: 1, explanation: "A是前件(antecedent)，B是后件(consequent)。" },
      { id: "q7", question: "min_support参数的作用是?", options: ["设置最小置信度", "设置最小支持度", "设置最小提升度", "设置最小规则数"], correctAnswer: 1, explanation: "min_support设置频繁项集的最小支持度阈值。" },
      { id: "q8", question: "如果买了牛奶的人80%都买了面包，这是指?", options: ["支持度80%", "置信度80%", "提升度80%", "概率80%"], correctAnswer: 1, explanation: "这是条件概率P(面包|牛奶)=80%，即置信度。" },
      { id: "q9", question: "购物篮分析的典型应用是?", options: ["商品推荐", "价格预测", "库存管理", "用户画像"], correctAnswer: 0, explanation: "最典型应用是根据购物篮关联进行商品推荐。" },
      { id: "q10", question: "提升度的计算公式是?", options: ["P(A∩B)", "P(B|A)", "P(A∩B)/(P(A)P(B))", "P(A|B)"], correctAnswer: 2, explanation: "提升度=支持度/(P(A)×P(B))，衡量A和B的关联强度。" }
    ],
    funConcepts: [
      {
        title: "什么是关联规则?",
        emoji: "🛒",
        explanation: "关联规则就像超市货架上的商品搭配。如果很多买牛奶的人同时也买面包，那就有一条规则：买牛奶 → 买面包。这条规则告诉我们这两个商品之间存在关联。",
        example: "就像快餐店发现：点汉堡的人80%也点了薯条，于是把汉堡和薯条做成套餐一起卖。"
      },
      {
        title: "支持度是什么?",
        emoji: "📊",
        explanation: "支持度衡量商品组合在所有订单中出现的频率。支持度越高，说明这个商品组合越普遍，越多人一起买。",
        example: "如果100个订单中有20个同时包含牛奶和面包，那么{牛奶,面包}的支持度就是20%。"
      },
      {
        title: "置信度是什么?",
        emoji: "🎯",
        explanation: "置信度回答这个问题：如果顾客买了A，有多大可能也买B？它是一个条件概率，衡量规则的可靠性。",
        example: "买牛奶的50个订单中，有40个也买了面包，那么规则牛奶→面包的置信度就是80%。"
      },
      {
        title: "提升度是什么?",
        emoji: "📈",
        explanation: "提升度衡量A和B之间的关联强度是否超过随机概率。提升度>1说明正相关，=1说明独立，<1说明负相关。",
        example: "如果买牛奶的人买面包的概率是80%，而所有顾客买面包的概率只有40%，提升度就是80%/40%=2，说明关联很强。"
      }
    ],
    puzzlePieces: [
      { name: "df.groupby().count().unstack()", description: "创建购物篮矩阵" },
      { name: ".map()", description: "对每个元素应用函数转换" },
      { name: ".columns.tolist()", description: "获取列名列表" },
      { name: ".sum() / len()", description: "计算商品支持度" },
      { name: "range(len(products))", description: "生成商品索引序列" },
      { name: "products[i]", description: "获取第i个商品名称" },
      { name: "basket[col]", description: "获取指定列的数据" },
      { name: "basket.columns", description: "查看购物篮矩阵所有列名" },
      { name: ".fillna(0)", description: "将缺失值填充为0" },
      { name: "f'{col}: {value}'", description: "格式化输出关联规则结果" }
    ]
  },
  {
    id: "12",
    title: "A/B测试分析",
    difficulty: "hard",
    description: "学习如何进行A/B测试分析，评估不同方案的效果差异。",
    requirements: "1. 加载A/B测试数据\n2. 计算两组的转化率\n3. 使用统计方法检验差异显著性\n4. 得出结论并提出建议",
    hints: ["转化率计算", "假设检验", "p值", "置信区间"],
    testData: `{
      "组别": ["A", "A", "A", "A", "A", "B", "B", "B", "B", "B"],
      "用户ID": ["U1", "U2", "U3", "U4", "U5", "U6", "U7", "U8", "U9", "U10"],
      "转化": [1, 0, 1, 0, 1, 1, 1, 1, 0, 1]
    }`,
    expectedOutput: "A/B测试分析结果和显著性检验",
    solution: `import pandas as pd
import numpy as np
from scipy.stats import chi2_contingency

# 创建A/B测试数据
data = {
    "组别": ["A", "A", "A", "A", "A", "B", "B", "B", "B", "B"],
    "用户ID": ["U1", "U2", "U3", "U4", "U5", "U6", "U7", "U8", "U9", "U10"],
    "转化": [1, 0, 1, 0, 1, 1, 1, 1, 0, 1]
}
df = pd.DataFrame(data)

# 计算各组转化率
print("各组转化率:")
conversion = df.groupby('组别')['转化'].agg(['sum', 'count'])
conversion['转化率'] = conversion['sum'] / conversion['count']
print(conversion)

# 创建列联表进行卡方检验
print("")\nprint("卡方检验:")
cross_tab = pd.crosstab(df['组别'], df['转化'])
print("列联表:")
print(cross_tab)

chi2, p_value, dof, expected = chi2_contingency(cross_tab)
print(f"卡方值: {chi2:.4f}")
print(f"p值: {p_value:.4f}")

# 结论
print("")\nprint("分析结论:")
if p_value < 0.05:
    print("两组转化率存在显著差异")
else:
    print("两组转化率无显著差异")`,
    learningContent: {
      concept: "A/B测试分析",
      explanation: "A/B测试通过对照实验比较两个版本的效果，是互联网产品优化的核心方法。核心是统计假设检验，判断观察到的差异是真实存在还是随机波动。常用指标包括转化率、p值、置信区间和统计功效。",
      keyPoints: [
        "原假设(H0)：两组无差异；备择假设(H1)：两组有差异",
        "p值<0.05通常认为差异统计显著，拒绝原假设",
        "卡方检验适合比较两组或多组的分类数据（如转化率）",
        "显著性水平α一般设为0.05，表示愿意接受的假阳性概率",
        "置信区间显示真实差异的可能范围，常用95%置信度",
        "统计功效(Power)：检测到真实差异的概率，通常需要达到80%以上",
        "第一类错误(Type I)：假阳性，原假设真但被拒绝",
        "第二类错误(Type II)：假阴性，原假设假但未被拒绝"
      ],
      examples: [
        "计算转化率：conversion = df.groupby('组')['转化'].agg(['sum','count']); conversion['率'] = conversion['sum']/conversion['count']",
        "创建列联表：cross_tab = pd.crosstab(df['组别'], df['转化'])",
        "卡方检验：chi2, p_value, dof, expected = chi2_contingency(cross_tab)",
        "结论判断：print('显著差异' if p_value < 0.05 else '无显著差异')",
        "计算相对提升：(b_conversion - a_conversion) / a_conversion",
        "可视化结果：使用柱状图展示两组转化率",
        "样本量计算：使用power analysis确定所需样本数"
      ]
    },
    questions: [
      { id: "q1", question: "A/B测试中，原假设通常是?", options: ["两组有差异", "两组无差异", "A组更好", "B组更好"], correctAnswer: 1, explanation: "原假设H0通常假设两组没有差异，我们尝试寻找证据拒绝它。" },
      { id: "q2", question: "通常认为统计显著的p值阈值是?", options: ["<0.01", "<0.05", "<0.1", "<0.5"], correctAnswer: 1, explanation: "p值<0.05是最常用的显著性水平。" },
      { id: "q3", question: "比较两组转化率，适合用哪种检验?", options: ["t检验", "卡方检验", "F检验", "相关分析"], correctAnswer: 1, explanation: "卡方检验适合分析两个分类变量的关联，如组别和是否转化。" },
      { id: "q4", question: "p值表示什么?", options: ["原假设正确的概率", "观察到的差异由随机造成的概率", "两组差异的大小", "实验的成功率"], correctAnswer: 1, explanation: "p值是在原假设成立时，观察到当前或更极端结果的概率。" },
      { id: "q5", question: "如果p值=0.03，我们可以?", options: ["接受原假设", "拒绝原假设", "无法判断", "接受备择假设"], correctAnswer: 1, explanation: "p<0.05，我们拒绝原假设，认为两组有显著差异。" },
      { id: "q6", question: "显著性水平α表示?", options: ["犯第一类错误的概率", "犯第二类错误的概率", "p值", "置信度"], correctAnswer: 0, explanation: "α是我们愿意承担的第一类错误(假阳性)的概率。" },
      { id: "q7", question: "第一类错误指的是?", options: ["真差异判断为无差异", "无差异判断为有差异", "计算错误", "样本不足"], correctAnswer: 1, explanation: "第一类错误是假阳性，即原假设真但被拒绝。" },
      { id: "q8", question: "95%置信区间表示?", options: ["95%的概率包含真实值", "真实值有95%在区间内", "95%的数据在此范围", "以上都不对"], correctAnswer: 0, explanation: "置信水平表示用此方法构造的区间会有95%的概率包含真实参数。" },
      { id: "q9", question: "A/B测试中，什么是转化率?", options: ["转化用户数/总用户数", "总用户数/转化用户数", "A组用户/B组用户", "转化金额/总金额"], correctAnswer: 0, explanation: "转化率=转化用户数/该组总用户数。" },
      { id: "q10", question: "列联表展示什么数据?", options: ["两个分类变量的交叉分布", "连续变量的分布", "时间序列数据", "回归结果"], correctAnswer: 0, explanation: "列联表展示两个分类变量各类别的频数分布。" }
    ],
    funConcepts: [
      {
        title: "实验组 vs 对照组",
        emoji: "🧪",
        explanation: "A/B测试就像两个班级：A班用旧方法（对照组），B班用新方法（实验组）。通过比较两个班的成绩差异，判断新方法是否真的有效。",
        example: "一个网站测试新的按钮颜色：一半用户看到蓝色（对照组），另一半看到橙色（实验组），比较哪个组的点击率更高。"
      },
      {
        title: "转化率是什么?",
        emoji: "✅",
        explanation: "转化率是完成目标行为的用户数除以总用户数。比如点击按钮的用户占比、购买商品的用户占比等。转化率越高说明效果越好。",
        example: "实验组100个用户中有20人购买，转化率就是20%；对照组100人中有15人购买，转化率是15%。"
      },
      {
        title: "卡方检验是什么?",
        emoji: "🔬",
        explanation: "卡方检验是一种统计方法，用来判断两个分类变量之间是否存在关联。在A/B测试中，它帮助我们判断两组转化率的差异是真实存在的还是偶然的。",
        example: "如果实验组转化率20%、对照组15%，卡方检验告诉我们：这个5%的差异是真的因为方案不同，还是只是运气。"
      },
      {
        title: "p值如何判断?",
        emoji: "⚖️",
        explanation: "p值告诉我们观察到的差异有多大可能是随机产生的。p值越小（通常<0.05），我们越有信心说差异是真实的，而不是巧合。",
        example: "如果p值=0.03，意思是：如果两个方案实际上一样，只有3%的概率会观察到这么大的差异。所以我们有97%的信心说方案确实不同。"
      }
    ],
    puzzlePieces: [
      { name: "pd.crosstab()", description: "创建列联表进行卡方检验" },
      { name: ".sum()", description: "计算各组转化总数" },
      { name: ".mean()", description: "计算各组转化率" },
      { name: "(a+b)/(c+d)", description: "计算合并转化率" },
      { name: "chi2_contingency()", description: "执行卡方检验获取统计量" },
      { name: "scipy.stats.chi2_contingency", description: "SciPy卡方检验函数" },
      { name: "stats.chi2_contingency", description: "返回卡方值和p值" },
      { name: "p_value < 0.05", description: "判断差异是否统计显著" }
    ]
  },
  {
    id: "13",
    title: "特征工程",
    difficulty: "hard",
    description: "学习特征工程的核心技术，提高机器学习模型的性能。",
    requirements: "1. 创建新特征\n2. 处理类别特征\n3. 特征缩放\n4. 特征选择",
    hints: ["特征创建", "独热编码", "标准化", "PCA"],
    testData: `{
      "年龄": [25, 30, 35, 40, 45, 50, 55, 60],
      "收入": [5000, 8000, 12000, 15000, 18000, 20000, 22000, 25000],
      "性别": ["男", "女", "男", "女", "男", "女", "男", "女"],
      "购买": [0, 1, 0, 1, 1, 1, 0, 1]
    }`,
    expectedOutput: "特征工程处理后的数据集",
    solution: `import pandas as pd
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.decomposition import PCA

# 创建数据
data = {
    "年龄": [25, 30, 35, 40, 45, 50, 55, 60],
    "收入": [5000, 8000, 12000, 15000, 18000, 20000, 22000, 25000],
    "性别": ["男", "女", "男", "女", "男", "女", "男", "女"],
    "购买": [0, 1, 0, 1, 1, 1, 0, 1]
}
df = pd.DataFrame(data)

print("原始数据:")
print(df)

# 创建新特征
df['收入/年龄'] = df['收入'] / df['年龄']
df['年龄段'] = pd.cut(df['年龄'], bins=[0, 30, 45, 60], labels=['青年', '中年', '老年'])
print("")\nprint("添加新特征后:")
print(df)

# 独热编码
df_encoded = pd.get_dummies(df, columns=['性别', '年龄段'])
print("")\nprint("独热编码后:")
print(df_encoded)

# 特征缩放
scaler = StandardScaler()
numerical_cols = ['年龄', '收入', '收入/年龄']
df_encoded[numerical_cols] = scaler.fit_transform(df_encoded[numerical_cols])
print("")\nprint("特征缩放后:")
print(df_encoded)

# PCA降维
print("")\nprint("PCA分析:")
features = df_encoded.drop('购买', axis=1)
pca = PCA(n_components=2)
principal_components = pca.fit_transform(features)
print(f"解释方差比: {pca.explained_variance_ratio_}")`,
    learningContent: {
      concept: "特征工程",
      explanation: "特征工程是从原始数据构造有效特征的过程，是机器学习中最重要的步骤之一，直接影响模型性能。包括特征创建、特征编码、特征缩放、特征选择和降维等步骤，需要结合领域知识和数据理解。",
      keyPoints: [
        "特征创建：基于业务知识生成新特征，如比率特征、聚合特征、时间特征",
        "独热编码：将类别特征转为多个0-1列，适合无序类别",
        "标签编码：将类别映射为整数，适合有序类别",
        "标准化(StandardScaler)：将数据缩放到均值为0、方差为1",
        "归一化(MinMaxScaler)：将数据缩放到[0,1]范围",
        "PCA：无监督降维方法，保留数据的主要方差",
        "特征选择：移除冗余或无用特征，常用方法有相关性分析、方差阈值、递归特征消除",
        "特征交叉：将多个特征组合产生新特征"
      ],
      examples: [
        "创建比率特征：df['收入/年龄'] = df['收入'] / df['年龄']",
        "创建分箱特征：df['年龄段'] = pd.cut(df['年龄'], bins=[0,30,45,60], labels=['青年','中年','老年'])",
        "独热编码：pd.get_dummies(df, columns=['性别', '年龄段'])",
        "标准化：scaler = StandardScaler(); df[['年龄', '收入']] = scaler.fit_transform(df[['年龄', '收入']])",
        "PCA降维：pca = PCA(n_components=2); principal_components = pca.fit_transform(features)",
        "特征选择：from sklearn.feature_selection import SelectKBest, f_regression",
        "特征交叉：df['性别_年龄'] = df['性别'] + '_' + df['年龄段']",
        "计算统计特征：df.groupby('用户')['消费'].agg(['mean', 'sum', 'count'])"
      ]
    },
    questions: [
      { id: "q1", question: "独热编码用于处理什么类型的特征?", options: ["数值特征", "类别特征", "时间特征", "文本特征"], correctAnswer: 1, explanation: "独热编码将类别特征转换为多个二值(0-1)列。" },
      { id: "q2", question: "为什么要做特征缩放?", options: ["加快模型收敛", "提高准确率", "减少过拟合", "增加特征"], correctAnswer: 0, explanation: "特征缩放使各特征尺度一致，可加快基于梯度的模型收敛。" },
      { id: "q3", question: "PCA的主要作用是?", options: ["特征创建", "特征降维", "特征编码", "特征选择"], correctAnswer: 1, explanation: "PCA是主成分分析，用于数据降维，同时保留大部分方差。" },
      { id: "q4", question: "标准化后数据的特征是?", options: ["均值0，方差1", "范围0-1", "范围-1到1", "均值不变"], correctAnswer: 0, explanation: "StandardScaler标准化后均值为0，标准差为1。" },
      { id: "q5", question: "如果类别只有两个值(如男女)，独热编码需要几列?", options: ["1列", "2列", "3列", "0列"], correctAnswer: 0, explanation: "二值特征只需一列即可，用0和1区分，避免多重共线性。" },
      { id: "q6", question: "解释方差比表示什么?", options: ["每个主成分保留的信息比例", "模型准确率", "特征重要性", "损失函数值"], correctAnswer: 0, explanation: "解释方差比显示每个主成分解释了原数据的多少方差。" },
      { id: "q7", question: "pd.cut()可以用于?", options: ["特征创建", "特征分箱", "特征编码", "特征缩放"], correctAnswer: 1, explanation: "pd.cut()将连续数值分为几个区间，进行分箱处理。" },
      { id: "q8", question: "特征工程的目标是?", options: ["让模型更容易学习", "增加数据量", "减少计算时间", "可视化数据"], correctAnswer: 0, explanation: "特征工程让数据更适合模型学习，提升性能。" },
      { id: "q9", question: "MinMaxScaler会将数据缩放到什么范围?", options: ["[-1, 1]", "[0, 1]", "[均值, 均值+标准差]", "[0, 100]"], correctAnswer: 1, explanation: "MinMaxScaler将数据缩放到[0,1]范围。" },
      { id: "q10", question: "以下哪个不是特征工程的步骤?", options: ["数据清洗", "特征选择", "模型训练", "特征创建"], correctAnswer: 2, explanation: "模型训练不是特征工程的一部分，是后续步骤。" }
    ],
    funConcepts: [
      {
        title: "什么是特征工程?",
        emoji: "🔧",
        explanation: "特征工程就是把原始数据变成模型能看懂的优质食材。就像厨师要把新鲜食材洗净、切好、调味，才能做出美味的菜肴。好的特征比复杂的模型更重要！",
        example: "从用户的购买记录中提取：总消费金额、平均消费、购买频次 — 这些就是从原始数据中创造出来的有用特征。"
      },
      {
        title: "独热编码 (One-Hot Encoding)",
        emoji: "🎨",
        explanation: "独热编码把类别数据转换成机器能理解的数字格式。每个类别变成一个独立的0/1列。红色/蓝色/绿色变成三列：[1,0,0]、[0,1,0]、[0,0,1]。",
        example: "性别列有'男'和'女'，独热编码后变成两列：性别_男和性别_女，每行只有一个是1，另一个是0。"
      },
      {
        title: "特征缩放 (Feature Scaling)",
        emoji: "📏",
        explanation: "特征缩放让不同特征站在同一起跑线上。想象比较身高和体重，身高是180cm，体重是70kg，单位不同没法直接比较，需要统一到相同尺度。",
        example: "标准化将数据缩放到均值为0、方差为1的范围，归一化将数据缩放到[0,1]之间，这样所有特征对模型的影响都公平。"
      },
      {
        title: "特征选择 (Feature Selection)",
        emoji: "🎯",
        explanation: "特征选择就是筛选出真正有用的特征，去掉噪音和冗余。就像考试复习时只看重点，不看无关内容，模型也只需要最相关的信息。",
        example: "预测房价时，房屋面积和房间数很重要，但房主的名字和血型就完全无关，可以删除。"
      }
    ],
    puzzlePieces: [
      { name: "df['new_col'] = ...", description: "创建新特征列" },
      { name: "pd.get_dummies()", description: "执行独热编码转换" },
      { name: "(df['x'] - df['x'].mean()) / df['x'].std()", description: "手动实现标准化" },
      { name: "StandardScaler()", description: "sklearn标准化缩放器" },
      { name: "MinMaxScaler()", description: "sklearn归一化缩放器" },
      { name: "df.corr()", description: "计算特征相关性矩阵" },
      { name: "df.drop(columns=...)", description: "删除不需要的特征列" },
      { name: "SelectKBest()", description: "选择K个最佳特征" }
    ]
  },
  {
    id: "14",
    title: "异常值检测",
    difficulty: "hard",
    description: "学习异常值检测的方法，保证数据质量。",
    requirements: "1. 使用IQR方法检测异常值\n2. 使用Z-score方法检测异常值\n3. 可视化异常值\n4. 处理异常值",
    hints: ["IQR方法", "Z-score", "箱线图", "异常值处理"],
    testData: `{
      "销售额": [100, 120, 110, 95, 105, 1000, 98, 102, 99, 101, 10000]
    }`,
    expectedOutput: "异常值检测结果和处理方案",
    solution: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# 创建数据
data = {"销售额": [100, 120, 110, 95, 105, 1000, 98, 102, 99, 101, 10000]}
df = pd.DataFrame(data)

print("原始数据:")
print(df)

# 方法1: IQR方法
print("")\nprint("IQR方法检测异常值:")
Q1 = df['销售额'].quantile(0.25)
Q3 = df['销售额'].quantile(0.75)
IQR = Q3 - Q1
lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

outliers_iqr = df[(df['销售额'] < lower_bound) | (df['销售额'] > upper_bound)]
print(f"IQR范围: [{lower_bound:.2f}, {upper_bound:.2f}]")
print("异常值:")
print(outliers_iqr)

# 方法2: Z-score方法
print("")\nprint("Z-score方法检测异常值:")
z_scores = (df['销售额'] - df['销售额'].mean()) / df['销售额'].std()
outliers_zscore = df[np.abs(z_scores) > 3]
print("Z-score异常值:")
print(outliers_zscore)

# 绘制箱线图
print("")\nprint("绘制箱线图...")
plt.figure(figsize=(10, 6))
plt.boxplot(df['销售额'])
plt.title('销售额箱线图')
plt.show()

# 处理异常值
print("")\nprint("处理异常值:")
df_clean = df[(df['销售额'] >= lower_bound) & (df['销售额'] <= upper_bound)]
print("处理后的数据:")
print(df_clean)`,
    learningContent: {
      concept: "异常值检测",
      explanation: "异常值是显著偏离其他观测值的数据点，可能由于数据录入错误、测量误差或真实的极端情况导致。异常值会严重影响统计分析结果和机器学习模型性能，因此检测和处理异常值是数据预处理的重要步骤。",
      keyPoints: [
        "IQR方法：Q1-1.5×IQR到Q3+1.5×IQR之外的数据视为异常值",
        "Z-score方法：|Z|>3通常视为异常值，适用于近似正态分布的数据",
        "箱线图：直观展示数据分布和异常值位置",
        "处理方式：删除、截断(winsorize)、用中位数填充、或单独分析",
        "分析异常值产生的原因很重要，决定处理策略",
        "对于偏态数据，IQR方法比Z-score更稳健",
        "可视化方法：箱线图、散点图、直方图",
        "统计方法：IQR、Z-score、DBSCAN聚类"
      ],
      examples: [
        "IQR计算：Q1 = df['列'].quantile(0.25); Q3 = df['列'].quantile(0.75); IQR = Q3 - Q1",
        "计算边界：lower = Q1 - 1.5 * IQR; upper = Q3 + 1.5 * IQR",
        "Z-score计算：z_scores = (df['列'] - df['列'].mean()) / df['列'].std()",
        "箱线图：plt.boxplot(df['列']); plt.title('数据箱线图'); plt.show()",
        "识别异常值：outliers = df[(df['列'] < lower) | (df['列'] > upper)]",
        "移除异常值：df_clean = df[(df['列'] >= lower) & (df['列'] <= upper)]",
        "截断处理：df['列'] = np.clip(df['列'], lower, upper)",
        "中位数填充：df['列'].fillna(df['列'].median())"
      ]
    },
    questions: [
      { id: "q1", question: "IQR指的是什么?", options: ["均值-中位数", "Q3-Q1", "最大值-最小值", "标准差"], correctAnswer: 1, explanation: "IQR是四分位距，等于上四分位数Q3减下四分位数Q1。" },
      { id: "q2", question: "用IQR方法，异常值的边界是?", options: ["Q1±1.5×IQR", "Q3±1.5×IQR", "[Q1-1.5×IQR, Q3+1.5×IQR]", "[mean±1.5×std]"], correctAnswer: 2, explanation: "IQR方法定义正常范围是Q1-1.5×IQR到Q3+1.5×IQR。" },
      { id: "q3", question: "Z-score衡量什么?", options: ["与中位数的距离", "与均值的标准差距离", "与最大值的距离", "分位数位置"], correctAnswer: 1, explanation: "Z-score=(x-μ)/σ，表示数据点离均值几个标准差。" },
      { id: "q4", question: "通常|Z-score|>多少视为异常?", options: ["1", "2", "3", "4"], correctAnswer: 2, explanation: "通常|Z|>3，即离均值3个标准差外，视为异常值。" },
      { id: "q5", question: "箱线图中，箱子代表什么?", options: ["全部数据", "Q1到Q3", "均值±标准差", "最小值到最大值"], correctAnswer: 1, explanation: "箱线图的箱子从Q1到Q3，中线是中位数。" },
      { id: "q6", question: "以下哪种不是异常值处理方式?", options: ["删除异常值", "用中位数填充", "忽略不管", "用异常值替换正常值"], correctAnswer: 3, explanation: "用异常值替换正常值不是正确的处理方式。" },
      { id: "q7", question: "为什么要检测异常值?", options: ["影响统计结果", "增加数据量", "让图表好看", "减少计算时间"], correctAnswer: 0, explanation: "异常值会影响均值、方差等统计量，甚至影响模型性能。" },
      { id: "q8", question: "如果数据是偏态分布，哪种方法更稳健?", options: ["Z-score", "IQR", "都一样", "都不适合"], correctAnswer: 1, explanation: "IQR基于分位数，不受极端值影响，比Z-score更稳健。" },
      { id: "q9", question: "箱线图中的须(whisker)延伸到哪里?", options: ["最小值和最大值", "1.5×IQR范围内的最远点", "±2标准差", "±3标准差"], correctAnswer: 1, explanation: "箱线图的须延伸到1.5×IQR内的最远数据点。" },
      { id: "q10", question: "发现异常值后首先应该做什么?", options: ["直接删除", "分析产生原因", "用均值填充", "用中位数填充"], correctAnswer: 1, explanation: "应先分析异常值的产生原因，再决定处理方式。" }
    ],
    funConcepts: [
      {
        title: "什么是异常值?",
        emoji: "⚠️",
        explanation: "异常值就像人群里的姚明或婴儿，身高和大多数人差别特别大。异常值可能是数据录入错误、测量误差，也可能是真实的特殊情况。它们会严重影响统计分析的结果。",
        example: "公司10个员工的月薪都是5000-8000元，但有一个人是100万元，这个100万就是异常值，会让平均工资变得很高，完全不能代表真实情况。"
      },
      {
        title: "IQR方法 (四分位距法)",
        emoji: "📦",
        explanation: "IQR方法就像划定一个正常范围：中间50%数据所在的范围宽度乘以1.5，向外延伸就是正常边界。超过这个边界的数据就被认为是异常值。",
        example: "成绩数据中，Q1=60分，Q3=90分，IQR=30分。下界=60-1.5×30=15分，上界=90+1.5×30=135分。0分和150分就是异常值。"
      },
      {
        title: "Z-score方法",
        emoji: "🎯",
        explanation: "Z-score告诉我们一个数据点离平均值有多远，用标准差来衡量。通常|Z|>3意味着数据点离均值超过3个标准差，这在正态分布中是非常罕见的（概率<0.3%）。",
        example: "班级平均身高165cm，标准差10cm。一个学生身高200cm，Z=(200-165)/10=3.5，|Z|>3，是异常高的身高。"
      },
      {
        title: "箱线图怎么看?",
        emoji: "📊",
        explanation: "箱线图用图形直观展示数据分布和异常值。箱子的上边缘是Q3，下边缘是Q1，中间的线是中位数。箱子外的小圆圈或小点就是异常值，一眼就能看到。",
        example: "画一张家庭收入的箱线图，你会发现箱子集中在5-20万，而箱子上方有几个孤独的点，那就是高收入的异常值。"
      }
    ],
    puzzlePieces: [
      { name: "df.quantile(0.75)", description: "计算上四分位数Q3" },
      { name: "df.quantile(0.25)", description: "计算下四分位数Q1" },
      { name: "IQR = Q3 - Q1", description: "计算四分位距IQR" },
      { name: "(df['x'] < (Q1 - 1.5*IQR))", description: "识别下界异常值" },
      { name: "(df['x'] > (Q3 + 1.5*IQR))", description: "识别上界异常值" },
      { name: "(df['x'] - mean) / std", description: "手动计算Z-score" },
      { name: "np.abs(z) > 3", description: "筛选Z-score绝对值大于3的异常值" },
      { name: "df.drop()", description: "删除识别出的异常值行" }
    ]
  },
  {
    id: "1",
    title: "创建DataFrame并查看基本信息",
    difficulty: "easy",
    description: "创建一个包含学生信息的DataFrame，并查看其基本信息。",
    requirements: "1. 创建一个包含姓名、年龄、成绩的DataFrame\n2. 显示前5行数据\n3. 显示DataFrame的基本信息\n4. 显示DataFrame的形状",
    hints: ["pd.DataFrame()", ".head()", ".info()", ".shape"],
    testData: `{
      "姓名": ["张三", "李四", "王五", "赵六", "钱七"],
      "年龄": [18, 19, 20, 19, 18],
      "成绩": [85, 92, 78, 88, 90]
    }`,
    expectedOutput: "DataFrame形状: (5, 3)",
    solution: `import pandas as pd
data = {"姓名": ["张三", "李四", "王五", "赵六", "钱七"], "年龄": [18, 19, 20, 19, 18], "成绩": [85, 92, 78, 88, 90]}
df = pd.DataFrame(data)
print("数据预览:")
print(df.head())
print("数据形状:", df.shape)`,
    learningContent: {
      concept: "DataFrame基础概念",
      explanation: "DataFrame是Pandas中最核心的数据结构，可以理解为一个表格型的数据结构，类似于Excel表格或SQL表。它由行和列组成，每列可以是不同的数据类型（数值、字符串、布尔值等）。DataFrame是数据分析的基础，几乎所有的Pandas操作都围绕DataFrame展开。",
      keyPoints: [
        "DataFrame是二维表格数据结构，由行（索引）和列组成",
        "每列可以是不同的数据类型：整数、浮点数、字符串、日期时间等",
        "可以通过字典、列表、NumPy数组、CSV文件等多种方式创建",
        "支持通过标签和位置两种方式访问数据",
        "自动对齐索引，方便数据操作和分析",
        "支持向量化运算，性能优异",
        "可以方便地进行数据筛选、排序、分组、合并等操作"
      ],
      examples: [
        "创建DataFrame: df = pd.DataFrame({'列名': [值1, 值2, ...]})",
        "查看前5行: df.head()",
        "查看后5行: df.tail()",
        "查看数据信息: df.info()",
        "查看数据形状: df.shape",
        "查看列名: df.columns",
        "查看索引: df.index",
        "查看数据类型: df.dtypes",
        "查看统计摘要: df.describe()"
      ]
    },
    questions: [
      {
        id: "q1",
        question: "以下哪种方式可以创建一个DataFrame?",
        options: ["df = pd.DataFrame()", "df = pd.create()", "df = pd.Matrix()", "df = pd.Table()"],
        correctAnswer: 0,
        explanation: "使用pd.DataFrame()可以创建DataFrame。pd.create()、pd.Matrix()和pd.Table()都不是Pandas的有效方法。"
      },
      {
        id: "q2",
        question: "哪个方法可以查看DataFrame的前5行数据?",
        options: ["df.show()", "df.head()", "df.first()", "df.top()"],
        correctAnswer: 1,
        explanation: "df.head()默认显示前5行数据，可以传入参数指定行数，如df.head(10)显示前10行。"
      },
      {
        id: "q3",
        question: "df.shape返回的是什么?",
        options: ["数据类型", "(行数, 列数)", "列名列表", "数据摘要"],
        correctAnswer: 1,
        explanation: "df.shape返回一个元组，表示DataFrame的维度，格式为(行数, 列数)。"
      },
      {
        id: "q4",
        question: "哪个方法可以查看DataFrame的详细信息（包括数据类型和非空值数量）?",
        options: ["df.describe()", "df.info()", "df.summary()", "df.details()"],
        correctAnswer: 1,
        explanation: "df.info()显示DataFrame的详细信息，包括索引类型、列数、每列的数据类型和非空值数量。"
      },
      {
        id: "q5",
        question: "创建DataFrame时，以下哪种输入格式是正确的?",
        options: ["pd.DataFrame([1, 2, 3])", "pd.DataFrame({'a': [1, 2], 'b': [3, 4]})", "pd.DataFrame('a': 1, 'b': 2)", "pd.DataFrame(1, 2, 3)"],
        correctAnswer: 1,
        explanation: "使用字典创建DataFrame时，键是列名，值是列数据（列表或数组）。"
      },
      {
        id: "q6",
        question: "df.head(10)会显示多少行数据?",
        options: ["前5行", "前10行", "后10行", "随机10行"],
        correctAnswer: 1,
        explanation: "df.head(n)会显示前n行数据，df.head()默认显示前5行。"
      },
      {
        id: "q7",
        question: "以下哪个不是DataFrame的特点?",
        options: ["二维表格结构", "每列数据类型必须相同", "支持行和列索引", "可以包含不同类型的数据"],
        correctAnswer: 1,
        explanation: "DataFrame的每列数据类型可以不同，这是它的一个重要特点。"
      },
      {
        id: "q8",
        question: "如何查看DataFrame的列名?",
        options: ["df.columns", "df.names", "df.headers", "df.titles"],
        correctAnswer: 0,
        explanation: "df.columns返回DataFrame的列名列表。"
      },
      {
        id: "q9",
        question: "df.dtypes返回什么?",
        options: ["数据行数", "每列的数据类型", "数据摘要统计", "列名列表"],
        correctAnswer: 1,
        explanation: "df.dtypes返回每列的数据类型。"
      },
      {
        id: "q10",
        question: "创建一个3行2列的DataFrame，正确的方式是?",
        options: ["pd.DataFrame([[1,2], [3,4], [5,6]])", "pd.DataFrame([1,2,3], [4,5,6])", "pd.DataFrame(3, 2)", "pd.DataFrame('rows': 3, 'cols': 2)"],
        correctAnswer: 0,
        explanation: "使用二维列表可以创建DataFrame，外层列表的每个元素是一行数据。"
      }
    ],
    funConcepts: [
      {
        title: "什么是DataFrame?",
        emoji: "📊",
        explanation: "想象DataFrame是一张Excel表格，有行有列。行就像表格里的每一行数据，列就是每一列字段。每一行有不同的信息，比如姓名、年龄、成绩。",
        example: "就像班级成绩单：每一行是一个同学，每一列是姓名、年龄、成绩等信息。"
      },
      {
        title: "行和列的概念",
        emoji: "📋",
        explanation: "在DataFrame中，行是横向的每一条记录，列是纵向的每个字段。可以通过索引访问特定的行，通过列名访问特定的列。",
        example: "一张学生表格有5行3列，5行代表5个学生，3列代表姓名、年龄、成绩3个信息字段。"
      },
      {
        title: "索引 (Index)",
        emoji: "🔢",
        explanation: "索引是每行数据的门牌号，用来定位和识别数据。默认是0,1,2...的数字，也可以设置成姓名、日期等有意义的值。",
        example: "把学生的学号作为索引，就可以通过学号直接查找某个学生的所有信息，非常方便。"
      },
      {
        title: "数据类型 (dtypes)",
        emoji: "🏷️",
        explanation: "每一列都有自己的数据类型：整数(int)、浮点数(float)、字符串(object)、日期时间(datetime)等。了解数据类型有助于进行正确的计算和操作。",
        example: "成绩是数字类型(int/float)可以做加减运算，姓名是字符串类型(object)只能做文本处理。"
      }
    ],
    puzzlePieces: [
      { name: "pd.DataFrame()", description: "创建二维数据表" },
      { name: ".head()", description: "查看前几行数据" },
      { name: ".info()", description: "查看数据基本信息" },
      { name: ".shape", description: "查看数据行列数量" },
      { name: ".dtypes", description: "查看各列数据类型" },
      { name: ".describe()", description: "生成描述性统计信息" },
      { name: ".columns", description: "查看所有列名" },
      { name: ".index", description: "查看行索引信息" }
    ]
  },
  {
    id: "2",
    title: "数据筛选与条件过滤",
    difficulty: "easy",
    description: "根据条件筛选DataFrame中的数据。",
    requirements: "1. 筛选年龄大于18岁的学生\n2. 筛选成绩大于等于90分的学生\n3. 筛选年龄大于18岁且成绩大于等于85分的学生",
    hints: ["布尔索引", ".loc[]", "& 运算符", "| 运算符"],
    testData: `{
      "姓名": ["张三", "李四", "王五", "赵六", "钱七"],
      "年龄": [18, 19, 20, 19, 18],
      "成绩": [85, 92, 78, 88, 90]
    }`,
    expectedOutput: "年龄大于18岁且成绩大于等于85分的学生数量: 3",
    solution: `import pandas as pd
data = {"姓名": ["张三", "李四", "王五", "赵六", "钱七"], "年龄": [18, 19, 20, 19, 18], "成绩": [85, 92, 78, 88, 90]}
df = pd.DataFrame(data)
print("年龄>18:", df[df['年龄'] > 18])
print("成绩>=90:", df[df['成绩'] >= 90])
result = df[(df['年龄'] > 18) & (df['成绩'] >= 85)]
print("年龄>18且成绩>=85:", result)`,
    learningContent: {
      concept: "数据筛选与布尔索引",
      explanation: "数据筛选是数据分析中最常用的操作之一。在Pandas中，可以使用布尔索引来筛选满足特定条件的数据。布尔索引是指使用布尔值数组来选择DataFrame中的行或列。掌握数据筛选是进行数据探索和分析的基础技能。",
      keyPoints: [
        "布尔索引使用条件表达式返回布尔值数组，True表示选中，False表示排除",
        "多个条件需要用 & (与) 和 | (或) 连接，不能使用Python的and/or",
        "每个条件必须用括号单独包裹，否则会出现运算优先级问题",
        ".loc[] 可以同时选择行和列，是最常用的数据选择方法",
        ".iloc[] 按位置选择数据，使用整数索引",
        "字符串筛选可以使用 .str.contains() 方法",
        "缺失值筛选使用 .isnull() 和 .notnull()",
        "使用 .isin() 可以筛选在指定列表中的值"
      ],
      examples: [
        "单条件筛选: df[df['年龄'] > 18]",
        "多条件与: df[(df['年龄'] > 18) & (df['成绩'] >= 85)]",
        "多条件或: df[(df['成绩'] >= 90) | (df['成绩'] < 60)]",
        "使用loc选择行列: df.loc[df['年龄'] > 18, ['姓名', '成绩']]",
        "字符串包含: df[df['姓名'].str.contains('张')]",
        "缺失值筛选: df[df['成绩'].notnull()]",
        "列表匹配: df[df['班级'].isin(['一班', '二班'])]",
        "范围筛选: df[df['成绩'].between(80, 90)]"
      ]
    },
    questions: [
      { id: "q1", question: "筛选年龄大于18岁的数据，正确的写法是?", options: ["df['年龄'] > 18", "df[df['年龄'] > 18]", "df.filter('年龄' > 18)", "df.select('年龄' > 18)"], correctAnswer: 1, explanation: "使用布尔索引时，需要将条件放在方括号内，即 df[条件]。" },
      { id: "q2", question: "多个条件组合时，应该使用哪个运算符表示'与'?", options: ["&&", "||", "&", "and"], correctAnswer: 2, explanation: "在Pandas中，多个条件需要使用 & 表示'与'，使用 | 表示'或'。" },
      { id: "q3", question: "筛选成绩大于等于80且小于90的学生，正确的写法是?", options: ["df[(df['成绩'] >= 80) & (df['成绩'] < 90)]", "df[df['成绩'] >= 80 && df['成绩'] < 90]", "df[df['成绩'] between 80 and 90]", "df.filter('成绩' >= 80 and < 90)"], correctAnswer: 0, explanation: "多个条件需要用括号包裹，并用 & 连接。" },
      { id: "q4", question: ".loc[]方法可以用来做什么?", options: ["仅选择行", "仅选择列", "同时选择行和列", "排序数据"], correctAnswer: 2, explanation: ".loc[]可以同时指定行条件和列选择，格式为 df.loc[行条件, 列名]。" },
      { id: "q5", question: "筛选名字包含'张'的学生，正确的写法是?", options: ["df[df['姓名'] == '张']", "df[df['姓名'].str.contains('张')]", "df[df['姓名'].includes('张')]", "df.filter('姓名' contains '张')"], correctAnswer: 1, explanation: "使用 .str.contains() 方法可以筛选包含特定字符串的数据。" },
      { id: "q6", question: "以下哪个不是有效的筛选方式?", options: ["df[df['年龄'] != 18]", "df[df['成绩'].isin([85, 90, 95])]", "df[df['姓名'].notnull()]", "df[df['年龄'] = 18]"], correctAnswer: 3, explanation: "= 是赋值运算符，比较相等应该使用 ==。" },
      { id: "q7", question: "筛选非空值的行，正确的写法是?", options: ["df[df['列名'].notnull()]", "df[df['列名'] != None]", "df[!df['列名'].isnull()]", "以上都对"], correctAnswer: 0, explanation: "使用 .notnull() 方法可以筛选非空值。" },
      { id: "q8", question: "df.loc[df['成绩'] > 90, ['姓名', '成绩']] 会返回什么?", options: ["仅姓名列", "仅成绩列", "姓名和成绩列中成绩大于90的行", "所有数据"], correctAnswer: 2, explanation: ".loc[行条件, 列名] 会返回满足条件的指定列。" },
      { id: "q9", question: "筛选成绩在80到90之间(包含边界)，正确的写法是?", options: ["df[df['成绩'] >= 80 and df['成绩'] <= 90]", "df[(df['成绩'] >= 80) & (df['成绩'] <= 90)]", "df[df['成绩'].between(80, 90)]", "B和C都正确"], correctAnswer: 3, explanation: "可以使用 & 连接条件，也可以使用 .between() 方法。" },
      { id: "q10", question: "以下哪种方式可以筛选多个条件?", options: ["使用 & 和 |", "使用 .query()", "使用 .isin()", "以上都可以"], correctAnswer: 3, explanation: "Pandas提供多种方式进行多条件筛选，包括布尔索引、.query() 和 .isin()。" }
    ],
    funConcepts: [
      {
        title: "布尔索引 (Boolean Indexing)",
        emoji: "✅",
        explanation: "布尔索引就像给每行贴标签：满足条件贴True，不满足贴False。最后只保留True的那些行。这是DataFrame筛选数据最基本的方法。",
        example: "df[df['年龄'] > 18] — 先算出哪些学生年龄大于18（得到True/False序列），再用这个序列选出符合条件的学生。"
      },
      {
        title: "条件筛选",
        emoji: "🔍",
        explanation: "条件筛选就是从数据中挑出满足特定条件的记录。可以想象成一个过滤器：数据通过时，只有满足条件的记录才能留下来。",
        example: "从1000条订单记录中筛选出金额大于1000元的订单，或者只看北京地区的用户数据。"
      },
      {
        title: "多个条件组合",
        emoji: "🎭",
        explanation: "多个条件组合时，用 & 表示'与'（同时满足），用 | 表示'或'（满足其一）。每个条件必须用括号包裹，否则会因为运算优先级出错！",
        example: "df[(df['年龄'] > 18) & (df['成绩'] >= 85)] — 选出18岁以上且成绩85分以上的学生。注意括号不能少！"
      },
      {
        title: ".loc[] 选择器",
        emoji: "🎯",
        explanation: ".loc[] 是一个灵活的工具，可以同时指定行条件和列条件。格式是 df.loc[行条件, 列名]，就像一个精准的镊子，只夹取你想要的数据。",
        example: "df.loc[df['成绩'] > 90, ['姓名', '成绩']] — 只看成绩>90的学生，但只显示姓名和成绩两列。"
      }
    ],
    puzzlePieces: [
      { name: "df[df['col'] > x]", description: "布尔索引单列条件筛选" },
      { name: ".loc[]", description: "按标签选择行和列" },
      { name: ".query()", description: "用字符串表达式筛选" },
      { name: ".isin()", description: "筛选值在列表中的记录" },
      { name: ".any()", description: "判断任一条件是否为真" },
      { name: ".all()", description: "判断所有条件是否为真" },
      { name: ".between()", description: "筛选值在两数之间的记录" },
      { name: "df[df['col'].str.contains()]", description: "筛选字符串包含特定内容" }
    ]
  },
  {
    id: "3",
    title: "列操作与数据排序",
    difficulty: "easy",
    description: "对DataFrame进行列操作和数据排序。",
    requirements: "1. 添加一列'等级'，根据成绩划分等级\n2. 按成绩降序排序\n3. 按年龄升序、成绩降序排序",
    hints: [".sort_values()", "列选择", "新增列", "排序参数"],
    testData: `{
      "姓名": ["张三", "李四", "王五", "赵六", "钱七"],
      "年龄": [18, 19, 20, 19, 18],
      "成绩": [85, 92, 78, 88, 90]
    }`,
    expectedOutput: "按年龄升序、成绩降序排序后的结果",
    solution: `import pandas as pd
data = {"姓名": ["张三", "李四", "王五", "赵六", "钱七"], "年龄": [18, 19, 20, 19, 18], "成绩": [85, 92, 78, 88, 90]}
df = pd.DataFrame(data)
df['等级'] = df['成绩'].apply(lambda x: 'A' if x >= 90 else 'B' if x >= 80 else 'C')
print("添加等级:", df)
print("按成绩降序:", df.sort_values('成绩', ascending=False))
print("按年龄升、成绩降:", df.sort_values(['年龄', '成绩'], ascending=[True, False]))`,
    learningContent: {
      concept: "列操作与数据排序",
      explanation: "列操作是指对DataFrame的列进行增删改查操作，而数据排序则是按照指定列的值对数据进行排列。这是数据分析中常用的基础操作，掌握这些技能可以让你灵活地处理和整理数据。",
      keyPoints: [
        "使用 df['新列名'] = 值 添加新列，支持直接赋值或计算",
        ".apply() 可以对Series的每个元素应用自定义函数",
        ".sort_values() 用于按指定列排序数据",
        "可以按多列排序，每列可以指定不同的排序方向（升序/降序）",
        ".sort_index() 按索引排序",
        "可以使用自定义函数进行复杂排序",
        "排序时可以指定缺失值的处理方式",
        "列操作还包括删除列、重命名列、复制列等"
      ],
      examples: [
        "添加新列: df['新列'] = 值",
        "创建计算列: df['总分'] = df['语文'] + df['数学'] + df['英语']",
        "应用函数: df['成绩等级'] = df['成绩'].apply(lambda x: 'A' if x >= 90 else 'B')",
        "单列排序: df.sort_values('成绩', ascending=False)",
        "多列排序: df.sort_values(['年龄', '成绩'], ascending=[True, False])",
        "按索引排序: df.sort_index(ascending=False)",
        "删除列: df.drop('列名', axis=1)",
        "重命名列: df.rename(columns={'旧名': '新名'})",
        "复制列: df['新列'] = df['旧列'].copy()"
      ]
    },
    questions: [
      { id: "q1", question: "如何添加一个新列?", options: ["df.add_column('列名', 值)", "df['列名'] = 值", "df.insert('列名', 值)", "df.create_column('列名', 值)"], correctAnswer: 1, explanation: "直接使用 df['列名'] = 值 即可添加新列。" },
      { id: "q2", question: ".apply()方法的作用是什么?", options: ["删除列", "对列中的每个元素应用函数", "排序数据", "筛选数据"], correctAnswer: 1, explanation: ".apply()可以对Series中的每个元素应用指定的函数。" },
      { id: "q3", question: "按成绩降序排序，正确的写法是?", options: ["df.sort('成绩')", "df.sort_values('成绩')", "df.sort_values('成绩', ascending=False)", "df.order_by('成绩', desc=True)"], correctAnswer: 2, explanation: "使用 .sort_values() 方法，ascending=False 表示降序。" },
      { id: "q4", question: "按年龄升序、成绩降序排序，正确的写法是?", options: ["df.sort_values(['年龄', '成绩'])", "df.sort_values(['年龄', '成绩'], ascending=[True, False])", "df.sort_values(['年龄', '成绩'], ascending=False)", "df.sort(['年龄', '成绩'], order=['asc', 'desc'])"], correctAnswer: 1, explanation: "多列排序时，ascending参数是一个列表，对应每列的排序方向。" },
      { id: "q5", question: "以下哪个不是有效的列操作?", options: ["df['列'] = 1", "df['列'] = df['列1'] + df['列2']", "df['列'] = df['列'].apply(lambda x: x*2)", "df.add('列', 值)"], correctAnswer: 3, explanation: "添加列应该使用 df['列'] = 值 的方式。" },
      { id: "q6", question: "删除列的正确方式是?", options: ["df.drop('列名')", "df.drop('列名', axis=1)", "df.delete('列名')", "df.remove('列名')"], correctAnswer: 1, explanation: "使用 df.drop('列名', axis=1) 删除列，axis=1表示列方向。" },
      { id: "q7", question: "df.sort_values()默认是升序还是降序?", options: ["升序", "降序", "随机", "不确定"], correctAnswer: 0, explanation: ".sort_values()默认是升序排列(ascending=True)。" },
      { id: "q8", question: "如何按索引排序?", options: ["df.sort_index()", "df.sort('index')", "df.order_by_index()", "df.sort_values('index')"], correctAnswer: 0, explanation: "使用 .sort_index() 方法按索引排序。" },
      { id: "q9", question: "df['成绩'].apply(lambda x: '及格' if x >= 60 else '不及格') 会返回什么?", options: ["修改原数据", "返回一个新的Series", "返回一个新的DataFrame", "报错"], correctAnswer: 1, explanation: ".apply()返回一个新的Series，不会修改原数据。" },
      { id: "q10", question: "以下哪种方式可以创建计算列?", options: ["df['总和'] = df['a'] + df['b']", "df['平均值'] = (df['a'] + df['b']) / 2", "df['等级'] = df['成绩'].apply(lambda x: 'A' if x >= 90 else 'B')", "以上都可以"], correctAnswer: 3, explanation: "可以直接使用算术运算或.apply()创建计算列。" }
    ],
    funConcepts: [
      {
        title: "添加/删除列",
        emoji: "➕",
        explanation: "添加列就像在Excel表格右侧插入新列；删除列就是删掉不需要的信息。df['新列名'] = 值就可以直接添加，df.drop('列名', axis=1)可以删除。",
        example: "df['总分'] = df['语文'] + df['数学'] + df['英语'] — 创建一个新列，存储每个学生的总分。"
      },
      {
        title: "重命名列",
        emoji: "✏️",
        explanation: "重命名列就是给列换一个更合适的名字。比如把英文列名改成中文，或者把模糊的名字改成清晰的。",
        example: "df.rename(columns={'name': '姓名', 'score': '成绩'}) — 把英文列名改为中文，让数据更易读。"
      },
      {
        title: "排序",
        emoji: "⬆️",
        explanation: "排序就是按照某一列的值从小到大（升序）或从大到小（降序）重新排列数据。可以单列排序，也可以多列排序。",
        example: "df.sort_values('成绩', ascending=False) — 按成绩从高到低排列学生，第一名在最上面，方便查看排名。"
      },
      {
        title: "列操作的灵活性",
        emoji: "🎨",
        explanation: "DataFrame的列操作非常灵活，可以对每列应用不同的处理逻辑。可以用apply应用自定义函数，也可以直接用向量运算快速计算。",
        example: "df['等级'] = df['成绩'].apply(lambda x: '优秀' if x>=90 else '良好' if x>=80 else '及格') — 一键给所有学生评等级。"
      }
    ],
    puzzlePieces: [
      { name: "df['new']", description: "添加新列到DataFrame" },
      { name: ".drop()", description: "删除指定的列或行" },
      { name: ".rename()", description: "重命名列名或索引" },
      { name: ".sort_values()", description: "按列值排序数据" },
      { name: ".sort_index()", description: "按索引排序数据" },
      { name: ".reindex()", description: "重新排列索引顺序" },
      { name: ".reset_index()", description: "重置索引为数字序号" },
      { name: ".set_index()", description: "设置指定列为新索引" }
    ]
  },
  {
    id: "4",
    title: "缺失值处理",
    difficulty: "medium",
    description: "处理DataFrame中的缺失值。",
    requirements: "1. 检测DataFrame中的缺失值\n2. 删除包含缺失值的行\n3. 用均值填充缺失值",
    hints: [".isnull()", ".dropna()", ".fillna()", ".mean()"],
    testData: `{
      "姓名": ["张三", "李四", "王五", "赵六", "钱七"],
      "年龄": [18, None, 20, 19, 18],
      "成绩": [85, 92, None, 88, 90]
    }`,
    expectedOutput: "填充缺失值后的DataFrame",
    solution: `import pandas as pd
data = {"姓名": ["张三", "李四", "王五", "赵六", "钱七"], "年龄": [18, None, 20, 19, 18], "成绩": [85, 92, None, 88, 90]}
df = pd.DataFrame(data)
print("缺失值检测:")
print(df.isnull())
print("删除缺失值行:")
print(df.dropna())
df_filled = df.copy()
df_filled['年龄'] = df_filled['年龄'].fillna(df_filled['年龄'].mean())
df_filled['成绩'] = df_filled['成绩'].fillna(df_filled['成绩'].mean())
print("填充后:")
print(df_filled)`,
    learningContent: {
      concept: "缺失值处理",
      explanation: "缺失值是数据中常见的问题，可能由于数据采集不完整、传感器故障、用户跳过填写等原因导致。缺失值会影响数据分析和机器学习模型的性能，因此正确处理缺失值是数据预处理的重要步骤。Pandas提供了多种方法来检测和处理缺失值。",
      keyPoints: [
        ".isnull() 检测缺失值，返回布尔值DataFrame",
        ".notnull() 检测非缺失值，与isnull()相反",
        ".dropna() 删除包含缺失值的行或列，可指定阈值",
        ".fillna() 填充缺失值，支持多种填充策略",
        "df.isnull().sum() 统计每列缺失值数量",
        "向前填充(method='ffill')和向后填充(method='bfill')",
        "使用插值方法填充: .interpolate()",
        "根据业务逻辑自定义填充策略"
      ],
      examples: [
        "检测缺失值: df.isnull()",
        "统计缺失数: df.isnull().sum()",
        "删除缺失行: df.dropna()",
        "删除缺失列: df.dropna(axis=1)",
        "至少保留3个非缺失值: df.dropna(thresh=3)",
        "用均值填充: df.fillna(df.mean())",
        "用中位数填充: df.fillna(df.median())",
        "向前填充: df.fillna(method='ffill')",
        "向后填充: df.fillna(method='bfill')",
        "线性插值: df.interpolate()"
      ]
    },
    questions: [
      { id: "q1", question: "检测缺失值的方法是?", options: ["df.missing()", "df.isnull()", "df.na()", "df.null()"], correctAnswer: 1, explanation: ".isnull()方法返回一个布尔DataFrame，标记缺失值位置。" },
      { id: "q2", question: "删除包含缺失值的行，正确的写法是?", options: ["df.dropna()", "df.remove_na()", "df.delete_null()", "df.drop_null()"], correctAnswer: 0, explanation: ".dropna()默认删除包含任何缺失值的行。" },
      { id: "q3", question: "用均值填充缺失值，正确的写法是?", options: ["df.fillna(mean)", "df.fillna(df.mean())", "df.replace_null(df.mean())", "df.na.fill(df.mean())"], correctAnswer: 1, explanation: "使用 .fillna() 方法，传入 df.mean() 用均值填充。" },
      { id: "q4", question: ".dropna(axis=1)会删除什么?", options: ["包含缺失值的行", "包含缺失值的列", "所有行", "所有列"], correctAnswer: 1, explanation: "axis=1表示列方向，会删除包含缺失值的列。" },
      { id: "q5", question: "计算每列缺失值的数量，正确的写法是?", options: ["df.isnull().sum()", "df.null_count()", "df.count_null()", "df.na.count()"], correctAnswer: 0, explanation: "df.isnull().sum() 会计算每列的缺失值数量。" },
      { id: "q6", question: "用前一行的值填充缺失值，正确的写法是?", options: ["df.fillna(method='forward')", "df.fillna(method='ffill')", "df.fillna(previous)", "df.fill_forward()"], correctAnswer: 1, explanation: "使用 method='ffill' (forward fill) 向前填充。" },
      { id: "q7", question: "用后一行的值填充缺失值，正确的写法是?", options: ["df.fillna(method='backward')", "df.fillna(method='bfill')", "df.fill_backward()", "df.fillna(next)"], correctAnswer: 1, explanation: "使用 method='bfill' (backward fill) 向后填充。" },
      { id: "q8", question: "以下哪种不是常见的缺失值填充策略?", options: ["均值填充", "中位数填充", "删除", "随机填充"], correctAnswer: 3, explanation: "随机填充不是常见的缺失值处理策略，通常使用均值、中位数或众数填充。" },
      { id: "q9", question: "df.dropna(thresh=3)会删除什么?", options: ["缺失值超过3个的行", "非缺失值少于3个的行", "前3行", "后3行"], correctAnswer: 1, explanation: "thresh=n 表示至少需要n个非缺失值才保留该行。" },
      { id: "q10", question: "处理缺失值的最佳策略是?", options: ["总是删除", "总是用均值填充", "根据数据情况选择合适策略", "忽略缺失值"], correctAnswer: 2, explanation: "缺失值处理策略应根据数据特点和分析目的选择，没有通用的最佳策略。" }
    ],
    funConcepts: [
      {
        title: "NaN是什么?",
        emoji: "❓",
        explanation: "NaN代表'Not a Number'，就是数据缺失的意思。它像表格中的空白格——有些信息没填。NaN不等于0，也不等于空字符串，是一种特殊的缺失状态。",
        example: "一份调查问卷中，有些人没有填写年龄字段，这一行的年龄列就是NaN。它不是0岁，而是'未知'。"
      },
      {
        title: "为什么会有缺失值?",
        emoji: "🤔",
        explanation: "缺失值可能因为数据收集时遗漏、传感器故障、用户跳过填写、数据合并时不匹配等原因产生。理解缺失原因有助于选择正确的处理方法。",
        example: "电商数据中，如果一个订单被取消了，它的发货日期就是空的（NaN），这是有意义的缺失，而不是错误。"
      },
      {
        title: "缺失值处理策略",
        emoji: "🛠️",
        explanation: "处理缺失值有三种主要策略：1) 删除 — 如果缺失很少可以直接删掉；2) 填充 — 用均值、中位数或前后值填补；3) 插值 — 根据已有数据估算缺失值。",
        example: "学生成绩表中，如果只有1个学生缺考，直接删除影响不大；但如果30%的数据缺失，就应该考虑用中位数填充。"
      },
      {
        title: "向前填充 vs 向后填充",
        emoji: "📅",
        explanation: "ffill(forward fill)用前一个值填充当前缺失，bfill(backward fill)用后一个值填充。特别适合时间序列数据，比如股票价格的连续记录。",
        example: "周一到周五的温度是[20, NaN, 22, 23, NaN]，ffill后变成[20, 20, 22, 23, 23]，用前一天的温度填充了缺失。"
      }
    ],
    puzzlePieces: [
      { name: ".isnull()", description: "检测缺失值位置" },
      { name: ".notna()", description: "检测非缺失值位置" },
      { name: ".dropna()", description: "删除包含缺失值的行/列" },
      { name: ".fillna(value)", description: "用指定值填充缺失值" },
      { name: ".fillna(method='ffill')", description: "用前一个值向前填充" },
      { name: ".fillna(method='bfill')", description: "用后一个值向后填充" },
      { name: ".interpolate()", description: "线性插值填充缺失值" },
      { name: "df.replace()", description: "替换特定值为缺失值或其他值" }
    ]
  },
  {
    id: "5",
    title: "数据分组与聚合",
    difficulty: "medium",
    description: "对DataFrame进行分组和聚合操作。",
    requirements: "1. 按年龄分组，计算每个年龄的平均成绩\n2. 按等级分组，计算每个等级的学生数量和平均成绩\n3. 同时使用多个聚合函数",
    hints: [".groupby()", ".agg()", "count", "sum", "mean"],
    testData: `{
      "姓名": ["张三", "李四", "王五", "赵六", "钱七", "孙八"],
      "年龄": [18, 19, 20, 19, 18, 20],
      "成绩": [85, 92, 78, 88, 90, 82],
      "等级": ["B", "A", "C", "B", "A", "B"]
    }`,
    expectedOutput: "按等级分组的聚合结果",
    solution: `import pandas as pd
data = {"姓名": ["张三", "李四", "王五", "赵六", "钱七", "孙八"], "年龄": [18, 19, 20, 19, 18, 20], "成绩": [85, 92, 78, 88, 90, 82], "等级": ["B", "A", "C", "B", "A", "B"]}
df = pd.DataFrame(data)
print("按年龄分组平均成绩:")
print(df.groupby('年龄')['成绩'].mean())
print("按等级分组统计:")
print(df.groupby('等级').agg({'姓名': 'count', '成绩': 'mean'}))
print("按年龄多聚合函数:")
print(df.groupby('年龄')['成绩'].agg(['count', 'mean', 'max', 'min']))`,
    learningContent: {
      concept: "数据分组与聚合",
      explanation: "分组与聚合是数据分析的核心操作，通过groupby将数据按某个维度分组，然后对每组应用聚合函数（如平均值、计数、求和等），从而快速洞察数据分布规律。这是从数据中提取业务洞察的关键技能。",
      keyPoints: [
        ".groupby()创建分组对象，指定分组列，支持单列和多列分组",
        ".agg()可接收字典为不同列指定不同聚合函数，非常灵活",
        "可对同一列同时应用多个聚合函数，如count、mean、max、min",
        "支持多列分组，按组合维度分析数据，如按班级和性别分组",
        ".apply()可以对分组应用自定义函数，实现复杂计算",
        ".filter()可以根据组内条件过滤分组",
        ".transform()可以对每组进行转换操作",
        "分组后可以使用.reset_index()将索引转换为列"
      ],
      examples: [
        "单分组单聚合: df.groupby('列1')['列2'].mean()",
        "多聚合字典: df.groupby('列1').agg({'列2': 'sum', '列3': 'mean'})",
        "多列分组: df.groupby(['列1', '列2'])['列3'].agg(['count', 'mean'])",
        "命名聚合结果: df.groupby('列1').agg(平均值=('列2', 'mean'), 最大值=('列2', 'max'))",
        "自定义函数: df.groupby('列1')['列2'].apply(lambda x: x.max() - x.min())",
        "过滤分组: df.groupby('列1').filter(lambda x: len(x) >= 3)",
        "转换操作: df.groupby('列1')['列2'].transform(lambda x: x - x.mean())",
        "重置索引: df.groupby('列1')['列2'].mean().reset_index()"
      ]
    },
    questions: [
      { id: "q1", question: "计算每个班级的平均成绩，正确的写法是?", options: ["df.groupby('班级')['成绩'].mean()", "df.group('班级')['成绩'].average()", "df.agg('班级', '成绩').mean()", "df['班级'].group('成绩').mean()"], correctAnswer: 0, explanation: "使用 .groupby('分组列')['聚合列'].聚合函数() 的格式。" },
      { id: "q2", question: ".groupby()返回什么对象?", options: ["DataFrame", "Series", "GroupBy对象", "字典"], correctAnswer: 2, explanation: ".groupby()返回一个GroupBy分组对象，需要配合聚合函数使用。" },
      { id: "q3", question: "对分组后的数据同时计算计数和平均值，正确的写法是?", options: ["df.groupby('列')['值'].agg(['count', 'mean'])", "df.groupby('列')['值'].agg(['count', 'mean'])", "df.agg(['count', 'mean']).groupby('列')", "df.groupby(['count', 'mean'])['值']"], correctAnswer: 1, explanation: "可以使用列表向同一列应用多个聚合函数。" },
      { id: "q4", question: "按多列分组，正确的写法是?", options: ["df.groupby('列1').groupby('列2')", "df.groupby(['列1', '列2'])", "df.groupby('列1', '列2')", "df.group('列1', '列2')"], correctAnswer: 1, explanation: "多列分组需要使用列表作为参数传入。" },
      { id: "q5", question: "分组后获取第1组数据，正确的写法是?", options: ["df.groupby('列').first()", "df.groupby('列').get_group(0)", "df.groupby('列').groups[0]", "df.groupby('列').nth(0)"], correctAnswer: 3, explanation: ".nth(n)返回第n组数据。" },
      { id: "q6", question: "计算每组的最大值减去最小值，正确的写法是?", options: ["df.groupby('列')['值'].apply(lambda x: x.max() - x.min())", "df.groupby('列')['值'].max() - df.groupby('列')['值'].min()", "df.groupby('列')['值'].diff()", "df.groupby('列')['值'].range()"], correctAnswer: 0, explanation: "可以使用apply应用自定义聚合函数。" },
      { id: "q7", question: "分组后对不同列使用不同聚合函数，正确的写法是?", options: ["df.groupby('列').agg({'列1': 'sum', '列2': 'mean'})", "df.groupby('列').sum('列1').mean('列2')", "df.groupby('列').agg(sum='列1', mean='列2')", "df.groupby('列').sum('列1').mean('列2')"], correctAnswer: 0, explanation: "使用字典为不同列指定不同聚合函数。" },
      { id: "q8", question: "以下哪个不是常见的聚合函数?", options: ["mean", "sum", "concat", "count"], correctAnswer: 2, explanation: "concat不是聚合函数，它用于数据拼接。" },
      { id: "q9", question: "分组后重置索引，正确的写法是?", options: ["df.groupby('列').reset_index()", "df.groupby('列').reset()", "df.groupby('列').index_reset()", "df.groupby('列').reset_index(drop=True)"], correctAnswer: 0, explanation: "使用 .reset_index() 将分组索引转换为普通列。" },
      { id: "q10", question: "分组后过滤掉组内元素少于3个的组，正确的写法是?", options: ["df.groupby('列').filter(lambda x: len(x) >= 3)", "df.groupby('列').filter(x: len(x) >= 3)", "df.groupby('列').count() >= 3", "df.groupby('列').filter(len >= 3)"], correctAnswer: 0, explanation: "使用 filter 方法根据条件过滤分组。" }
    ],
    funConcepts: [
      {
        title: "Split-Apply-Combine 模式",
        emoji: "🔀",
        explanation: "分组聚合就像整理书架：先按类别分开（Split），比如小说、教材、杂志；然后对每组处理（Apply），比如数数每组有多少本；最后把结果合并（Combine）成一张汇总表。",
        example: "按班级分组计算平均分：Split=把学生分到各班，Apply=算每个班的平均分，Combine=输出'班级-平均分'的汇总表。"
      },
      {
        title: "分组键 (Group Key)",
        emoji: "🔑",
        explanation: "分组键是用来划分数据的依据，可以是一列或多列。就像分类的标准：按颜色、按形状、按大小。分组键决定了你从哪个角度看数据。",
        example: "df.groupby('班级') — 按班级分组；df.groupby(['班级', '性别']) — 先按班级、再按性别，更细粒度的分组。"
      },
      {
        title: "聚合函数",
        emoji: "📊",
        explanation: "聚合函数把一组数浓缩成一个有代表性的值。常见的聚合函数包括：count（计数）、sum（求和）、mean（平均）、max（最大）、min（最小）、median（中位数）等等。",
        example: "df.groupby('班级')['成绩'].agg(['count', 'mean', 'max', 'min']) — 同时看每个班的人数、平均分、最高分和最低分。"
      },
      {
        title: "多列分组的威力",
        emoji: "🎯",
        explanation: "多列分组可以让你从多个维度交叉分析数据。比如同时按地区和产品分组，可以看到不同地区不同产品的销售表现差异，发现更细致的洞察。",
        example: "df.groupby(['地区', '产品'])['销售额'].sum() — 可以看到'北京-手机'卖了多少，'上海-电脑'卖了多少，发现区域偏好。"
      }
    ],
    puzzlePieces: [
      { name: ".groupby()", description: "按指定列进行数据分组" },
      { name: ".agg()", description: "对数据应用聚合函数" },
      { name: ".size()", description: "计算每组的元素数量" },
      { name: ".count()", description: "计算每组非空值的数量" },
      { name: ".sum()", description: "对每组求和" },
      { name: ".mean()", description: "对每组求平均值" },
      { name: ".transform()", description: "对每组进行转换操作" },
      { name: ".filter()", description: "根据组内条件过滤分组" }
    ]
  },
  {
    id: "6",
    title: "数据合并与连接",
    difficulty: "medium",
    description: "合并和连接多个DataFrame。",
    requirements: "1. 使用pd.merge()合并两个DataFrame\n2. 使用pd.concat()连接多个DataFrame\n3. 尝试不同类型的连接方式",
    hints: ["pd.merge()", "pd.concat()", "join类型", "on参数"],
    testData: `{
  "df1": {
    "姓名": ["张三", "李四", "王五"],
    "年龄": [18, 19, 20],
    "成绩": [85, 92, 78]
  },
  "df2": {
    "姓名": ["张三", "李四", "赵六"],
    "性别": ["男", "男", "女"],
    "班级": ["一班", "二班", "一班"]
  }
}`,
    expectedOutput: "不同连接方式的合并结果",
    solution: `import pandas as pd
df1 = pd.DataFrame({"姓名": ["张三", "李四", "王五"], "年龄": [18, 19, 20], "成绩": [85, 92, 78]})
df2 = pd.DataFrame({"姓名": ["张三", "李四", "赵六"], "性别": ["男", "男", "女"], "班级": ["一班", "二班", "一班"]})
print("内连接:")
print(pd.merge(df1, df2, on='姓名'))
print("左连接:")
print(pd.merge(df1, df2, on='姓名', how='left'))
print("右连接:")
print(pd.merge(df1, df2, on='姓名', how='right'))
print("concat连接:")
print(pd.concat([df1, df2], axis=1))`,
    learningContent: {
      concept: "数据合并与连接",
      explanation: "数据合并与连接是数据处理中常见的操作，在实际数据分析中，我们经常需要将多个数据源合并在一起进行分析。merge()用于按键值合并（类似SQL的join），concat()用于按轴方向拼接数据。掌握这些技能可以让你灵活地整合多个数据源。",
      keyPoints: [
        "pd.merge()支持多种连接方式：inner(内连接), left(左连接), right(右连接), outer(外连接), cross(交叉连接)",
        "on参数指定合并的键，left_on和right_on可分别指定左右表的键（当键名不同时）",
        "pd.concat()的axis参数控制拼接方向，axis=0是纵向拼接，axis=1是横向拼接",
        "可以使用suffixes参数处理重名列名冲突，默认是['_x', '_y']",
        "pd.merge()还支持按索引合并（left_index=True, right_index=True）",
        "validate参数可以验证合并关系（one_to_one, one_to_many, many_to_one, many_to_many）",
        "df.join()是一种简化的合并方式，主要用于按索引合并",
        "合并时可以使用sort参数控制结果是否排序"
      ],
      examples: [
        "内连接: pd.merge(df1, df2, on='键')",
        "左连接: pd.merge(df1, df2, on='键', how='left')",
        "右连接: pd.merge(df1, df2, on='键', how='right')",
        "外连接: pd.merge(df1, df2, on='键', how='outer')",
        "键名不同: pd.merge(df1, df2, left_on='键1', right_on='键2')",
        "纵向拼接: pd.concat([df1, df2], axis=0)",
        "横向拼接: pd.concat([df1, df2], axis=1)",
        "按索引合并: pd.merge(df1, df2, left_index=True, right_index=True)",
        "处理重名: pd.merge(df1, df2, on='键', suffixes=('_左', '_右'))",
        "使用join: df1.join(df2, on='键')"
      ]
    },
    questions: [
      { id: "q1", question: "保留左表所有行的连接方式是?", options: ["inner", "left", "right", "outer"], correctAnswer: 1, explanation: "左连接(how='left')保留左表的所有行，右表匹配不上的填充NaN。" },
      { id: "q2", question: "pd.merge()的默认连接方式是?", options: ["inner", "left", "right", "outer"], correctAnswer: 0, explanation: "merge()默认是内连接(inner)，只保留两个表都匹配的行。" },
      { id: "q3", question: "左右表键名不同时，正确的写法是?", options: ["pd.merge(df1, df2, on_left='键1', on_right='键2')", "pd.merge(df1, df2, left_on='键1', right_on='键2')", "pd.merge(df1, df2, on=['键1', '键2'])", "pd.merge(df1, df2, by=['键1', '键2'])"], correctAnswer: 1, explanation: "键名不同时用left_on和right_on分别指定。" },
      { id: "q4", question: "纵向拼接两个DataFrame，正确的写法是?", options: ["pd.concat([df1, df2], axis=0)", "pd.concat([df1, df2], axis=1)", "pd.merge(df1, df2, axis=0)", "pd.combine([df1, df2])"], correctAnswer: 0, explanation: "axis=0表示按索引方向（纵向）拼接，axis=1表示按列方向（横向）拼接。" },
      { id: "q5", question: "合并后列名冲突时，使用哪个参数处理?", options: ["suffixes", "prefixes", "columns", "names"], correctAnswer: 0, explanation: "suffixes参数可以指定左右表列名的后缀，默认是['_x', '_y']。" },
      { id: "q6", question: "pd.merge()参数validate='one_to_one'的作用是?", options: ["验证键是唯一的", "验证合并是一对一关系", "验证数据类型一致", "验证没有缺失值"], correctAnswer: 1, explanation: "validate参数用于验证合并关系，防止数据膨胀。" },
      { id: "q7", question: "以下哪个不是merge的连接类型?", options: ["inner", "outer", "cross", "middle"], correctAnswer: 3, explanation: "merge支持inner、left、right、outer、cross，没有middle。" },
      { id: "q8", question: "按索引合并，正确的写法是?", options: ["pd.merge(df1, df2, on=df1.index)", "pd.merge(df1, df2, left_index=True, right_index=True)", "pd.merge(df1, df2, index=True)", "pd.merge(df1, df2, by_index=True)"], correctAnswer: 1, explanation: "使用left_index=True和right_index=True可以按索引合并。" },
      { id: "q9", question: "concat时忽略原始索引，正确的写法是?", options: ["pd.concat([df1, df2], ignore_index=True)", "pd.concat([df1, df2], reset_index=True)", "pd.concat([df1, df2], drop_index=True)", "pd.concat([df1, df2], index=False)"], correctAnswer: 0, explanation: "ignore_index=True可以重置索引为0,1,2...。" },
      { id: "q10", question: "以下哪种情况适合使用concat而非merge?", options: ["按键合并两个表", "在下方追加同结构数据", "横向扩展列", "B和C"], correctAnswer: 3, explanation: "merge用于按键合并，concat用于简单的纵向或横向拼接。" }
    ],
    funConcepts: [
      {
        title: "合并 (Merge) vs 连接 (Concatenate)",
        emoji: "🔗",
        explanation: "Merge就像两张有共同字段的表格，通过共享字段把信息拼在一起。Concatenate就像把两张纸直接上下或左右粘在一起，不考虑内容的关联。",
        example: "Merge：学生基本信息表 + 学生成绩表 → 通过学号合并成完整表。Concat：1月销售表 + 2月销售表 → 纵向拼接成完整销售数据。"
      },
      {
        title: "主键和外键",
        emoji: "🗝️",
        explanation: "主键是一张表中每条记录的唯一标识（如学号）。外键是另一张表中引用这个主键的字段。通过主键和外键，两张表就能正确'对号入座'。",
        example: "订单表的订单号是主键，订单明细表中的订单号就是外键。通过它可以把订单和明细正确对应起来。"
      },
      {
        title: "内连接 (Inner Join)",
        emoji: "⚡",
        explanation: "内连接只保留两张表中都能匹配到的记录。就像两个朋友圈的交集 — 只有同时在两个圈子里的人才会被邀请。",
        example: "表A有用户1、2、3的数据，表B有用户2、3、4的数据。内连接后只有用户2、3的数据被保留。"
      },
      {
        title: "左连接 / 右连接 / 外连接",
        emoji: "🌓",
        explanation: "左连接保留左表所有记录，右表匹配不上的填NaN；右连接相反；外连接保留两张表所有记录（相当于并集）。根据分析需求选择合适的连接方式。",
        example: "左连接常用于：我想看到所有用户（即使有些没有购买记录），有购买的展示购买信息，没有购买的显示空值。"
      }
    ],
    puzzlePieces: [
      { name: "pd.merge()", description: "按键合并两个DataFrame" },
      { name: "pd.concat()", description: "按轴拼接多个DataFrame" },
      { name: ".join()", description: "按索引简化合并操作" },
      { name: "pd.merge(how='inner')", description: "内连接保留匹配记录" },
      { name: "pd.merge(how='outer')", description: "外连接保留所有记录" },
      { name: "pd.merge(how='left')", description: "左连接保留左表记录" },
      { name: "pd.merge(how='right')", description: "右连接保留右表记录" },
      { name: "pd.concat(ignore_index=True)", description: "拼接后重置索引序号" }
    ]
  },
  {
    id: "7",
    title: "数据透视表",
    difficulty: "medium",
    description: "创建和使用数据透视表。",
    requirements: "1. 创建数据透视表，按班级和性别分组计算平均成绩\n2. 调整数据透视表的行、列和值\n3. 使用aggfunc参数指定聚合函数",
    hints: [".pivot_table()", "index", "columns", "values", "aggfunc"],
    testData: `{
      "姓名": ["张三", "李四", "王五", "赵六", "钱七", "孙八"],
      "班级": ["一班", "二班", "一班", "二班", "一班", "二班"],
      "性别": ["男", "男", "女", "女", "男", "女"],
      "成绩": [85, 92, 78, 88, 90, 82]
    }`,
    expectedOutput: "数据透视表结果",
    solution: `import pandas as pd
data = {"姓名": ["张三", "李四", "王五", "赵六", "钱七", "孙八"], "班级": ["一班", "二班", "一班", "二班", "一班", "二班"], "性别": ["男", "男", "女", "女", "男", "女"], "成绩": [85, 92, 78, 88, 90, 82]}
df = pd.DataFrame(data)
pivot = df.pivot_table(values='成绩', index='班级', columns='性别', aggfunc='mean')
print("班级×性别透视表:")
print(pivot)
pivot2 = df.pivot_table(values='成绩', index='性别', columns='班级', aggfunc='mean')
print("性别×班级透视表:")
print(pivot2)
pivot3 = df.pivot_table(values='成绩', index='班级', columns='性别', aggfunc=['mean', 'count', 'max', 'min'])
print("多聚合函数:")
print(pivot3)`,
    learningContent: {
      concept: "数据透视表",
      explanation: "数据透视表是强大的聚合工具，将数据重新排列以行和列维度展示聚合结果，类似Excel的透视表功能，非常适合多维度分析。它可以帮助你快速从多个角度分析数据，发现数据中的规律和趋势。",
      keyPoints: [
        "pivot_table()的index参数指定行维度分组键",
        "columns参数指定列维度分组键",
        "values参数指定要聚合的值列，支持多列",
        "aggfunc参数指定聚合函数，默认是mean，支持多个函数",
        "fill_value参数可填充NaN为指定值",
        "margins参数添加边际总计行和列",
        "margins_name参数自定义总计行/列的名称",
        "可以同时指定多个行或列维度"
      ],
      examples: [
        "基础透视表: df.pivot_table(values='值', index='行', columns='列', aggfunc='mean')",
        "多聚合函数: df.pivot_table(values='值', index='行', aggfunc=['count', 'mean', 'max'])",
        "填充缺失值: df.pivot_table(values='值', index='行', columns='列', fill_value=0)",
        "边际总计: df.pivot_table(values='值', index='行', columns='列', margins=True)",
        "多值列: df.pivot_table(values=['值1', '值2'], index='行', columns='列')",
        "自定义边际名: df.pivot_table(values='值', index='行', columns='列', margins=True, margins_name='总计')",
        "多列维度: df.pivot_table(values='值', index='行', columns=['列1', '列2'])",
        "不同列不同聚合: df.pivot_table(values={'列1': 'sum', '列2': 'mean'}, index='行')"
      ]
    },
    questions: [
      { id: "q1", question: "pivot_table默认的聚合函数是?", options: ["sum", "mean", "count", "max"], correctAnswer: 1, explanation: "pivot_table默认使用平均值(mean)作为聚合函数。" },
      { id: "q2", question: "pivot_table的index参数作用是?", options: ["指定行维度", "指定列维度", "指定聚合值", "指定聚合函数"], correctAnswer: 0, explanation: "index参数指定透视表的行维度分组键。" },
      { id: "q3", question: "添加边际行总计，正确的参数是?", options: ["total=True", "margins=True", "sum=True", "all=True"], correctAnswer: 1, explanation: "margins=True会在底部添加一行总计。" },
      { id: "q4", question: "填充透视表中的NaN，正确的参数是?", options: ["na=0", "fillna=0", "fill_value=0", "nan_value=0"], correctAnswer: 2, explanation: "fill_value参数用于填充聚合结果中的缺失值。" },
      { id: "q5", question: "同时聚合多个列，values参数应传入?", options: ["单个字符串", "列表", "字典", "元组"], correctAnswer: 1, explanation: "values接受列表，可以同时聚合多列。" },
      { id: "q6", question: "对同一列应用多个聚合函数，正确的写法是?", options: ["df.pivot_table(values='列', aggfunc='mean,sum')", "df.pivot_table(values='列', aggfunc=['mean', 'sum'])", "df.pivot_table(values='列', aggfunc=mean+sum)", "df.pivot_table(values='列', aggfunc={'mean', 'sum'})"], correctAnswer: 1, explanation: "aggfunc接受列表，可以同时应用多个聚合函数。" },
      { id: "q7", question: "pivot_table和groupby的区别在于?", options: ["pivot_table更快", "pivot_table可以展示为二维表", "pivot_table支持更多聚合函数", "pivot_table只能聚合数字"], correctAnswer: 1, explanation: "pivot_table会将数据重塑为行和列的二维表格形式。" },
      { id: "q8", question: "pivot_table的columns参数作用是?", options: ["指定列名", "指定列维度分组", "指定聚合的列", "指定结果列名"], correctAnswer: 1, explanation: "columns参数指定透视表的列维度分组键。" },
      { id: "q9", question: "计算透视表的边际名称，使用哪个参数?", options: ["margin_name", "margins_name", "margins_label", "label"], correctAnswer: 1, explanation: "margins_name参数可以自定义边际行的名称，默认为'All'。" },
      { id: "q10", question: "对不同列使用不同聚合函数，正确的写法是?", options: ["df.pivot_table(values=['列1','列2'], aggfunc={'列1': 'sum', '列2': 'mean'})", "df.pivot_table(values=['列1','列2'], aggfunc=['sum','mean'])", "df.pivot_table(values=['列1','列2'], aggfunc=sum, mean)", "df.pivot_table(values={'列1': 'sum', '列2': 'mean'})"], correctAnswer: 0, explanation: "使用字典可以为不同列指定不同聚合函数。" }
    ],
    funConcepts: [
      {
        title: "Excel透视表思维",
        emoji: "📑",
        explanation: "透视表就像Excel中那个神奇的功能：拖拖拽拽就能把数据重新组织起来。行代表一个维度（如地区），列代表另一个维度（如产品），交叉点是数值（如销售额）。",
        example: "按行=地区、列=产品、值=销售额做透视表，可以一眼看到北京卖了多少手机，上海卖了多少电脑，快速发现销售模式。"
      },
      {
        title: "行/列/值的组织",
        emoji: "🎯",
        explanation: "透视表的三要素：index（行）决定水平方向的分组，columns（列）决定垂直方向的分组，values（值）决定格子里显示什么数字。灵活搭配这三个参数，可以从无数角度看数据。",
        example: "index=性别、columns=班级、values=成绩 → 可以看到男女同学在不同班级的平均成绩差异。"
      },
      {
        title: "聚合函数的选择",
        emoji: "🔢",
        explanation: "聚合函数决定透视表格子里的值怎么计算。mean看平均水平，sum看总量，count看数量，max看最大值。还可以同时应用多个聚合函数，进行多维度比较。",
        example: "aggfunc=['mean', 'count', 'max'] 同时显示平均分、人数和最高分，一次分析就能获得完整信息。"
      },
      {
        title: "边际总计 (Margins)",
        emoji: "📊",
        explanation: "margins=True会在透视表最后添加一行和一列，显示每行、每列的总计（行合计和列合计），让你既看到细节又看到整体。",
        example: "一份销售透视表，加上边际总计，可以立刻看到：每个地区销售多少，每个产品销售多少，以及总销售额是多少。"
      }
    ],
    puzzlePieces: [
      { name: "pd.pivot_table()", description: "创建数据透视表" },
      { name: ".pivot()", description: "简单的表格重塑（无聚合）" },
      { name: ".stack()", description: "将列旋转为行索引（变长）" },
      { name: ".unstack()", description: "将行索引旋转为列（变宽）" },
      { name: "pd.pivot_table(aggfunc='sum')", description: "透视表按求和聚合" },
      { name: "pd.pivot_table(margins=True)", description: "添加边际合计行和列" },
      { name: "pd.crosstab()", description: "生成交叉列联表" },
      { name: ".pivot_table(index=..., columns=...)", description: "指定行和列维度" }
    ]
  },
  {
    id: "8",
    title: "时间序列处理",
    difficulty: "hard",
    description: "处理时间序列数据。",
    requirements: "1. 将字符串转换为日期时间类型\n2. 设置日期为索引\n3. 按月份重采样并计算总和\n4. 计算移动平均值",
    hints: ["pd.to_datetime()", ".resample()", "日期索引", ".rolling()"],
    testData: `{
      "日期": ["2023-01-01", "2023-01-05", "2023-02-01", "2023-02-15", "2023-03-01", "2023-03-10"],
      "销售额": [1000, 1500, 2000, 1800, 2500, 2200]
    }`,
    expectedOutput: "按月份重采样和移动平均值结果",
    solution: `import pandas as pd
data = {"日期": ["2023-01-01", "2023-01-05", "2023-02-01", "2023-02-15", "2023-03-01", "2023-03-10"], "销售额": [1000, 1500, 2000, 1800, 2500, 2200]}
df = pd.DataFrame(data)
df['日期'] = pd.to_datetime(df['日期'])
df.set_index('日期', inplace=True)
print("月度重采样:")
print(df.resample('ME').sum())
print("移动平均:")
df['移动平均'] = df['销售额'].rolling(window=3).mean()
print(df)`,
    learningContent: {
      concept: "时间序列处理",
      explanation: "时间序列是按时间排序的数据序列，在金融、销售、气象等领域非常常见。Pandas提供了强大的时间序列处理工具，包括日期解析、重采样、移动窗口、时间差计算等功能，是进行时间序列分析的必备技能。",
      keyPoints: [
        "pd.to_datetime()将字符串转换为datetime64类型，支持多种日期格式",
        "重采样(resample)改变时间频率，如从日数据聚合到月数据",
        "移动窗口(rolling)计算滚动统计量，如移动平均",
        "常用频率代码：'D'日, 'W'周, 'ME'月末, 'QE'季末, 'YE'年末",
        "设置日期为索引便于进行时间操作和切片",
        "使用.dt访问器提取日期时间的各个部分（年、月、日、时、分、秒）",
        "时间差计算产生Timedelta对象，可用于时间运算",
        "支持日期偏移量，如BusinessDay、MonthEnd等"
      ],
      examples: [
        "转换日期: df['日期'] = pd.to_datetime(df['日期'])",
        "设置索引: df.set_index('日期', inplace=True)",
        "月度求和: df.resample('ME').sum()",
        "3日移动平均: df['值'].rolling(window=3).mean()",
        "日期切片: df['2023-01':'2023-03']",
        "提取年份: df['日期'].dt.year",
        "计算日期间隔: df['日期1'] - df['日期2']",
        "计算累积和: df['值'].cumsum()",
        "计算同比增长率: df['值'].pct_change(periods=365)",
        "自定义重采样频率: df.resample('W-FRI').sum()"
      ]
    },
    questions: [
      { id: "q1", question: "将字符串转换为日期时间，正确的函数是?", options: ["pd.date()", "pd.to_datetime()", "pd.datetime()", "pd.date_parse()"], correctAnswer: 1, explanation: "pd.to_datetime()是标准的日期转换函数。" },
      { id: "q2", question: "按月份重采样，正确的频率代码是?", options: ["'M'", "'ME'", "'month'", "'MONTH'"], correctAnswer: 1, explanation: "新版本推荐使用'ME'(Month End)表示月末重采样。" },
      { id: "q3", question: "计算3日移动平均，正确的写法是?", options: ["df['列'].rolling(window=3).mean()", "df['列'].window(3).mean()", "df['列'].roll(3).average()", "df['列'].rolling(3).avg()"], correctAnswer: 0, explanation: "使用 .rolling(window=n).mean() 计算移动平均。" },
      { id: "q4", question: "resample()返回什么对象?", options: ["DataFrame", "Series", "Resampler对象", "日期对象"], correctAnswer: 2, explanation: "resample()返回Resampler对象，需要配合聚合函数使用。" },
      { id: "q5", question: "获取2023年数据，正确的切片是?", options: ["df['2023']", "df['2023-01-01':'2023-12-31']", "df.loc['2023']", "以上都是"], correctAnswer: 3, explanation: "日期索引支持多种切片方式。" },
      { id: "q6", question: "计算日期差，正确的写法是?", options: ["df['日期1'] - df['日期2']", "df['日期1'].diff(df['日期2'])", "pd.diff(df['日期1'], df['日期2'])", "df['日期1'].sub(df['日期2']) "], correctAnswer: 0, explanation: "datetime64类型可以直接相减得到Timedelta对象。" },
      { id: "q7", question: "提取日期的年份，正确的写法是?", options: ["df['日期'].year", "df['日期'].dt.year", "df['日期'].get_year()", "pd.year(df['日期'])"], correctAnswer: 1, explanation: "使用 .dt 访问器提取日期时间的各个部分。" },
      { id: "q8", question: "计算累计和，正确的函数是?", options: [".sum()", ".cumsum()", ".accumulate()", ".total()"], correctAnswer: 1, explanation: ".cumsum()计算累积和，是时间序列分析常用方法。" },
      { id: "q9", question: "移动窗口从当前点向前看，使用哪个参数?", options: ["window='forward'", "closed='right'", "closed='left'", "direction='forward'"], correctAnswer: 1, explanation: "closed参数控制窗口包含哪一端。" },
      { id: "q10", question: "按季度重采样，正确的频率代码是?", options: ["'Q'", "'QE'", "'quarter'", "'QUARTER'"], correctAnswer: 1, explanation: "推荐使用'QE'(Quarter End)表示季度末重采样。" }
    ],
    funConcepts: [
      {
        title: "日期时间类型",
        emoji: "📅",
        explanation: "日期时间类型是Pandas专门处理时间数据的类型，类似Excel中把字符串'2024-01-01'转成日期格式。转为日期类型后才能做时间差、重采样等高级操作。",
        example: "pd.to_datetime(['2024-01-01', '2024-01-02', '2024-01-03']) — 把字符串日期转成Pandas可以理解的日期时间类型。"
      },
      {
        title: "时间索引",
        emoji: "⏱️",
        explanation: "把日期设为索引后，DataFrame就变成了时间序列。可以用日期切片（如df['2024-01':'2024-06']）、按时间重采样、做移动窗口等操作。",
        example: "df.set_index('日期', inplace=True) — 把日期列设为索引，之后就可以像df['2024']这样按年切片数据。"
      },
      {
        title: "重采样 (Resampling)",
        emoji: "📊",
        explanation: "重采样就是改变数据的时间频率。从日数据变成月数据（降采样），从年数据变成季数据（升采样）。类似把每天的收入汇总成每月总收入。",
        example: "df.resample('ME').sum() — 按月末重采样并求和，得到每月的总额。'ME'表示月末，'QE'表示季末。"
      },
      {
        title: "滑动窗口 (Rolling)",
        emoji: "🪟",
        explanation: "滑动窗口就是'移动着的窗口'，每次取最近N个数据做计算。比如7天移动平均：每一天的值 = 它和前6天的平均值，可以平滑波动，看清趋势。",
        example: "df['移动平均'] = df['销售额'].rolling(window=7).mean() — 计算7天移动平均，把每日波动平滑掉，更容易看出销售趋势。"
      }
    ],
    puzzlePieces: [
      { name: "pd.to_datetime()", description: "字符串转为日期时间类型" },
      { name: ".dt.year/month/day", description: "提取年月日等时间部分" },
      { name: ".set_index(日期)", description: "设置日期列为时间索引" },
      { name: ".resample('M').sum()", description: "按月重采样并求和" },
      { name: ".rolling(window=7).mean()", description: "计算7窗口滑动平均" },
      { name: "pd.date_range()", description: "生成日期范围序列" },
      { name: ".shift()", description: "数据向前/向后平移" },
      { name: ".diff()", description: "计算与前一个值的差值" }
    ]
  },
  {
    id: "9",
    title: "数据分箱与Apply函数",
    difficulty: "hard",
    description: "使用数据分箱和Apply函数处理数据。",
    requirements: "1. 使用pd.cut()将成绩分为不同区间\n2. 使用apply()函数对数据进行处理\n3. 使用lambda函数进行简单计算",
    hints: ["pd.cut()", ".apply()", "lambda函数", "分箱区间"],
    testData: `{
      "姓名": ["张三", "李四", "王五", "赵六", "钱七", "孙八"],
      "成绩": [85, 92, 78, 88, 90, 65]
    }`,
    expectedOutput: "数据分箱和Apply函数处理结果",
    solution: `import pandas as pd
data = {"姓名": ["张三", "李四", "王五", "赵六", "钱七", "孙八"], "成绩": [85, 92, 78, 88, 90, 65]}
df = pd.DataFrame(data)
bins = [0, 60, 70, 80, 90, 100]
labels = ["不及格", "及格", "中等", "良好", "优秀"]
df['成绩等级'] = pd.cut(df['成绩'], bins=bins, labels=labels)
grade_map = {"不及格": "0-60", "及格": "60-70", "中等": "70-80", "良好": "80-90", "优秀": "90-100"}
df['分数范围'] = df['成绩等级'].apply(lambda x: grade_map.get(x, "未知"))
df['加分后'] = df['成绩'].apply(lambda x: x * 1.05)
print(df)`,
    learningContent: {
      concept: "数据分箱与Apply函数",
      explanation: "数据分箱将连续数值离散化为区间，便于进行分组分析和可视化。Apply是灵活的数据处理工具，可对Series或DataFrame应用自定义函数，配合lambda实现简洁的单行函数。这两个工具是数据转换和特征工程的重要手段。",
      keyPoints: [
        "pd.cut()进行等宽分箱，每个区间宽度相同",
        "pd.qcut()进行等频分箱，每个区间包含相同数量的数据",
        ".apply()对Series逐元素应用函数，返回新的Series",
        ".apply()对DataFrame按行(axis=1)或列(axis=0)应用函数",
        "lambda x: ... 定义匿名函数，适合简单操作",
        "分箱后得到Categorical类型，保持区间顺序",
        ".applymap()对DataFrame的每个元素应用函数",
        "可以向apply传入自定义函数而非lambda"
      ],
      examples: [
        "等宽分箱: pd.cut(df['列'], bins=5)",
        "等频分箱: pd.qcut(df['列'], q=4)",
        "带标签分箱: pd.cut(df['列'], bins=[0,60,80,100], labels=['不及格','及格','优秀'])",
        "Series的apply: df['列'].apply(lambda x: x*2)",
        "DataFrame按行apply: df.apply(lambda row: row['a']+row['b'], axis=1)",
        "自定义函数apply: df['列'].apply(my_function)",
        "每个元素apply: df.applymap(lambda x: str(x).upper())",
        "分箱统计: df.groupby(pd.cut(df['列'], bins=5))['值'].mean()"
      ]
    },
    questions: [
      { id: "q1", question: "进行等宽分箱的函数是?", options: ["pd.cut()", "pd.qcut()", "pd.bucket()", "pd.bin()"], correctAnswer: 0, explanation: "pd.cut()是等宽分箱，pd.qcut()是等频分箱。" },
      { id: "q2", question: "进行等频分箱的函数是?", options: ["pd.cut()", "pd.qcut()", "pd.bucket()", "pd.bin()"], correctAnswer: 1, explanation: "pd.qcut()按分位数进行等频分箱。" },
      { id: "q3", question: "对Series使用apply，函数的参数代表?", options: ["整个Series", "每个元素", "索引", "列名"], correctAnswer: 1, explanation: "Series.apply()的函数参数是Series的每个元素。" },
      { id: "q4", question: "对DataFrame使用apply并指定axis=1，函数的参数代表?", options: ["每一列", "每一行", "整个DataFrame", "单个单元格"], correctAnswer: 1, explanation: "axis=1表示按行应用，函数参数是每一行。" },
      { id: "q5", question: "lambda函数的正确写法是?", options: ["lambda x => x+1", "lambda x: x+1", "def lambda x: x+1", "lambda(x): x+1"], correctAnswer: 1, explanation: "lambda语法是 lambda 参数: 表达式。" },
      { id: "q6", question: "pd.cut()默认区间是?", options: ["左闭右开", "左开右闭", "全闭", "全开"], correctAnswer: 0, explanation: "pd.cut()默认是左闭右开区间，可通过right参数调整。" },
      { id: "q7", question: "分箱后的数据类型通常是?", options: ["int", "float", "category", "object"], correctAnswer: 2, explanation: "分箱结果默认是Categorical类型，节省内存且保持顺序。" },
      { id: "q8", question: ".applymap()的作用是?", options: ["对列应用函数", "对行应用函数", "对每个元素应用函数", "对索引应用函数"], correctAnswer: 2, explanation: "applymap()对DataFrame的每个单元格元素应用函数。" },
      { id: "q9", question: "使用自定义函数而非lambda，正确的写法是?", options: ["df['列'].apply(my_func)", "df['列'].apply(my_func())", "df['列'].apply(lambda: my_func)", "df['列'].apply(lambda x: my_func)"], correctAnswer: 0, explanation: "直接传入函数名即可，不用加括号。" },
      { id: "q10", question: "pd.qcut(q=4)会分成几份?", options: ["3份", "4份", "5份", "不确定"], correctAnswer: 1, explanation: "q=4表示按四分位数分箱，分成4份。" }
    ],
    funConcepts: [
      {
        title: "数据分箱 (Binning)",
        emoji: "📦",
        explanation: "分箱就像把连续的数字分到几个'箱子'里。比如把年龄分成0-18、18-30、30-50、50+四档，把连续数值变成离散分类，便于分析和建模。",
        example: "pd.cut(df['成绩'], bins=[0, 60, 75, 90, 100], labels=['不及格', '及格', '良好', '优秀']) — 把成绩分成四档。"
      },
      {
        title: "Apply函数思维",
        emoji: "🔧",
        explanation: "Apply就像给数据派一个工人，对每个元素执行同样的操作。可以把自定义函数应用到每一行、每一列或每个元素上，实现复杂的逻辑处理。",
        example: "df['列'].apply(lambda x: x.upper()) — 对每个元素执行操作，比写循环更简洁，性能也更好。"
      },
      {
        title: "Lambda匿名函数",
        emoji: "⚡",
        explanation: "Lambda是Python中的简洁函数写法，lambda x: x*2 就等于一个输入x、输出x*2的函数。它不需要def和函数名，适合在apply中做简单转换。",
        example: "df['销售额'].apply(lambda x: '高' if x > 10000 else '低') — 一行代码完成分类标记。"
      },
      {
        title: "等宽分箱 vs 等频分箱",
        emoji: "🎯",
        explanation: "pd.cut()是等宽分箱：每个箱子宽度相同（如0-25, 25-50...）；pd.qcut()是等频分箱：每个箱子数据量相同（如每25%数据一个箱）。根据业务需求选择。",
        example: "收入数据用qcut：每25%人口一档，避免因高收入者极端值导致大多数人挤在'低收入'档。"
      }
    ],
    puzzlePieces: [
      { name: "pd.cut()", description: "等宽分箱（每个区间宽度相同）" },
      { name: "pd.qcut()", description: "等频分箱（每个区间数据量相同）" },
      { name: ".apply()", description: "对行/列应用自定义函数" },
      { name: "df.apply(lambda x: ...)", description: "使用lambda做简单转换" },
      { name: "df.applymap()", description: "对每个元素应用函数" },
      { name: ".map()", description: "按字典映射替换值" },
      { name: ".astype()", description: "转换列的数据类型" },
      { name: "df.eval()", description: "用字符串表达式计算新列" }
    ]
  },
  {
    id: "10",
    title: "多重索引与数据重塑",
    difficulty: "hard",
    description: "使用多重索引和数据重塑操作。",
    requirements: "1. 创建多重索引DataFrame\n2. 使用stack()和unstack()进行数据重塑\n3. 使用melt()函数将宽格式数据转换为长格式",
    hints: ["MultiIndex", ".stack()", ".unstack()", ".melt()"],
    testData: `{
      "班级": ["一班", "一班", "二班", "二班"],
      "性别": ["男", "女", "男", "女"],
      "语文": [85, 90, 88, 92],
      "数学": [92, 88, 90, 95],
      "英语": [88, 92, 90, 85]
    }`,
    expectedOutput: "多重索引和数据重塑结果",
    solution: `import pandas as pd
data = {"班级": ["一班", "一班", "二班", "二班"], "性别": ["男", "女", "男", "女"], "语文": [85, 90, 88, 92], "数学": [92, 88, 90, 95], "英语": [88, 92, 90, 85]}
df = pd.DataFrame(data)
print("原始数据:")
print(df)
df_multi = df.set_index(['班级', '性别'])
print("多重索引:")
print(df_multi)
print("stack:")
print(df_multi.stack())
print("unstack:")
print(df_multi.stack().unstack(level=1))
print("melt转换:")
print(df.melt(id_vars=['班级', '性别'], var_name='科目', value_name='成绩'))`,
    learningContent: {
      concept: "多重索引与数据重塑",
      explanation: "多重索引(MultiIndex)支持层次化数据结构，可以在一个轴上拥有多个索引级别。stack/unstack在长格式和宽格式间转换，melt()将宽表变成长表。这些是数据重塑的核心工具，用于调整数据结构以适应不同的分析需求。",
      keyPoints: [
        ".set_index([列1, 列2])创建多重索引，支持单列和多列",
        ".stack()将列旋转为行索引，数据从宽变长",
        ".unstack()将行索引旋转为列，数据从长变宽",
        ".melt()将宽格式转为长格式，便于某些分析和可视化",
        "level参数指定操作哪一层索引，从0开始计数",
        ".swaplevel()交换索引层级的顺序",
        ".sort_index()对多重索引进行排序",
        "访问多重索引使用元组：df.loc[(值1, 值2)]"
      ],
      examples: [
        "创建多重索引: df.set_index(['a', 'b'])",
        "stack: df.stack()",
        "unstack指定层: df.unstack(level=0)",
        "melt: df.melt(id_vars=['id'], var_name='变量', value_name='值')",
        "访问多重索引: df.loc[('行值1', '行值2'), '列名']",
        "交换层级: df.swaplevel(0, 1)",
        "排序索引: df.sort_index(level=0)",
        "创建MultiIndex对象: pd.MultiIndex.from_tuples([('a', 1), ('a', 2)])",
        "重命名层级: df.index.set_names(['层1', '层2'])"
      ]
    },
    questions: [
      { id: "q1", question: "将列索引旋转为行索引，使用哪个方法?", options: [".stack()", ".unstack()", ".melt()", ".pivot()"], correctAnswer: 0, explanation: "stack()将列折叠到行索引，数据从宽变长。" },
      { id: "q2", question: "将行索引旋转为列索引，使用哪个方法?", options: [".stack()", ".unstack()", ".melt()", ".pivot()"], correctAnswer: 1, explanation: "unstack()将行索引展开为列，数据从长变宽。" },
      { id: "q3", question: "创建多重索引，正确的写法是?", options: ["df.set_index(['列1', '列2'])", "df.multi_index(['列1', '列2'])", "df.index = ['列1', '列2']", "pd.MultiIndex(df, ['列1', '列2'])"], correctAnswer: 0, explanation: "向set_index传入列名列表即可创建多重索引。" },
      { id: "q4", question: "melt()的id_vars参数作用是?", options: ["指定保留为标识符的列", "指定要融化的列", "指定值列名", "指定变量列名"], correctAnswer: 0, explanation: "id_vars指定保持不变的标识符列。" },
      { id: "q5", question: "访问多重索引的正确写法是?", options: ["df.loc['值1', '值2']", "df.loc[('值1', '值2')]", "df.loc['值1']['值2']", "以上都可以"], correctAnswer: 3, explanation: "多重索引支持多种访问方式，推荐使用元组方式。" },
      { id: "q6", question: ".swaplevel()的作用是?", options: ["交换索引的层级", "交换行和列", "删除一级索引", "添加一级索引"], correctAnswer: 0, explanation: "swaplevel()可以交换多重索引的层级顺序。" },
      { id: "q7", question: "将宽格式转为长格式，使用哪个函数?", options: ["pd.stack()", "pd.unstack()", "pd.melt()", "pd.wide_to_long()"], correctAnswer: 2, explanation: "pd.melt()专门用于将宽表转为长表。" },
      { id: "q8", question: "melt()的var_name参数作用是?", options: ["指定标识符列名", "指定变量列名", "指定值列名", "指定索引名"], correctAnswer: 1, explanation: "var_name指定存储原列名的列名，默认为'variable'。" },
      { id: "q9", question: ".unstack()默认操作哪一层索引?", options: ["第0层", "最后一层", "中间层", "随机层"], correctAnswer: 1, explanation: "unstack()默认操作最内层(最后一层)索引。" },
      { id: "q10", question: ".sort_index()在多重索引中默认?", options: ["按第0层排序", "按最后一层排序", "按所有层排序", "不排序"], correctAnswer: 0, explanation: "默认level=0，按第一层索引排序。" }
    ],
    funConcepts: [
      {
        title: "层级索引 (Hierarchical Index)",
        emoji: "🗂️",
        explanation: "多重索引就像文件系统的文件夹结构：主文件夹下有子文件夹，子文件夹里才是文件。DataFrame中，索引也可以有多层，如'班级→学号'，先按班级分，再按学号分。",
        example: "df.set_index(['班级', '学号']) — 班级是外层索引，学号是内层索引。可以用df.loc['一班']看到一班所有学生。"
      },
      {
        title: "堆叠 (Stack) 与反堆叠 (Unstack)",
        emoji: "📐",
        explanation: "stack把列名'压'成行索引的一部分（数据从宽变长）；unstack把行索引'抬'成列名（数据从长变宽）。它们是相反操作，类似把表格旋转。",
        example: "stack：把[姓名, 语文, 数学]变成[姓名, 科目, 分数]的长格式；unstack：再转回去，让科目重新变成列。"
      },
      {
        title: "宽格式 vs 长格式",
        emoji: "📏",
        explanation: "宽格式：每个变量是一列（如语文、数学、英语各一列），适合人看；长格式：一列存变量名、一列存值，适合机器学习和某些分析场景。",
        example: "宽格式：张三, 90, 85, 88 → 长格式：张三, 语文, 90；张三, 数学, 85；张三, 英语, 88。"
      },
      {
        title: "Melt融化函数",
        emoji: "🔥",
        explanation: "melt()专门用来把宽格式'融化'成长格式。id_vars保留不动的列（如学号），var_name存原来的列名（如科目），value_name存值（如分数）。",
        example: "df.melt(id_vars=['姓名'], var_name='科目', value_name='分数') — 姓名保留，其他学科列被融化成科目和分数两列。"
      }
    ],
    puzzlePieces: [
      { name: "df.set_index([col1, col2])", description: "创建多重层级索引" },
      { name: ".loc[(level1, level2)]", description: "按多层索引定位数据" },
      { name: ".stack()", description: "列转为行索引（宽→长）" },
      { name: ".unstack()", description: "行索引转为列（长→宽）" },
      { name: "pd.melt()", description: "宽格式转为长格式" },
      { name: "df.swaplevel()", description: "交换两层索引的顺序" },
      { name: ".reset_index(level=1)", description: "把指定层索引转回普通列" },
      { name: ".xs(key, level=...)", description: "按指定层筛选数据" }
    ]
  }
];

export const caseStudy: CaseStudy = {
  id: "case-study",
  title: "电商销售数据分析综合实战",
  difficulty: "hard",
  steps: [
    {
      id: "1",
      title: "数据加载与初步观察",
      description: "读取电商销售数据并查看数据概况。",
      score: 10,
      testData: `{
        "订单ID": ["1001", "1002", "1003", "1004", "1005", "1006", "1007", "1008"],
        "日期": ["2023-01-01", "2023-01-02", "2023-01-03", "2023-01-04", "2023-01-05", "2023-01-06", "2023-01-07", "2023-01-08"],
        "地区": ["北京", "上海", "广州", "深圳", "北京", "上海", "广州", "深圳"],
        "类别": ["电子产品", "服装", "食品", "电子产品", "服装", "食品", "电子产品", "服装"],
        "销售额": [10000, 5000, 3000, 12000, 6000, 2500, 11000, 5500],
        "利润": [2000, 1000, 600, 2400, 1200, 500, 2200, 1100]
      }`,
      expectedOutput: "数据加载完成，显示数据基本信息",
      solution: `import pandas as pd

# 加载数据
data = {
    "订单ID": ["1001", "1002", "1003", "1004", "1005", "1006", "1007", "1008"],
    "日期": ["2023-01-01", "2023-01-02", "2023-01-03", "2023-01-04", "2023-01-05", "2023-01-06", "2023-01-07", "2023-01-08"],
    "地区": ["北京", "上海", "广州", "深圳", "北京", "上海", "广州", "深圳"],
    "类别": ["电子产品", "服装", "食品", "电子产品", "服装", "食品", "电子产品", "服装"],
    "销售额": [10000, 5000, 3000, 12000, 6000, 2500, 11000, 5500],
    "利润": [2000, 1000, 600, 2400, 1200, 500, 2200, 1100]
}
df = pd.DataFrame(data)

# 查看数据前5行
print("数据前5行:")
print(df.head())

# 查看数据基本信息
print("")\nprint("数据基本信息:")
df.info()

# 查看数据统计描述
print("")\nprint("数据统计描述:")
print(df.describe())

# 查看数据形状
print("")\nprint("数据形状:", df.shape)`
    },
    {
      id: "2",
      title: "数据清洗",
      description: "处理数据中的缺失值、异常值和重复数据。",
      score: 10,
      testData: `{
        "订单ID": ["1001", "1002", "1003", "1004", "1005", "1006", "1007", "1008", "1009"],
        "日期": ["2023-01-01", "2023-01-02", "2023-01-03", "2023-01-04", "2023-01-05", "2023-01-06", "2023-01-07", "2023-01-08", null],
        "地区": ["北京", "上海", "广州", "深圳", "北京", "上海", "广州", "深圳", "北京"],
        "类别": ["电子产品", "服装", "食品", "电子产品", "服装", "食品", "电子产品", "服装", "电子产品"],
        "销售额": [10000, 5000, 3000, 12000, 6000, 2500, 11000, 5500, 99999],
        "利润": [2000, 1000, 600, 2400, 1200, 500, 2200, 1100, null]
      }`,
      expectedOutput: "数据清洗完成，处理了缺失值和异常值",
      solution: `import pandas as pd

# 加载数据
data = {
    "订单ID": ["1001", "1002", "1003", "1004", "1005", "1006", "1007", "1008", "1009"],
    "日期": ["2023-01-01", "2023-01-02", "2023-01-03", "2023-01-04", "2023-01-05", "2023-01-06", "2023-01-07", "2023-01-08", None],
    "地区": ["北京", "上海", "广州", "深圳", "北京", "上海", "广州", "深圳", "北京"],
    "类别": ["电子产品", "服装", "食品", "电子产品", "服装", "食品", "电子产品", "服装", "电子产品"],
    "销售额": [10000, 5000, 3000, 12000, 6000, 2500, 11000, 5500, 99999],
    "利润": [2000, 1000, 600, 2400, 1200, 500, 2200, 1100, None]
}
df = pd.DataFrame(data)

# 检测缺失值
print("缺失值检测:")
print(df.isnull())

# 处理缺失值
print("")\nprint("处理缺失值:")
# 删除日期缺失的行
df = df.dropna(subset=['日期'])
# 用均值填充利润缺失值
df['利润'] = df['利润'].fillna(df['利润'].mean())
print(df)

# 检测异常值
print("")\nprint("检测销售额异常值:")
# 使用IQR方法检测异常值
Q1 = df['销售额'].quantile(0.25)
Q3 = df['销售额'].quantile(0.75)
IQR = Q3 - Q1
lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

outliers = df[(df['销售额'] < lower_bound) | (df['销售额'] > upper_bound)]
print("异常值:")
print(outliers)

# 处理异常值
print("")\nprint("处理异常值:")
# 移除异常值
df = df[(df['销售额'] >= lower_bound) & (df['销售额'] <= upper_bound)]
print(df)

# 检测重复数据
print("")\nprint("重复数据检测:")
print("重复行数:", df.duplicated().sum())`
    },
    {
      id: "3",
      title: "数据探索分析",
      description: "按类别和地区分组统计销售额和利润。",
      score: 10,
      testData: `{
        "订单ID": ["1001", "1002", "1003", "1004", "1005", "1006", "1007", "1008"],
        "日期": ["2023-01-01", "2023-01-02", "2023-01-03", "2023-01-04", "2023-01-05", "2023-01-06", "2023-01-07", "2023-01-08"],
        "地区": ["北京", "上海", "广州", "深圳", "北京", "上海", "广州", "深圳"],
        "类别": ["电子产品", "服装", "食品", "电子产品", "服装", "食品", "电子产品", "服装"],
        "销售额": [10000, 5000, 3000, 12000, 6000, 2500, 11000, 5500],
        "利润": [2000, 1000, 600, 2400, 1200, 500, 2200, 1100]
      }`,
      expectedOutput: "按类别和地区分组的统计结果",
      solution: `import pandas as pd

# 加载数据
data = {
    "订单ID": ["1001", "1002", "1003", "1004", "1005", "1006", "1007", "1008"],
    "日期": ["2023-01-01", "2023-01-02", "2023-01-03", "2023-01-04", "2023-01-05", "2023-01-06", "2023-01-07", "2023-01-08"],
    "地区": ["北京", "上海", "广州", "深圳", "北京", "上海", "广州", "深圳"],
    "类别": ["电子产品", "服装", "食品", "电子产品", "服装", "食品", "电子产品", "服装"],
    "销售额": [10000, 5000, 3000, 12000, 6000, 2500, 11000, 5500],
    "利润": [2000, 1000, 600, 2400, 1200, 500, 2200, 1100]
}
df = pd.DataFrame(data)

# 按类别分组统计
print("按类别分组统计:")
category_stats = df.groupby('类别').agg({
    '销售额': ['sum', 'mean'],
    '利润': ['sum', 'mean']
})
print(category_stats)

# 按地区分组统计
print("")\nprint("按地区分组统计:")
region_stats = df.groupby('地区').agg({
    '销售额': ['sum', 'mean'],
    '利润': ['sum', 'mean']
})
print(region_stats)

# 按类别和地区分组统计
print("")\nprint("按类别和地区分组统计:")
category_region_stats = df.groupby(['类别', '地区']).agg({
    '销售额': 'sum',
    '利润': 'sum'
})
print(category_region_stats)

# 计算利润率
print("")\nprint("计算各地区利润率:")
df['利润率'] = (df['利润'] / df['销售额']) * 100
region_profit_margin = df.groupby('地区')['利润率'].mean()
print(region_profit_margin)`
    },
    {
      id: "4",
      title: "时间趋势分析",
      description: "按月统计销售趋势。",
      score: 10,
      testData: `{
        "订单ID": ["1001", "1002", "1003", "1004", "1005", "1006", "1007", "1008", "1009", "1010", "1011", "1012"],
        "日期": ["2023-01-01", "2023-01-15", "2023-02-01", "2023-02-15", "2023-03-01", "2023-03-15", "2023-04-01", "2023-04-15", "2023-05-01", "2023-05-15", "2023-06-01", "2023-06-15"],
        "销售额": [10000, 12000, 11000, 13000, 12500, 14000, 13500, 15000, 14500, 16000, 15500, 17000]
      }`,
      expectedOutput: "按月统计的销售趋势",
      solution: `import pandas as pd

# 加载数据
data = {
    "订单ID": ["1001", "1002", "1003", "1004", "1005", "1006", "1007", "1008", "1009", "1010", "1011", "1012"],
    "日期": ["2023-01-01", "2023-01-15", "2023-02-01", "2023-02-15", "2023-03-01", "2023-03-15", "2023-04-01", "2023-04-15", "2023-05-01", "2023-05-15", "2023-06-01", "2023-06-15"],
    "销售额": [10000, 12000, 11000, 13000, 12500, 14000, 13500, 15000, 14500, 16000, 15500, 17000]
}
df = pd.DataFrame(data)

# 将日期转换为日期时间类型
df['日期'] = pd.to_datetime(df['日期'])

# 设置日期为索引
df.set_index('日期', inplace=True)

# 按月重采样并计算总销售额
print("按月统计销售趋势:")
monthly_sales = df.resample('M').sum()
print(monthly_sales)

# 计算月度销售增长率
print("")\nprint("月度销售增长率:")
monthly_sales['增长率'] = monthly_sales['销售额'].pct_change() * 100
print(monthly_sales)

# 计算累计销售额
print("")\nprint("累计销售额:")
monthly_sales['累计销售额'] = monthly_sales['销售额'].cumsum()
print(monthly_sales)`
    },
    {
      id: "5",
      title: "数据可视化与结论",
      description: "绘制销售趋势图和地区销售分布图，并撰写分析结论。",
      score: 10,
      testData: `{
        "订单ID": ["1001", "1002", "1003", "1004", "1005", "1006", "1007", "1008"],
        "日期": ["2023-01-01", "2023-01-02", "2023-01-03", "2023-01-04", "2023-01-05", "2023-01-06", "2023-01-07", "2023-01-08"],
        "地区": ["北京", "上海", "广州", "深圳", "北京", "上海", "广州", "深圳"],
        "类别": ["电子产品", "服装", "食品", "电子产品", "服装", "食品", "电子产品", "服装"],
        "销售额": [10000, 5000, 3000, 12000, 6000, 2500, 11000, 5500],
        "利润": [2000, 1000, 600, 2400, 1200, 500, 2200, 1100]
      }`,
      expectedOutput: "数据可视化图表和分析结论",
      solution: `import pandas as pd
import matplotlib.pyplot as plt

# 加载数据
data = {
    "订单ID": ["1001", "1002", "1003", "1004", "1005", "1006", "1007", "1008"],
    "日期": ["2023-01-01", "2023-01-02", "2023-01-03", "2023-01-04", "2023-01-05", "2023-01-06", "2023-01-07", "2023-01-08"],
    "地区": ["北京", "上海", "广州", "深圳", "北京", "上海", "广州", "深圳"],
    "类别": ["电子产品", "服装", "食品", "电子产品", "服装", "食品", "电子产品", "服装"],
    "销售额": [10000, 5000, 3000, 12000, 6000, 2500, 11000, 5500],
    "利润": [2000, 1000, 600, 2400, 1200, 500, 2200, 1100]
}
df = pd.DataFrame(data)

# 按日期统计销售额
print("按日期统计销售额:")
daily_sales = df.groupby('日期')['销售额'].sum()
print(daily_sales)

# 按地区统计销售额
print("")\nprint("按地区统计销售额:")
region_sales = df.groupby('地区')['销售额'].sum()
print(region_sales)

# 按类别统计销售额
print("")\nprint("按类别统计销售额:")
category_sales = df.groupby('类别')['销售额'].sum()
print(category_sales)

# 绘制销售趋势图
print("")\nprint("绘制销售趋势图...")
plt.figure(figsize=(10, 6))
daily_sales.plot(kind='line', marker='o')
plt.title('每日销售趋势')
plt.xlabel('日期')
plt.ylabel('销售额')
plt.grid(True)
plt.show()

# 绘制地区销售分布图
print("")\nprint("绘制地区销售分布图...")
plt.figure(figsize=(10, 6))
region_sales.plot(kind='bar')
plt.title('各地区销售额分布')
plt.xlabel('地区')
plt.ylabel('销售额')
plt.show()

# 绘制类别销售分布图
print("")\nprint("绘制类别销售分布图...")
plt.figure(figsize=(10, 6))
category_sales.plot(kind='pie', autopct='%1.1f%%')
plt.title('各类别销售额占比')
plt.show()

# 分析结论
print("")\nprint("分析结论:")
print("1. 销售额呈上升趋势，特别是电子产品类别表现最佳")
print("2. 深圳地区销售额最高，北京次之")
print("3. 电子产品类别贡献了大部分销售额和利润")
print("4. 食品类别销售额较低，但利润率相对稳定")
print("5. 建议加大对电子产品的投入，同时优化食品类别的销售策略")`
    }
  ]
};