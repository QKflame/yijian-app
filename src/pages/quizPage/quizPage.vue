<template>
  <view class="content">
    <!-- 左侧侧拉抽屉 -->
    <view class="drawer" :class="{ 'drawer-open': showDrawer }">
      <view class="drawer-content">
        <view class="drawer-header">
          <text>题目列表</text>
          <view class="close-btn" @click="closeDrawer"> × </view>
        </view>
        <!-- 这里可以添加题目列表内容 -->
        <view class="question-list" scroll-y style="height: calc(100vh - 140px)">
          <!-- 示例题目列表 -->
          <view
            v-for="(question, index) in questionList"
            :key="index"
            @click="onClickQuestionItem(index)"
          >
            {{ question.title }}
          </view>
        </view>
      </view>
    </view>
    <!-- 透明遮罩层 -->
    <view v-if="showDrawer" class="mask" @click="closeDrawer"></view>

    <!-- 如果 questionList 为空，则显示空态 -->
    <view v-if="!questionList.length" class="empty-state">
      <image
        src="/static/icons/empty-state.png"
        mode="aspectFit"
        style="width: 100px; height: 100px"
      ></image>
      <text>暂无题目</text>
    </view>

    <view class="text-area" v-if="Boolean(parsedAnswer)">
      <!-- 显示题目 -->
      <!-- <rich-text :nodes="parsedQuestion" class="markdown-body"></rich-text> -->
      <view class="question-title">{{ parsedQuestion }}</view>

      <!-- 答案隐藏时的模糊遮罩 -->
      <view
        v-if="!showAnswer"
        class="hidden-answer-container"
        @click="toggleAnswerVisibility"
      >
        <view>
          <image
            src="/static/icons/eye.png"
            mode="aspectFit"
            style="width: 20px; height: 20px; margin-right: 10px"
          ></image>
          当前答案已隐藏
        </view>
      </view>

      <!-- 显示答案 -->
      <view class="answer-area" v-if="showAnswer">
        <rich-text :nodes="parsedAnswer" class="markdown-body"></rich-text>
      </view>
    </view>
    <!-- 底部操作栏 -->
    <view class="fixed-bottom-bar">
      <view class="bar-item" @click="showQuestionList">
        <image
          src="/static/icons/toolbar/question-list.png"
          mode="aspectFit"
          style="width: 24px; height: 24px"
        ></image>
        <text>题目列表</text>
      </view>
      <view class="bar-item" @click="toggleAnswerVisibility">
        <image
          v-if="showAnswer"
          src="/static/icons/toolbar/answer.png"
          mode="aspectFit"
          style="width: 24px; height: 24px"
        ></image>
        <image
          v-else
          src="/static/icons/toolbar/answer-light.png"
          mode="aspectFit"
          style="width: 24px; height: 24px"
        ></image>
        <text>{{ showAnswer ? "隐藏答案" : "显示答案" }}</text>
      </view>
      <view class="bar-item">
        <view class="prev-next-btn" @click="prevQuestion">
          <image
            src="/static/icons/toolbar/prev.png"
            mode="aspectFit"
            style="width: 24px; height: 24px"
          ></image>
          <text>上一题</text>
        </view>
        <view class="prev-next-btn" @click="nextQuestion">
          <image
            src="/static/icons/toolbar/prev.png"
            mode="aspectFit"
            style="width: 24px; height: 24px; transform: rotate(180deg)"
          ></image>
          <text>下一题</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import "highlight.js/styles/github.css";
import { parseMarkdown } from "@/utils/markdownParser";
import { apiHost } from "@/utils/global";
import { aesDecrypt } from "@/utils/aes";
const parsedQuestion = ref("");
const parsedAnswer = ref("");

// 控制抽屉显示
const showDrawer = ref(false);
// 模拟题目列表，现在改为通过接口获取
const questionList = ref<any[]>([]);

// 当前查看题目的索引
const currentQuestionIndex = ref(0);

onLoad((options: any) => {
  const { category } = options;
  if (category) {
    uni.showLoading({
      title: "加载中",
      mask: true,
    });
    uni.request({
      url: apiHost + "/api/questions/paginated",
      method: "GET",
      data: {
        page_no: 1,
        page_size: 1000,
        tag_key: category,
      },
      success: (res: any) => {
        if (res.statusCode === 200) {
          // 便利 res.data.data, 对 title 进行 aes 解密
          if (res?.data?.data?.length) {
            res.data.data.forEach((item: any) => {
              item.title = aesDecrypt(item.title);
            });
            questionList.value = res.data.data;
          }

          // 拿出 questionList 中的第一项，作为当前题目
          if (questionList.value.length > 0) {
            const firstQuestion = questionList.value[currentQuestionIndex.value];
            const { id, title } = firstQuestion;
            parsedQuestion.value = title;
            // 根据 id 查询对应的 answer
            uni.showLoading({
              title: "加载中...",
              mask: true,
            });
            uni.request({
              url: apiHost + "/api/questions/" + id,
              method: "GET",
              success: (res: any) => {
                if (res.statusCode === 200) {
                  let { answer } = res.data;
                  answer = aesDecrypt(answer);
                  parsedAnswer.value = parseMarkdown(answer);
                }
              },
              complete: () => {
                uni.hideLoading();
              },
            });
          }
        }
      },
      fail: (err) => {
        console.error("获取题目列表失败:", err);
      },
      complete: () => {
        uni.hideLoading();
      },
    });
  }
});

// 控制答案显示
const showAnswer = ref(true);

