<script setup lang="ts">
import { computed } from "vue";
import { Link, router, usePage } from "@inertiajs/vue3";
import { route } from "ziggy-js";
import { LogOut, Settings, User as UserIcon } from "lucide-vue-next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import type { PageProps } from "@/types";

interface Props {
    collapsed?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    collapsed: false,
});

const page = usePage<PageProps>();

const user = computed(() => page.props.auth.user);

const initials = computed(() => {
    if (!user.value?.name) return "?";
    return user.value.name
        .split(" ")
        .map((word) => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
});

function logout() {
    router.post(route("logout"));
}
</script>

<template>
    <DropdownMenu>
        <Tooltip v-if="collapsed">
            <TooltipTrigger as-child>
                <DropdownMenuTrigger as-child>
                    <Button
                        variant="ghost"
                        class="relative h-10 w-10 rounded-full"
                    >
                        <Avatar class="h-9 w-9">
                            <AvatarImage
                                v-if="user?.avatar_url"
                                :src="user.avatar_url"
                                :alt="user?.name"
                            />
                            <AvatarFallback>{{ initials }}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="right">
                {{ user?.name }}
            </TooltipContent>
        </Tooltip>

        <DropdownMenuTrigger v-else as-child>
            <Button
                variant="ghost"
                class="h-auto w-full justify-start gap-3 px-2 py-2"
            >
                <Avatar class="h-9 w-9">
                    <AvatarImage
                        v-if="user?.avatar_url"
                        :src="user.avatar_url"
                        :alt="user?.name"
                    />
                    <AvatarFallback>{{ initials }}</AvatarFallback>
                </Avatar>
                <div class="flex flex-col items-start text-left">
                    <span class="text-sm font-medium">{{ user?.name }}</span>
                    <span class="text-xs text-muted-foreground">{{
                        user?.email
                    }}</span>
                </div>
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
            class="w-56"
            :align="collapsed ? 'start' : 'end'"
            :side="collapsed ? 'right' : 'top'"
        >
            <DropdownMenuLabel class="font-normal">
                <div class="flex flex-col space-y-1">
                    <p class="text-sm font-medium leading-none">
                        {{ user?.name }}
                    </p>
                    <p class="text-xs leading-none text-muted-foreground">
                        {{ user?.email }}
                    </p>
                </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem class="cursor-pointer gap-2">
                <UserIcon class="h-4 w-4" />
                <span>Profile</span>
            </DropdownMenuItem>

            <Link :href="route('settings.index')">
                <DropdownMenuItem class="cursor-pointer gap-2">
                    <Settings class="h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
            </Link>

            <DropdownMenuSeparator />

            <DropdownMenuItem
                class="cursor-pointer gap-2 text-destructive focus:text-destructive"
                @click="logout"
            >
                <LogOut class="h-4 w-4" />
                <span>Log out</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
