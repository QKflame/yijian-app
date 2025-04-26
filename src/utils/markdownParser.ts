import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js';

// 创建 markdown-it 实例
const md = new MarkdownIt({
    html: true, // 允许 HTML 标签
    linkify: true, // 自动转换链接
    typographer: true, // 启用排版美化
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (__) {}
      }
      return ''; // 使用默认的高亮处理
    },
  });

/** 解析 markdown 内容 */
export const parseMarkdown = (content: string) => {
    return md.render(content);
}