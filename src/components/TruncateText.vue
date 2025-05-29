<template>
    <span class="truncated-text" :title="text">
        {{ truncatedText }}
    </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    text: {
        type: String,
        default: '',
    },
    maxLength: {
        type: Number,
        default: 20, // 超過20字就截斷，可調整
    },
});

const truncatedText = computed(() => {
    if (props.text.length > props.maxLength) {
        return props.text.slice(0, props.maxLength) + '...';
    }
    return props.text;
});
</script>

<style scoped>
.truncated-text {
    cursor: help;
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    max-width: 100%;
}
</style>
