<template>
    <view class="content">
        <view class="text-area">
            <rich-text :nodes="parsedMarkdown" class="markdown-body"></rich-text>
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
</script>

<style>
@import '../../static/styles/github-markdown-light.css';
    .content {
        box-sizing: border-box;
        padding: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>
