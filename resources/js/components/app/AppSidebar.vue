<script setup lang="ts">
import { Link } from "@inertiajs/vue3";
import { route } from "ziggy-js";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import TeamSwitcher from "@/components/app/TeamSwitcher.vue";
import UserNav from "@/components/app/UserNav.vue";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Component } from "vue";

interface NavItem {
    name: string;
    routeName: string;
    icon: Component;
}

interface Props {
    navigation: NavItem[];
    isCollapsed: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    toggleCollapse: [];
}>();

function routeExists(name: string): boolean {
    try {
        return typeof route(name) === "string";
    } catch {
        return false;
    }
}

function isActiveRoute(routeName: string): boolean {
    try {
        return route().current(routeName);
    } catch {
        return false;
    }
}
</script>

<template>
    <aside
        :class="[
            'fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-card transition-all duration-300',
            isCollapsed ? 'w-20' : 'w-72',
        ]"
    >
        <!-- Logo -->
        <div class="flex h-16 items-center justify-between border-b px-4">
            <Link :href="route('dashboard')" class="flex items-center gap-3">
                <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary"
                >
                    <span class="text-base font-bold text-primary-foreground"
                        >SM</span
                    >
                </div>
                <span v-if="!isCollapsed" class="text-lg font-semibold"
                    >SMM Planner</span
                >
            </Link>
            <Button
                v-if="!isCollapsed"
                variant="ghost"
                size="icon"
                class="h-9 w-9"
                @click="emit('toggleCollapse')"
            >
                <ChevronLeft class="h-5 w-5" />
            </Button>
        </div>

        <!-- Team Switcher -->
        <div v-if="!isCollapsed" class="p-4">
            <TeamSwitcher />
        </div>

        <Separator v-if="!isCollapsed" />

        <!-- Navigation -->
        <nav class="flex-1 space-y-1 p-3">
            <template v-for="item in navigation" :key="item.name">
                <!-- Collapsed: Icon only with tooltip -->
                <Tooltip v-if="isCollapsed">
                    <TooltipTrigger as-child>
                        <Link
                            v-if="routeExists(item.routeName)"
                            :href="route(item.routeName)"
                            :class="[
                                'flex h-12 w-12 items-center justify-center rounded-lg transition-colors mx-auto',
                                isActiveRoute(item.routeName)
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                            ]"
                        >
                            <component :is="item.icon" class="h-6 w-6" />
                        </Link>
                        <span
                            v-else
                            class="flex h-12 w-12 items-center justify-center rounded-lg text-muted-foreground/50 mx-auto"
                        >
                            <component :is="item.icon" class="h-6 w-6" />
                        </span>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        {{ item.name }}
                    </TooltipContent>
                </Tooltip>

                <!-- Expanded: Full nav item -->
                <template v-else>
                    <Link
                        v-if="routeExists(item.routeName)"
                        :href="route(item.routeName)"
                        :class="[
                            'flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors',
                            isActiveRoute(item.routeName)
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                        ]"
                    >
                        <component :is="item.icon" class="h-6 w-6" />
                        {{ item.name }}
                    </Link>
                    <span
                        v-else
                        class="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-muted-foreground/50"
                    >
                        <component :is="item.icon" class="h-6 w-6" />
                        {{ item.name }}
                    </span>
                </template>
            </template>
        </nav>

        <!-- Expand/Collapse Button (collapsed state) -->
        <div v-if="isCollapsed" class="p-2">
            <Button
                variant="ghost"
                size="icon"
                class="h-12 w-12 mx-auto"
                @click="emit('toggleCollapse')"
            >
                <ChevronRight class="h-5 w-5" />
            </Button>
        </div>

        <Separator />

        <!-- User Nav Footer -->
        <div
            :class="[
                'p-4 flex items-center',
                isCollapsed ? 'justify-center' : '',
            ]"
        >
            <UserNav :collapsed="isCollapsed" />
        </div>
    </aside>
</template>
