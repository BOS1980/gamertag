# Gamertag Generator 需求文档

> 版本：v1.0 | 日期：2026-02-12

---

## 1. 项目概述

### 1.1 产品定位

Gamertag Generator 是一个纯前端的游戏昵称生成器网页工具。用户无需注册登录，打开即用，通过选择风格、性别等偏好，一键批量生成具有游戏气质的英文昵称（如 `ShadowKing42`、`IronPhantom99`）。

### 1.2 目标用户

面向全球游戏玩家，包括但不限于：
- 注册新游戏账号时需要取名的玩家
- 想更换游戏昵称寻找灵感的玩家
- 游戏主播、YouTuber 等内容创作者

### 1.3 核心价值

- **快速**：无需注册，打开网页即可使用
- **个性化**：用户可在搜索框中输入自己的想法（如输入 "fire"），系统实时从词库中匹配相关词汇并生成昵称；同时支持风格、性别筛选
- **高质量词库**：约 500 个精选游戏风格词汇，组合产生大量独特昵称

## 2. 核心功能

### 2.1 搜索匹配生成

页面顶部提供一个搜索框，用户输入关键词（如 "shadow"、"king"、"fire"），系统从词库中模糊匹配并生成昵称列表。

**匹配规则：**
- 对词库中每个词进行子字符串匹配（不区分大小写）
- 匹配到的词优先参与组合生成
- **若用户输入的词在词库中无匹配**，则将用户输入的词直接作为形容词或名词参与拼接。例如用户输入 "fire"，词库中没有该词，则生成 `FireKing42`、`ShadowFire77` 等
- 搜索框为空时，从全词库随机生成

### 2.2 批量生成

每次生成 8-10 个 gamertag 供用户挑选，格式为：

```
形容词 + 名词 + 数字 → ShadowKing42
```

- 首字母大写拼接（PascalCase）
- 用户点击"Generate"按钮触发生成（搜索框有内容时基于匹配结果，无内容时随机）

### 2.3 风格筛选

提供 6 个风格标签，用户可单选或多选来限定词库范围：

| 风格 | 示例词汇 |
|------|---------|
| Dark（暗黑） | Shadow, Phantom, Reaper, Demon |
| Power（力量） | Iron, Storm, Thunder, Titan |
| Sci-Fi（科幻） | Cosmic, Cyber, Nova, Quantum |
| Fantasy（奇幻） | Dragon, Knight, Phoenix, Mystic |
| Humor（幽默） | Silly, Chunky, Sneaky, Wobble |
| Legend（传奇） | Epic, Supreme, Immortal, Glory |

### 2.4 性别筛选

提供 3 个选项：
- **Masculine**（阳刚）：King, Warrior, Titan 等
- **Feminine**（柔美）：Crystal, Luna, Seraph 等
- **Neutral**（中性）：Shadow, Storm, Phoenix 等（默认选中）

默认不限制性别（显示全部词汇），用户可选择偏好进行筛选。

### 2.5 一键复制

用户点击任意一个生成结果，即可将该 gamertag 复制到剪贴板，并显示"Copied!"提示。

## 3. 词库设计

### 3.1 词库结构

词库分为两个独立数组，存放在 `words.js` 文件中：

- **形容词表（adjectives）**：约 250 个词
- **名词表（nouns）**：约 250 个词

每个词条包含以下字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| `word` | string | 英文单词，首字母大写，如 `"Shadow"` |
| `style` | string | 所属风格，取值见 3.2 |
| `gender` | string | 性别倾向：`"masculine"` / `"feminine"` / `"neutral"` |

示例：
```js
{ word: "Shadow",  style: "dark",    gender: "neutral" }
{ word: "Iron",    style: "power",   gender: "masculine" }
{ word: "Crystal", style: "fantasy", gender: "feminine" }
```

### 3.2 风格分类

每个词归属一个主风格：

| 风格 ID | 名称 | 形容词示例 | 名词示例 |
|---------|------|-----------|---------|
| `dark` | Dark（暗黑） | Shadow, Dark, Silent, Grim, Cursed | Phantom, Reaper, Demon, Raven, Wraith |
| `power` | Power（力量） | Iron, Mighty, Savage, Brutal, Raging | Titan, Warrior, Crusher, Beast, Hammer |
| `scifi` | Sci-Fi（科幻） | Cosmic, Cyber, Neon, Quantum, Atomic | Nova, Hacker, Drone, Circuit, Android |
| `fantasy` | Fantasy（奇幻） | Mystic, Ancient, Arcane, Crystal, Enchanted | Dragon, Knight, Phoenix, Wizard, Elf |
| `humor` | Humor（幽默） | Silly, Chunky, Sneaky, Wobble, Funky | Potato, Noodle, Penguin, Muffin, Llama |
| `legend` | Legend（传奇） | Epic, Supreme, Immortal, Glorious, Ultimate | King, Champion, Legend, Hero, Overlord |

### 3.3 性别分布

词库按性别大致分布如下：

- **Neutral（中性）**：约 60%，如 Shadow, Storm, Phoenix
- **Masculine（阳刚）**：约 25%，如 King, Warrior, Iron
- **Feminine（柔美）**：约 15%，如 Luna, Crystal, Seraph

中性词在任何性别筛选下均可使用。

### 3.4 组合能力

- 形容词 250 x 名词 250 x 数字 1000 = **6250 万种**可能组合
- 即使在单一风格下（约 40 词/类），仍有 40 x 40 x 1000 = **160 万种**组合

