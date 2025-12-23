<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Sun, Moon, Monitor } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Theme = "light" | "dark" | "system";

const theme = ref<Theme>("system");

const themeOptions = [
    { value: "light" as Theme, label: "Light", icon: Sun },
    { value: "dark" as Theme, label: "Dark", icon: Moon },
    { value: "system" as Theme, label: "System", icon: Monitor },
];

function getSystemTheme(): "light" | "dark" {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

function applyTheme(newTheme: Theme) {
    const root = document.documentElement;
    const effectiveTheme = newTheme === "system" ? getSystemTheme() : newTheme;

    root.classList.remove("light", "dark");
    root.classList.add(effectiveTheme);

    localStorage.setItem("theme", newTheme);
}

function setTheme(newTheme: Theme) {
    theme.value = newTheme;
    applyTheme(newTheme);
}

onMounted(() => {
    // Load saved theme or default to system
    const saved = localStorage.getItem("theme") as Theme | null;
    theme.value = saved || "system";
    applyTheme(theme.value);

    // Listen for system theme changes
    window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", () => {
            if (theme.value === "system") {
                applyTheme("system");
            }
        });
});

const currentIcon = () => {
    const option = themeOptions.find((o) => o.value === theme.value);
    return option?.icon || Monitor;
};
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon" class="h-9 w-9">
                <Sun
                    class="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                />
                <Moon
                    class="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                />
                <span class="sr-only">Toggle theme</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem
                v-for="option in themeOptions"
                :key="option.value"
                class="cursor-pointer gap-2"
                @click="setTheme(option.value)"
            >
                <component :is="option.icon" class="h-4 w-4" />
                <span>{{ option.label }}</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
