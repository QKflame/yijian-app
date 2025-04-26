<template>
    <view class="content">
        <!-- 左侧侧拉抽屉 -->
        <view
            class="drawer"
            :class="{ 'drawer-open': showDrawer }"
        >
            <view class="drawer-content">
                <view class="drawer-header">
                    <text>题目列表</text>
                    <view
                        class="close-btn"
                        @click="closeDrawer"
                    >
                        ×
                    </view>
                </view>
                <!-- 这里可以添加题目列表内容 -->
                <view class="question-list">
                    <!-- 示例题目列表 -->
                    <view v-for="(question, index) in questionList" :key="index">
                        题目 {{ index + 1 }}
                    </view>
                </view>
            </view>
        </view>
        <!-- 透明遮罩层 -->
        <view
            v-if="showDrawer"
            class="mask"
            @click="closeDrawer"
        ></view>

        <view class="text-area">
            <!-- 显示题目 -->
            <rich-text :nodes="parsedQuestion" class="markdown-body"></rich-text>
            <!-- 显示答案 -->
            <view class="answer-area">
                <rich-text :nodes="parsedAnswer" class="markdown-body"></rich-text>
                <!-- 答案隐藏时的模糊遮罩 -->
                <view
                    v-if="!showAnswer"
                    class="answer-mask"
                >
                    <view class="answer-hidden-tip">
                        <image src="/static/icons/toolbar/eye.png" mode="aspectFit" style="width: 20px; height: 20px; margin-right: 10px;"></image>
                        当前答案已隐藏
                    </view>
                </view>
            </view>
        </view>
        <!-- 底部操作栏 -->
        <view class="fixed-bottom-bar">
            <view
                class="bar-item"
                @click="showQuestionList"
            >
                <image src="/static/icons/toolbar/question-list.png" mode="aspectFit" style="width: 24px; height: 24px;"></image>
                <text>题目列表</text>
            </view>
            <view
                class="bar-item"
                @click="toggleAnswerVisibility"
            >
                <image
                    v-if="showAnswer"
                    src="/static/icons/toolbar/answer.png"
                    mode="aspectFit"
                    style="width: 24px; height: 24px;"
                ></image>
                <image
                    v-else
                    src="/static/icons/toolbar/answer-light.png"
                    mode="aspectFit"
                    style="width: 24px; height: 24px;"
                ></image>
                <text>{{ showAnswer ? '隐藏答案' : '显示答案' }}</text>
            </view>
            <view class="bar-item">
                <view
                    class="prev-next-btn"
                    @click="prevQuestion"
                >
                    <image src="/static/icons/toolbar/prev.png" mode="aspectFit" style="width: 24px; height: 24px;"></image>
                    <text>上一题</text>
                </view>
                <view
                    class="prev-next-btn"
                    @click="nextQuestion"
                >
                    <image src="/static/icons/toolbar/prev.png" mode="aspectFit" style="width: 24px; height: 24px; transform: rotate(180deg);"></image>
                    <text>下一题</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import 'highlight.js/styles/github.css';
import { parseMarkdown } from '@/utils/markdownParser';
const title = ref('Hello002');
const markdownText = ref(`# Markdown 测试文档

这是一个用于测试 Markdown 解析的文档，包含多种节点类型。

## 1. 标题示例

### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题

## 2. 段落示例

这是一个普通的段落。Markdown 是一种轻量级标记语言，常用于格式化文本。

## 3. 列表示例

### 无序列表
- 项目 1
- 项目 2
  - 子项目 2.1
  - 子项目 2.2
- 项目 3

### 有序列表
1. 第一项
2. 第二项
   1. 子项 2.1
   2. 子项 2.2
3. 第三项

## 4. 代码块示例

### JavaScript 代码
\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('World');`);
const parsedQuestion = ref('');
const parsedAnswer = ref('');

// 控制抽屉显示
const showDrawer = ref(false);
// 模拟题目列表
const questionList = ref([
    { id: 1, title: '题目 1' },
    { id: 2, title: '题目 2' },
    { id: 3, title: '题目 3' },
]);

