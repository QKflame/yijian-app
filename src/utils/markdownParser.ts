import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

// 创建 markdown-it 实例
const md = new MarkdownIt({
    html: false, // 允许 HTML 标签
    linkify: true, // 自动转换链接
    typographer: true, // 启用排版美化
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                const styleAttr = 'style="background-color: #f8f9fa; padding: 1em; border-radius: 4px; margin: 8px 0"';
                return (
                    `<pre  ${styleAttr} class="yijian-code-block"><code>` +
                    hljs.highlight(str, {language: lang}).value +
                    '</code></pre>'
                );
            } catch (__) {}
        }
        return '';
    }
});

md.renderer.rules.heading_open = function (tokens, idx, options, env, self) {
    const level = tokens[idx].level;
    // 增加 style 样式
    tokens[idx].attrPush(['style', `margin-top: 4px;margin-bottom:4px`]);
    return self.renderToken(tokens, idx, options);
};

// 给 p 标签插入 style
md.renderer.rules.paragraph_open = function (tokens, idx, options, env, self) {
    tokens[idx].attrPush(['style', `margin-top: 4px;margin-bottom:4px`]);
    return self.renderToken(tokens, idx, options);
};

/** 解析 markdown 内容 */
export const parseMarkdown = (content: string) => {
    return md.render(content);
};
