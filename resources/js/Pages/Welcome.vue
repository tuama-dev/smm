<script setup lang="ts">
interface Props {
    laravelVersion?: string;
    phpVersion?: string;
}

defineProps<Props>();
</script>

<template>
    <div
        class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center"
    >
        <div class="text-center">
            <h1 class="text-5xl font-bold text-white mb-4">
                Welcome to Inertia + Vue
            </h1>
            <p class="text-xl text-slate-300 mb-8">
                Your Laravel application is now powered by Vue.js with
                Inertia.js
            </p>
            <div class="flex gap-4 justify-center">
                <a
                    href="https://inertiajs.com"
                    target="_blank"
                    class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                >
                    Inertia Docs
                </a>
                <a
                    href="https://vuejs.org"
                    target="_blank"
                    class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
                >
                    Vue Docs
                </a>
            </div>
            <div v-if="laravelVersion" class="mt-8 text-slate-400 text-sm">
                Laravel v{{ laravelVersion }} (PHP v{{ phpVersion }})
            </div>
        </div>
    </div>
</template>
