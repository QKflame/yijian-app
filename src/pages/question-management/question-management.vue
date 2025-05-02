<template>
    <view class="question-management">
        <!-- 查询区域和搜索框 -->
        <view class="search-and-add">
            <view class="combined-search">
                <!-- 修改部分：移除 v-model，使用 :value 绑定值 -->
                <picker :value="searchType" range="{{ ['问题ID', '题目标题'] }}" @change="handleSearchTypeChange">
                    <view class="picker">{{ searchType === 0 ? '问题ID' : '题目标题' }}</view>
                </picker>
                <input
                    class="search-input"
                    v-model="searchKeyword"
                    :placeholder="searchType === 0 ? '根据题目ID搜索' : '根据题目标题搜索'"
                    @input="handleSearch"
                />
            </view>
        </view>

        <!-- 题目列表 -->
        <view class="question-list">
            <view v-for="question in paginatedQuestions" :key="question.id" class="question-item">
                <text>ID: {{ question.id }}</text>
                <text>标题: {{ question.title }}</text>
                <text>创建时间: {{ question.createTime }}</text>
                <text>修改时间: {{ question.updateTime }}</text>
            </view>
        </view>

        <!-- 分页组件 -->
        <view class="pagination">
            <button :disabled="currentPage === 1" @click="prevPage">上一页</button>
            <text>{{ currentPage }} / {{ totalPages }}</text>
            <button :disabled="currentPage === totalPages" @click="nextPage">下一页</button>
        </view>

        <!-- 固定在底部的新增按钮 -->
        <button class="fixed-add-btn" @click="handleAddQuestion">
            <image class="add-icon" src="/static/icons/add-icon.png" mode="aspectFit" />
            <text>新增题目</text>
        </button>
    </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// 模拟题目数据
const questions = ref([
    {
        id: 1,
        title: '题目1',
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:30:00'
    },
    {
        id: 2,
        title: '题目2',
        createTime: '2024-01-02 11:00:00',
        updateTime: '2024-01-02 11:15:00'
    },
    // 可以添加更多题目
]);

const searchType = ref(0); // 0 表示问题 ID，1 表示题目标题
const searchKeyword = ref('');
const currentPage = ref(1);
const pageSize = ref(10);

// 处理搜索类型切换
const handleSearchTypeChange = (e: any) => {
    searchType.value = e.detail.value;
    handleSearch();
};

// 处理搜索
const handleSearch = () => {
    currentPage.value = 1;
};

// 处理新增题目
const handleAddQuestion = () => {
    uni.navigateTo({
        url: '/pages/create-question/create-question'
    });
};

// 上一页
const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

// 下一页
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

// 过滤后的题目列表
const filteredQuestions = computed(() => {
    return questions.value.filter(question => {
        if (searchType.value === 0) {
            // 根据问题 ID 搜索
            return searchKeyword.value === '' || question.id.toString().includes(searchKeyword.value);
        } else {
            // 根据题目标题搜索
            return searchKeyword.value === '' || question.title.toLowerCase().includes(searchKeyword.value.toLowerCase());
        }
    });
});

// 总页数
const totalPages = computed(() => {
    return Math.ceil(filteredQuestions.value.length / pageSize.value);
});

// 分页后的题目列表
const paginatedQuestions = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filteredQuestions.value.slice(start, end);
});
</script>

<style scoped>
.question-management {
    background-color: #ffffff;
    min-height: 100vh;
    padding: 20px;
    /* 为底部按钮留出空间 */
    padding-bottom: 80px;
}

/* 移除原有的新增按钮样式 */
.add-question-btn {
    display: none;
}

.fixed-add-btn {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #07c160;
    color: #ffffff;
    border-radius: 50px;
    font-size: 16px;
    padding: 8px 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(7, 193, 96, 0.3);
    border: none;
}

.add-icon {
    width: 24px;
    height: 24px;
    margin-right: 8px;
}

.search-and-add {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 20px;
    gap: 10px;
}

.add-question-btn {
    background-color: #07c160;
    color: #ffffff;
    border-radius: 5px;
    font-size: 14px;
    padding: 1px 12px;
}

.combined-search {
    display: flex;
    align-items: center;
    width: 100%;
}

.search-input {
    flex: 1;
    min-width: 150px;
    margin: 5px;
    border: 1px solid #eeeeee;
    padding: 6px 12px;
    border-radius: 5px;
    font-size: 14px;
}

.question-list {
    background-color: #ffffff;
}

.question-item {
    padding: 20px;
    margin-bottom: 15px; /* 为每个卡片添加底部间距 */
    border: 1px solid #f2f2f2; /* 添加边框 */
    border-radius: 8px; /* 添加圆角 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* 添加阴影 */
    font-size: 16px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: #ffffff; /* 确保卡片背景为白色 */
    transition: box-shadow 0.3s ease; /* 添加过渡效果 */
}

.question-item:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); /* 鼠标悬停时增加阴影 */
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
}

.pagination button {
    margin: 0 10px;
    font-size: 14px; /* 保持字体大小一致 */
    padding: 0px 12px; /* 与标签管理页面按钮内边距一致 */
}

.combined-search {
    display: flex;
    align-items: center;
    flex: 1;
}

.combined-search .picker {
    padding: 7px 12px;
    border: 1px solid #eeeeee;
    border-right: none;
    border-radius: 5px 0 0 5px;
    font-size: 14px;
    background-color: #f5f5f5;
}

.combined-search .search-input {
    flex: 1;
    border-radius: 0 5px 5px 0;
    margin: 0;
}
</style>