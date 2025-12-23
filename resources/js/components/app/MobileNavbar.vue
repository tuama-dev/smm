<script setup lang="ts">
import { ref } from "vue";
import { Link } from "@inertiajs/vue3";
import { route } from "ziggy-js";
import { Menu } from "lucide-vue-next";
import TeamSwitcher from "@/components/app/TeamSwitcher.vue";
import UserNav from "@/components/app/UserNav.vue";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import type { Component } from "vue";

interface NavItem {
    name: string;
    routeName: string;
    icon: Component;
}

interface Props {
    navigation: NavItem[];
}

defineProps<Props>();

const isOpen = ref(false);

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
    <header
        class="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden"
    >
        <Sheet v-model:open="isOpen">
            <SheetTrigger as-child>
                <Button variant="ghost" size="icon" class="lg:hidden">
                    <Menu class="h-5 w-5" />
                    <span class="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" class="w-72 p-0">
                <SheetHeader class="border-b p-4">
                    <SheetTitle class="flex items-center gap-2">
                        <div
                            class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary"
                        >
                            <span
                                class="text-sm font-bold text-primary-foreground"
                                >SM</span
                            >
                        </div>
                        <span class="font-semibold">SMM Planner</span>
                    </SheetTitle>
                </SheetHeader>

                <div class="flex flex-col gap-2 p-4">
                    <TeamSwitcher />

                    <Separator class="my-2" />

                    <nav class="flex flex-col gap-1">
                        <template v-for="item in navigation" :key="item.name">
                            <Link
                                v-if="routeExists(item.routeName)"
                                :href="route(item.routeName)"
                                :class="[
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                    isActiveRoute(item.routeName)
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                                ]"
                                @click="isOpen = false"
                            >
                                <component :is="item.icon" class="h-5 w-5" />
                                {{ item.name }}
                            </Link>
                            <span
                                v-else
                                class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground/50"
                            >
                                <component :is="item.icon" class="h-5 w-5" />
                                {{ item.name }}
                            </span>
                        </template>
                    </nav>
                </div>
            </SheetContent>
        </Sheet>

        <div class="flex items-center gap-2">
            <div
                class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary"
            >
                <span class="text-sm font-bold text-primary-foreground"
                    >SM</span
                >
            </div>
            <span class="font-semibold">SMM Planner</span>
        </div>

        <div class="flex-1" />

        <UserNav />
    </header>
</template>
