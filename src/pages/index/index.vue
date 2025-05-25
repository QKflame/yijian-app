<template>
  <view class="container">
    <!-- 左侧大分类 -->
    <view class="left-category">
      <scroll-view scroll-y>
        <view
          v-for="(category, index) in largeCategories"
          :key="index"
          :class="{ active: activeLargeCategory === index }"
          @click="changeLargeCategory(index)"
        >
          {{ category.name }}
        </view>
      </scroll-view>
    </view>
    <!-- 右侧小分类 -->
    <view class="right-category" style="width: 70%">
      <scroll-view scroll-y>
        <view
          v-for="(subCategory, index) in smallCategories"
          :key="index"
          @click="goToQuizPage(subCategory)"
        >
          <!-- 显示图标 -->
          <image
            :src="subCategory.icon"
            mode="aspectFit"
            style="width: 20px; height: 20px; margin-right: 10px"
          ></image>
          {{ subCategory.name }}
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 大分类数据，每个大分类包含对应的小分类，并添加图标信息
const largeCategories = ref([
  {
    name: "前端开发",
    subCategories: [
      { name: "HTML/CSS", icon: "/static/icons/html-icon.svg" },
      { name: "CSS", icon: "/static/icons/css-icon.svg" },
      { name: "Less", icon: "/static/icons/less-icon.svg" },
      { name: "JavaScript", icon: "/static/icons/javascript-icon.svg" },
      { name: "Typescript", icon: "/static/icons/typescript-icon.svg" },
      { name: "Vue.js", icon: "/static/icons/vue-icon.svg" },
      { name: "React", icon: "/static/icons/react-icon.svg" },
      { name: "Webpack", icon: "/static/icons/webpack-icon.svg" },
      { name: "Vite", icon: "/static/icons/vite-icon.svg" },
    ],
  },
  {
    name: "后端开发",
    subCategories: [
      { name: "Python", icon: "/static/icons/python-icon.svg" },
      { name: "Java", icon: "/static/icons/java-icon.svg" },
      { name: "Spring", icon: "/static/icons/spring-icon.svg" },
      { name: "Node.js", icon: "/static/icons/nodejs-icon.svg" },
      { name: "Go", icon: "/static/icons/go-icon.svg" },
    ],
  },
  {
    name: "数据库",
    subCategories: [
      { name: "MySQL", icon: "/static/icons/mysql-icon.svg" },
      { name: "MongoDB", icon: "/static/icons/mongodb-icon.svg" },
      { name: "Redis", icon: "/static/icons/redis-icon.svg" },
      { name: "PostgreSQL", icon: "/static/icons/postgresql-icon.svg" },
    ],
  },
]);

// 当前激活的大分类索引
const activeLargeCategory = ref(0);

// 右侧显示的小分类数据
const smallCategories = ref(
  largeCategories.value[activeLargeCategory.value].subCategories
);

// 切换大分类的方法
const changeLargeCategory = (index: number) => {
  activeLargeCategory.value = index;
  smallCategories.value = largeCategories.value[index].subCategories;
};

// 跳转到刷题页面的方法
const goToQuizPage = (subCategory: any) => {
  uni.navigateTo({
    url: `/pages/quizPage/quizPage?category=${encodeURIComponent(subCategory.name)}`,
  });
};
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  background-color: #f0f2f5; /* 整体背景色 */
}

.left-category,
.right-category {
  padding: 16px 8px;
  box-sizing: border-box;
  border-radius: 4px; /* 圆角 */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* 阴影效果 */
}

.left-category {
  background-color: #ffffff;
  width: 40%;
  margin: 8px;
  transition: all 0.3s ease; /* 过渡效果 */
}

.right-category {
  background-color: #ffffff;
  width: 60%;
  margin: 8px;
  margin-left: 0;
  transition: all 0.2s ease; /* 过渡效果 */
}

.left-category view {
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 2px;
}

.left-category view:hover {
  background-color: rgba(234, 122, 153, 0.1); /* 悬停背景色 */
}

.active {
  background-color: rgba(234, 122, 153, 0.1); /* 激活状态背景色 */
  color: #ea7a99;
  font-weight: bold;
}

.right-category view {
  padding: 12px;
  border-bottom: 1px solid #f2f2f2; /* 分割线 */
  display: flex; /* 添加弹性布局 */
  align-items: center; /* 垂直居中对齐 */
}

.right-category view:last-child {
  border-bottom: none; /* 最后一个元素去除分割线 */
}
</style>