// 显示题目列表方法
const showQuestionList = () => {
  if (questionList.value.length === 0) {
    uni.showToast({
      title: "暂无题目",
      icon: "none",
    });
    return;
  }
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

// 查询题目详情
const queryQuestionDetail = (questionId: string) => {
  // 先从缓存中获取答案
  const cachedAnswer = uni.getStorageSync("question_" + questionId);
  if (cachedAnswer) {
    parsedAnswer.value = parseMarkdown(cachedAnswer);
    return;
  }
  uni.showLoading({
    title: "加载中...",
    mask: true,
  });
  uni.request({
    url: apiHost + "/api/questions/" + questionId,
    method: "GET",
    success: (res: any) => {
      if (res.statusCode === 200) {
        let { answer } = res.data;
        answer = aesDecrypt(answer);
        parsedAnswer.value = parseMarkdown(answer);
        uni.setStorageSync("question_" + questionId, answer);
      }
    },
    complete: () => {
      uni.hideLoading();
    },
  });
};

// 上一题方法
const prevQuestion = () => {
  if (currentQuestionIndex.value <= 0) {
    uni.showToast({
      title: "当前已是第一题",
      icon: "none",
    });
    return;
  }
  currentQuestionIndex.value--;
  const currentQuestion = questionList.value[currentQuestionIndex.value];
  const { id, title } = currentQuestion;
  parsedQuestion.value = title;
  queryQuestionDetail(id);
  // 滚动到页面顶部
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 100,
  });
};

// 下一题方法
const nextQuestion = () => {
  if (currentQuestionIndex.value >= questionList.value.length - 1) {
    uni.showToast({
      title: "当前已是最后一题",
      icon: "none",
    });
    return;
  }
  currentQuestionIndex.value++;
  const currentQuestion = questionList.value[currentQuestionIndex.value];
  const { id, title } = currentQuestion;
  parsedQuestion.value = title;
  queryQuestionDetail(id);
  // 滚动到页面顶部
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 100,
  });
};

const onClickQuestionItem = (index: number) => {
  currentQuestionIndex.value = index;
  const currentQuestion = questionList.value[currentQuestionIndex.value];
  const { id, title } = currentQuestion;
  parsedQuestion.value = title;
  queryQuestionDetail(id);
  closeDrawer();
  // 滚动到页面顶部
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 100,
  });
};
</script>

<style>
@import "../../static/styles/github-markdown-light.css";
/* 补充 empty-state 样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px; /* 可根据实际情况调整高度 */
  padding: 20px;
  text-align: center;
}

.empty-state image {
  margin-bottom: 15px;
}

.empty-state text {
  font-size: 16px;
  color: #666;
}
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
  /* background: linear-gradient(45deg, #ffebee, #f1f8e9, #f3e5f5); */
  background: #fff;
  /* 增加 blur 值以增强高斯模糊效果 */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px); /* 兼容 Safari */
  z-index: 10;
  border-radius: 6px;
}

.text-area {
  position: relative;
  /* 确保没有意外外的外边距影响定位 */
  margin: 0;
  /* 确保没有意外外的内边距影响定位 */
  padding: 0;
  box-sizing: border-box;
  width: 750rpx;
  padding: 0 32rpx;
}

.answer-area {
  max-width: 98vw;
  position: relative;
  /* 确保没有意外外的外边距影响定位 */
  margin: 0;
  /* 确保没有意外外的内边距影响定位 */
  padding: 0;
  margin-top: 8px;
}

.hidden-answer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.05);
  margin-top: 12px;
  padding: 60px 0;
  white-space: nowrap; /* 防止文本换行 */
}

.hidden-answer-container view {
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.3);
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
  white-space: nowrap; /* 防止文本换行 */
}

/* 新增 Markdown 样式 */
.markdown-body {
  margin-bottom: 12px;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}

/* 标题样式 */
.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-body h1 {
  padding-bottom: 0.3em;
  font-size: 2em;
  border-bottom: 1px solid #eaecef;
}

.markdown-body h2 {
  padding-bottom: 0.3em;
  font-size: 1.5em;
  border-bottom: 1px solid #eaecef;
}

.markdown-body h3 {
  font-size: 1.25em;
}

.markdown-body h4 {
  font-size: 1em;
}

.markdown-body h5 {
  font-size: 0.875em;
}

.markdown-body h6 {
  font-size: 0.85em;
  color: #6a737d;
}

/* 段落样式 */
.markdown-body p {
  margin-top: 0;
  margin-bottom: 16px;
}

/* 列表样式 */
.markdown-body ul,
.markdown-body ol {
  margin-top: 0;
  margin-bottom: 16px;
  padding-left: 2em;
}

/* 代码块样式 */
.markdown-body pre {
  margin-top: 0;
  margin-bottom: 16px;
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 3px;
}

.markdown-body code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27, 31, 35, 0.05);
  border-radius: 3px;
}

.markdown-body pre code {
  padding: 0;
  background-color: transparent;
}

/* 链接样式 */
.markdown-body a {
  color: #0366d6;
  text-decoration: none;
}

.markdown-body a:hover {
  text-decoration: underline;
}

.question-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  word-break: break-all;
  hyphens: auto;
  line-height: 1.5;
  width: 98vw;
}

.yijian-code-block {
  /* 强制所有内容换行（包括连续数字/字母） */
  word-break: break-all;
  /* 优先按单词换行，仅在必要时打断单词 */
  overflow-wrap: break-word;
  /* 保留代码缩进空格，同时允许自动换行 */
  white-space: pre-wrap;
  /* 解决长内容溢出问题 */
  max-width: 100%;
  overflow-x: auto;
}
.question-list {
  overflow-y: auto; /* 当内容超出高度时显示滚动条 */
  -webkit-overflow-scrolling: touch; /* 增强移动端滚动体验 */
}
</style>
