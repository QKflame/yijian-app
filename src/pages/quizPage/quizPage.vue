<template>
    <view class="content">
        <view class="text-area">
            <rich-text :nodes="parsedMarkdown" class="markdown-body"></rich-text>
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
                <image src="/static/icons/toolbar/answer.png" mode="aspectFit" style="width: 24px; height: 24px;"></image>
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
                    <image src="/static/icons/toolbar/next.png" mode="aspectFit" style="width: 24px; height: 24px;"></image>
                    <text>下一题</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
    import {ref, onMounted} from 'vue';
    import 'highlight.js/styles/github.css';
    import {parseMarkdown} from '@/utils/markdownParser';
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
    const parsedMarkdown = ref('');

    onMounted(() => {
        parsedMarkdown.value = parseMarkdown(markdownText.value);
    });

// 控制答案显示
const showAnswer = ref(false);

// 显示题目列表方法
const showQuestionList = () => {
    // 这里实现侧拉抽屉显示题目列表的逻辑
    console.log('显示题目列表');
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
    }

    .fixed-bottom-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #ffffff;
        box-shadow: 0 -2px 12px 0 rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: space-around;
        padding: 10px 0;
    }

    .bar-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
    }

    /* 修改上一题和下一题按钮的父元素样式 */
    .bar-item:nth-child(3) {
        flex-direction: row;
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
        margin: 0 10px;
    }
</style>
