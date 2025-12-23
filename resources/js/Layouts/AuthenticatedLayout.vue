<script setup lang="ts">
import { ref } from "vue";
import { LayoutDashboard, Image, Calendar, Settings } from "lucide-vue-next";
import AppSidebar from "@/components/app/AppSidebar.vue";
import MobileNavbar from "@/components/app/MobileNavbar.vue";
import { TooltipProvider } from "@/components/ui/tooltip";

defineProps<{
    title?: string;
}>();

const isCollapsed = ref(false);

const navigation = [
    { name: "Dashboard", routeName: "dashboard", icon: LayoutDashboard },
    { name: "Media Library", routeName: "media.index", icon: Image },
    { name: "Composer", routeName: "composer.index", icon: Calendar },
];

function toggleCollapse() {
    isCollapsed.value = !isCollapsed.value;
}
</script>

<template>
    <TooltipProvider :delay-duration="0">
        <div class="min-h-screen bg-background">
            <!-- Mobile Navbar -->
            <MobileNavbar :navigation="navigation" />

            <!-- Desktop Layout -->
            <div class="hidden lg:flex">
                <!-- Sidebar -->
                <AppSidebar
                    :navigation="navigation"
                    :is-collapsed="isCollapsed"
                    @toggle-collapse="toggleCollapse"
                />

                <!-- Main Content -->
                <main
                    :class="[
                        'flex-1 transition-all duration-300',
                        isCollapsed ? 'lg:ml-20' : 'lg:ml-72',
                    ]"
                >
                    <div class="container mx-auto p-6">
                        <!-- Page Title -->
                        <div v-if="title" class="mb-6">
                            <h1 class="text-2xl font-semibold tracking-tight">
                                {{ title }}
                            </h1>
                        </div>

                        <slot />
                    </div>
                </main>
            </div>

            <!-- Mobile Content -->
            <main class="lg:hidden">
                <div class="container max-w-screen-2xl mx-auto p-4">
                    <!-- Page Title -->
                    <div v-if="title" class="mb-4">
                        <h1 class="text-xl font-semibold tracking-tight">
                            {{ title }}
                        </h1>
                    </div>

                    <slot />
                </div>
            </main>
        </div>
    </TooltipProvider>
</template>
