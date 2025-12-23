<script setup lang="ts">
import { computed } from "vue";
import { Progress } from "@/components/ui/progress";

interface Props {
    usedKb: number;
    limitKb: number;
}

const props = defineProps<Props>();

const percentage = computed(() => {
    if (props.limitKb <= 0) return 0;
    return Math.min(Math.round((props.usedKb / props.limitKb) * 100), 100);
});

const usedMb = computed(() => (props.usedKb / 1024).toFixed(1));
const limitMb = computed(() => (props.limitKb / 1024).toFixed(1));

const progressColor = computed(() => {
    if (percentage.value >= 90) return "bg-destructive";
    if (percentage.value >= 70) return "bg-yellow-500";
    return "";
});
</script>

<template>
    <div class="w-full max-w-xs space-y-2">
        <div class="flex items-center justify-between text-sm">
            <span class="text-muted-foreground">Storage</span>
            <span class="font-medium">{{ usedMb }} MB / {{ limitMb }} MB</span>
        </div>
        <Progress :model-value="percentage" :class="progressColor" />
        <p class="text-xs text-muted-foreground text-right">
            {{ percentage }}% used
        </p>
    </div>
</template>
