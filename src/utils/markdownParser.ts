import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js';

// 创建 markdown-it 实例
const md = new MarkdownIt({
    html: false, // 允许 HTML 标签
    linkify: true, // 自动转换链接
    typographer: true, // 启用排版美化
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
            return '<pre class="yijian-code-block"><code>' +
                   hljs.highlight(str, { language: lang }).value +
                   '</code></pre>';
          } catch (__) {}
      }
      return '';
    },
  });

/** 解析 markdown 内容 */
export const parseMarkdown = (content: string) => {
    return md.render(content);
}