<template>
    <view class="create-question">
        <view class="form-item">
            <text>题目标题</text>
            <input v-model="questionTitle" placeholder="请输入题目标题" />
        </view>
        <view class="form-item">
            <text>所属标签</text>
            <picker
                mode="multiSelector"
                :range="tagOptions"
                :value="selectedTags"
                @change="handleTagChange"
            >
                <view class="picker">
                    {{ selectedTags.length > 0
                        ? selectedTags.map(index => tagOptions[0][index]).join(', ')
                        : '请选择标签' }}
                </view>
            </picker>
        </view>
        <view class="form-item">
            <text>题目答案</text>
            <textarea v-model="questionAnswer" placeholder="请输入题目答案" auto-height />
        </view>
        <button class="submit-btn" @click="submitQuestion">提交题目</button>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 模拟标签数据
const tagOptions = ref([['标签1', '标签2', '标签3', '标签4', '标签5']]);
const questionTitle = ref('');
const selectedTags = ref<number[]>([]);
const questionAnswer = ref('');

// 处理标签选择变化
const handleTagChange = (e: any) => {
    selectedTags.value = e.detail.value;
};

// 提交题目
const submitQuestion = () => {
    // 这里可以实现提交题目的逻辑
    console.log('题目标题:', questionTitle.value);
    console.log('所选标签:', selectedTags.value.map(index => tagOptions.value[0][index]));
    console.log('题目答案:', questionAnswer.value);
    // 提交成功后返回上一页
    uni.navigateBack();
};
</script>

<style scoped>
.create-question {
    padding: 20px;
}

.form-item {
    margin-bottom: 20px;
}

.form-item text {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
}

.picker {
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 5px;
}

textarea {
    width: calc(100% - 20px);
    border: 1px solid #eee;
    border-radius: 5px;
    padding: 10px;
}

.submit-btn {
    background-color: #07c160;
    color: white;
    border-radius: 5px;
}
</style>