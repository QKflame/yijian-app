<template>
    <view class="content">
        <!-- 用户信息区域 -->
        <view class="user-info">
            <view v-if="!isLoggedIn" class="user-detail-unlogged">
                <image src="/static/icons/avatar-placeholder.png" class="avatar placeholder" mode="aspectFill"></image>
                <view class="login-btn" @click="handleLogin">
                    <text>立即登录</text>
                </view>
            </view>
            <view v-else class="user-detail">
                <image :src="userInfo.avatarUrl" class="avatar" mode="aspectFill"></image>
                <text class="nickname">{{ userInfo.nickName }}</text>
            </view>
        </view>

        <!-- 菜单区域 -->
        <view class="menu-list">
            <view class="menu-item" @click="handleHistory">
                <image src="/static/icons/history.png" class="menu-icon" mode="aspectFit"></image>
                <text>历史记录</text>
            </view>
            <view class="menu-item" @click="handleFeedback">
                <image src="/static/icons/feedback.png" class="menu-icon" mode="aspectFit"></image>
                <text>反馈建议</text>
            </view>
            <view class="menu-item" @click="handleTagManagement">
                <image src="/static/icons/tag.png" class="menu-icon" mode="aspectFit"></image>
                <text>标签管理</text>
            </view>
            <!-- 新增题目管理菜单项 -->
            <view class="menu-item" @click="handleQuestionManagement">
                <image src="/static/icons/question.png" class="menu-icon" mode="aspectFit"></image>
                <text>题目管理</text>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// 检查用户是否登录
const isLoggedIn = ref(false);
const userInfo = ref({
    avatarUrl: '',
    nickName: ''
});

onMounted(() => {
    const storedUserInfo = uni.getStorageSync('userInfo');
    if (storedUserInfo) {
        isLoggedIn.value = true;
        userInfo.value = storedUserInfo;
    }
});

// 处理登录逻辑
const handleLogin = () => {
    uni.getUserProfile({
        desc: '用于完善会员资料',
        success: (res) => {
            userInfo.value = res.userInfo;
            isLoggedIn.value = true;
            // 存储用户信息到本地
            uni.setStorageSync('userInfo', res.userInfo);
        },
        fail: (error) => {
            console.error('登录失败', error);
        }
    });
};

// 处理反馈建议点击事件
const handleFeedback = () => {
    // 这里实现反馈建议的逻辑
    console.log('点击了反馈建议');
};

// 处理历史记录点击事件
const handleHistory = () => {
    // 这里实现历史记录的逻辑
    console.log('点击了历史记录');
};

// 处理标签管理点击事件
const handleTagManagement = () => {
    uni.navigateTo({
        url: '/pages/tag-management/tag-management'
    });
};

// 处理题目管理点击事件
const handleQuestionManagement = () => {
    // 这里可以实现跳转到题目管理页面或者其他逻辑
    console.log('点击了题目管理');
};
</script>

<style scoped>
.content {
    background-color: #f5f5f5;
    min-height: 100vh;
}

.user-info {
    background-color: #ffffff;
    padding: 20px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
}

.login-btn {
    background-color: #07c160;
    color: #ffffff;
    padding: 9px 16px;
    border-radius: 5px;
}

.user-detail {
    display: flex;
    flex-direction: row; /* 设置为水平布局 */
    align-items: center; /* 垂直居中 */
    width: 100%;
}

.user-detail-unlogged {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.placeholder {
    background-color: #e0e0e0; /* 占位图背景色，可根据需求调整 */
}

.avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
}

.nickname {
    font-size: 18px;
    font-weight: bold;
}

.menu-list {
    background-color: #ffffff;
}

.menu-item {
    padding: 20px;
    border-bottom: 1px solid #eeeeee;
    font-size: 16px;
    display: flex;
    align-items: center;
}

.menu-icon {
    width: 24px;
    height: 24px;
    margin-right: 15px;
}

.menu-item:last-child {
    border-bottom: none;
}
</style>
