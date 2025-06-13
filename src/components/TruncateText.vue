<template>
    <v-tooltip location="top">
        <template #activator="{ props: tooltipProps }">
            <span
                class="truncated-text"
                v-bind="tooltipProps"
                :class="{ truncated: isTruncated }"
            >
                {{ truncatedText }}
            </span>
        </template>
        <span v-if="isTruncated">{{ text }}</span>
        <span v-else>無額外資訊</span>
    </v-tooltip>
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
        default: 20,
    },
});

const isTruncated = computed(() => props.text.length > props.maxLength);

const truncatedText = computed(() => {
    if (isTruncated.value) {
        return props.text.slice(0, props.maxLength) + '...';
    }
    return props.text;
});
</script>

<style scoped>
.truncated-text {
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    max-width: 100%;
}
.truncated {
    cursor: help;
}
</style>