onMounted(() => {
    const splitIndex = markdownText.value.indexOf('\n');
    const question = markdownText.value.slice(0, splitIndex);
    const answer = markdownText.value.slice(splitIndex + 1);
    parsedQuestion.value = parseMarkdown(question);
    parsedAnswer.value = parseMarkdown(answer);
});

// 控制答案显示
const showAnswer = ref(false);

// 显示题目列表方法
const showQuestionList = () => {
    showDrawer.value = true;
};

// 关闭抽屉方法
const closeDrawer = () => {
    showDrawer.value = false;
};

// 切换答案显示状态
const toggleAnswerVisibility = () => {
    showAnswer.value = !showAnswer.value;
};

// 上一题方法
const prevQuestion = () => {
    // 这里实现上一题的逻辑
    console.log('上一题');
};

// 下一题方法
const nextQuestion = () => {
    // 这里实现下一题的逻辑
    console.log('下一题');
};
</script>

<style>
@import '../../static/styles/github-markdown-light.css';
.content {
    box-sizing: border-box;
    padding: 16px;
    padding-bottom: 80px; /* 增加底部 padding 值，防止遮挡 */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow-x: hidden;
}

.fixed-bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #ffffff;
    box-shadow: 0 -2px 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-evenly;
    padding: 10px 0;
    z-index: 1001; /* 设置 z-index 大于遮罩层 */
}

.bar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    /* 确保每个按钮有相同的基础宽度 */
    flex: 1;
}

/* 修改上一题和下一题按钮的父元素样式 */
.bar-item:nth-child(3) {
    flex-direction: row;
    /* 让上一题和下一题按钮也平均分布在该区域 */
    justify-content: space-around;
}

.bar-item text {
    font-size: 12px;
    color: #333333;
    margin-top: 4px;
}

.prev-next-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* 让上一题和下一题按钮平均分配空间 */
    flex: 1;
}

/* 抽屉样式 */
.drawer {
    position: fixed;
    top: 0;
    left: -300px; /* 初始位置在屏幕左侧外 */
    width: 300px;
    height: 100vh;
    background-color: #ffffff;
    box-shadow: 2px 0 12px 0 rgba(0, 0, 0, 0.1);
    transition: left 0.3s ease;
    z-index: 1000;
}

.drawer-open {
    left: 0; /* 抽屉打开时显示在屏幕内 */
}

.drawer-content {
    padding: 16px;
}

.drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.close-btn {
    font-size: 24px;
    cursor: pointer;
}

.question-list view {
    padding: 8px;
    border-bottom: 1px solid #f2f2f2;
}

.question-list view:last-child {
    border-bottom: none;
}

/* 遮罩层样式 */
.mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3); /* 半透明黑色遮罩 */
    z-index: 999; /* 确保遮罩在抽屉下方，抽屉 z-index 为 1000 */
}

/* 答案隐藏时的模糊遮罩样式 */
.answer-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #ffebee, #f1f8e9, #f3e5f5);
    /* 增加 blur 值以增强高斯模糊效果 */
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px); /* 兼容 Safari */
    z-index: 10;
    border-radius: 6px;
}

.text-area {
    position: relative;
    /* 确保没有意外的外边距影响定位 */
    margin: 0;
    /* 确保没有意外的内边距影响定位 */
    padding: 0;
}

.answer-area {
    position: relative;
    /* 确保没有意外的外边距影响定位 */
    margin: 0;
    /* 确保没有意外的内边距影响定位 */
    padding: 0;
    margin-top: 8px;
}

/* 答案隐藏提示样式 */
.answer-hidden-tip {
    position: absolute;
    top: 200px;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.2);
    color: white;
    width: 190px;
    padding: 10px 20px;
    border-radius: 4px;
    z-index: 11; /* 确保提示在遮罩之上 */
    font-size: 16px;
    text-align: center;
    /* 确保不被其他样式影响宽度 */
    max-width: 80%;
    box-sizing: border-box;
    /* 添加 flexbox 布局实现水平居中 */
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap; /* 防止文本换行 */;
}

.markdown-body {
    margin-bottom: 12px;
}
</style>