## 4. 交互流程

### 4.1 用户操作流程

```
打开页面
  │
  ├─→ （可选）在搜索框输入关键词，如 "fire"
  │     └─→ 词库有匹配则基于匹配词生成；无匹配则用户输入直接参与拼接
  │
  ├─→ （可选）选择风格标签（可多选）
  │
  ├─→ （可选）选择性别偏好
  │
  └─→ 点击 "Generate" 按钮
        │
        └─→ 页面下方显示 8-10 个生成结果（数字随机 0-999）
              │
              └─→ 点击某个结果 → 复制到剪贴板 → 显示 "Copied!"
```

### 4.2 页面布局（从上到下）

| 区域 | 内容 | 说明 |
|------|------|------|
| 标题区 | 应用名称 + 一句 slogan | 如 "Gamertag Generator — Find your gaming identity" |
| 搜索区 | 搜索输入框 | 占据页面显眼位置，placeholder 提示如 "Type a word like shadow, fire, king..." |
| 筛选区 | 风格标签 + 性别选择 | 风格标签为可点击的 pill/chip 样式，性别为单选按钮组 |
| 生成按钮 | "Generate" 按钮 | 醒目的主操作按钮 |
| 结果区 | 8-10 个 gamertag 卡片 | 卡片样式展示，hover 高亮，点击复制 |

### 4.3 交互细节

**搜索框行为：**
- 用户输入时不自动生成结果，仅在筛选区旁显示匹配词数（如 "12 words matched"）
- 用户点击 Generate 后基于当前搜索词 + 筛选条件生成结果
- 清空搜索框后回到全词库模式

**筛选联动：**
- 风格标签可多选，多选时取并集（任一风格的词都参与生成）
- 性别选择与风格筛选叠加生效
- 无任何筛选时，使用全部词库

**结果交互：**
- 生成结果以卡片网格展示
- 鼠标 hover 时卡片视觉反馈（如边框高亮或微抬起）
- 点击卡片将 gamertag 文本复制到剪贴板
- 复制后在卡片上短暂显示 "Copied!" 反馈（约 1.5 秒后消失）
- 再次点击 Generate 刷新全部结果

## 5. UI / 视觉要求

### 5.1 整体风格

- **暗色主题**为主，契合游戏氛围（深色背景 + 亮色文字）
- 视觉风格参考游戏 HUD / 电竞风格，带有科技感
- 字体选用无衬线字体，标题可使用粗体或游戏风格字体

### 5.2 配色方案

| 用途 | 颜色 | 说明 |
|------|------|------|
| 背景 | `#0a0a0f` ~ `#1a1a2e` | 深色底色 |
| 主文字 | `#e0e0e0` ~ `#ffffff` | 浅色高对比文字 |
| 强调色 | `#00d4ff`（电光蓝）或 `#7c3aed`（紫色） | 按钮、选中状态、hover 效果 |
| 卡片背景 | `#16213e` ~ `#1e293b` | 略浅于页面背景 |
| 成功提示 | `#10b981`（绿色） | "Copied!" 提示色 |

### 5.3 关键组件样式

**搜索框：**
- 大尺寸输入框，居中显示
- 半透明边框，focus 时强调色发光效果
- placeholder 文字提示："Type a word like shadow, fire, king..."

**风格标签：**
- pill / chip 样式，横排排列
- 未选中：半透明边框轮廓
- 选中：填充强调色背景

**性别选择：**
- 三个按钮式单选：Masculine / Feminine / Neutral
- 另加一个"All"选项为默认，表示不限制

**Generate 按钮：**
- 强调色背景，大尺寸，居中
- hover 时发光或放大效果
- 文字："Generate" 或搭配骰子图标

**结果卡片：**
- 网格布局（2 列或 3 列，响应式）
- 每张卡片显示一个 gamertag，字体较大居中
- hover 时边框高亮 + 微上浮（`transform: translateY(-2px)`）
- 点击后短暂变为绿色边框 + 显示 "Copied!"

### 5.4 响应式

- 桌面端：搜索框居中，结果区 3 列卡片
- 平板：结果区 2 列
- 手机：结果区单列，筛选标签可横向滚动

## 6. 技术约束

### 6.1 技术栈

- **纯前端实现**：HTML + CSS + JavaScript，无任何框架或构建工具
- **零依赖**：不引入第三方库
- **无后端**：所有逻辑在浏览器端完成，词库硬编码在 JS 文件中

### 6.2 文件结构

```
gamertag/
├── index.html      # 主页面结构
├── style.css       # 样式表
├── app.js          # 主逻辑（生成、筛选、搜索、复制）
└── words.js        # 词库数据（adjectives + nouns 数组）
```

### 6.3 浏览器兼容性

- 支持所有现代浏览器（Chrome、Firefox、Safari、Edge 最近 2 个大版本）
- 使用 `navigator.clipboard.writeText()` 实现复制功能
- 不需要兼容 IE

### 6.4 性能要求

- 页面加载后即可使用，无需等待异步资源
- 词库约 500 条数据，搜索筛选在前端内存中完成，无性能瓶颈
- 生成操作应在 16ms 内完成（一帧内响应）

### 6.5 部署

- 纯静态文件，可部署到任意静态托管服务（GitHub Pages、Vercel、Netlify 等）
- 无需构建步骤，直接上传文件即可运行
