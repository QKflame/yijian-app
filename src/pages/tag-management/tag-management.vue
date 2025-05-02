<template>
    <view class="tag-management">
        <!-- 新增标签按钮和搜索框 -->
        <view class="search-and-add">
            <button class="add-tag-btn" @click="handleAddTag">新增标签</button>
            <input
                class="search-input"
                v-model="searchKeyword"
                placeholder="根据标签名称搜索"
                @input="handleSearch"
            />
        </view>

        <!-- 标签列表 -->
        <view class="tag-list">
            <view v-for="tag in paginatedTags" :key="tag.id" class="tag-card">
                <view class="tag-info">
                    <view>ID: {{ tag.id }}</view>
                    <view>名称: {{ tag.name }}</view>
                </view>
                <view class="btn-container">
                    <button class="delete-btn" @click="handleDeleteTag(tag.id)">删除</button>
                </view>
            </view>
        </view>

        <!-- 分页组件 -->
        <view class="pagination">
            <button :disabled="currentPage === 1" @click="prevPage">上一页</button>
            <text>{{ currentPage }} / {{ totalPages }}</text>
            <button :disabled="currentPage === totalPages" @click="nextPage">下一页</button>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// 模拟标签数据
const tags = ref([
    { id: 1, name: '标签1' },
    { id: 2, name: '标签2' },
    { id: 3, name: '标签3' },
    // 可以添加更多标签
]);

const searchKeyword = ref('');
const currentPage = ref(1);
const pageSize = ref(10);

// 处理搜索
const handleSearch = () => {
    currentPage.value = 1;
};

// 处理新增标签
const handleAddTag = () => {
    // 这里实现新增标签的逻辑
    console.log('点击了新增标签');
};

// 处理删除标签
const handleDeleteTag = (id: number) => {
    tags.value = tags.value.filter(tag => tag.id !== id);
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

// 过滤后的标签列表
const filteredTags = computed(() => {
    return tags.value.filter(tag =>
        tag.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    );
});

// 总页数
const totalPages = computed(() => {
    return Math.ceil(filteredTags.value.length / pageSize.value);
});

// 分页后的标签列表
const paginatedTags = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filteredTags.value.slice(start, end);
});
</script>

<style scoped>
.tag-management {
    background-color: #f9f9f9; /* 修改为原卡片背景颜色 */
    min-height: 100vh;
    padding: 20px;
}

.search-and-add {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.add-tag-btn {
    background-color: #07c160;
    color: #ffffff;
    border-radius: 5px;
    font-size: 14px; /* 减小字体大小 */
    padding: 1px 12px; /* 减小内边距 */
}

.search-input {
    flex: 1;
    margin-left: 10px;
    border: 1px solid #eeeeee;
    padding: 6px 12px; /* 减小内边距 */
    border-radius: 5px;
    font-size: 14px; /* 减小字体大小 */
}

.tag-list {
    position: relative;
}

.tag-item {
    padding: 20px 0;
    border-bottom: 1px solid #eeeeee;
    font-size: 16px;
    display: flex;
    flex-direction: column; /* 修改为垂直布局 */
    align-items: flex-start; /* 左对齐 */
    width: calc(100%-40px); /* 确保标签项占满容器宽度 */
}

.tag-info {
    display: flex;
    flex-direction: column; /* 修改为垂直布局 */
    gap: 10px; /* 增加行间距 */
    margin-bottom: 10px; /* 为删除按钮留出间距 */
}

.btn-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-direction: row;
    width: 100%; /* 确保按钮容器占满容器宽度 */
}

.delete-btn {
    background-color: #ff4d4f;
    color: #ffffff;
    border-radius: 5px;
    font-size: 14px;
    padding: 0px 24px;
    margin: 0;
    display: inline-block;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
}

.pagination button {
    margin: 0 10px;
    font-size: 14px; /* 减小字体大小 */
    padding: 0px 12px; /* 减小内边距 */
}

.tag-card {
    background-color: #ffffff; /* 修改为原页面背景颜色 */
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tag-item {
    padding: 0;
    border-bottom: none;
}

.tag-info {
    margin-bottom: 15px;
}
</style>