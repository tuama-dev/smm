<script setup lang="ts">
import { computed } from "vue";
import {
    Heart,
    MessageCircle,
    Send,
    Bookmark,
    MoreHorizontal,
} from "lucide-vue-next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MediaItem {
    id: string;
    url: string;
    file_type: "image" | "video" | "other";
}

interface User {
    id: string;
    name: string;
    avatar_url?: string;
}

interface Props {
    caption: string;
    media: MediaItem[];
    user: User;
}

const props = defineProps<Props>();

const userInitials = computed(() => {
    return props.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
});

const username = computed(() => {
    return props.user.name.toLowerCase().replace(/\s+/g, "_");
});

const currentMedia = computed(() => {
    return props.media[0] || null;
});

const formattedCaption = computed(() => {
    // Preserve newlines by converting to HTML
    return props.caption.replace(/\n/g, "<br>");
});
</script>

<template>
    <div class="flex flex-col items-center">
        <!-- Phone Frame -->
        <div
            class="relative w-[320px] bg-background rounded-[40px] border-4 border-muted-foreground/20 shadow-xl overflow-hidden"
        >
            <!-- Phone Notch -->
            <div class="flex justify-center pt-2 pb-1 bg-background">
                <div class="w-20 h-6 bg-muted-foreground/20 rounded-full" />
            </div>

            <!-- Instagram App Content -->
            <div class="bg-background h-[560px] overflow-hidden flex flex-col">
                <!-- App Header (Instagram style) -->
                <div
                    class="flex items-center justify-between px-3 py-2 border-b"
                >
                    <div class="flex items-center gap-2">
                        <Avatar class="h-8 w-8">
                            <AvatarImage
                                :src="user.avatar_url"
                                :alt="user.name"
                            />
                            <AvatarFallback class="text-xs">{{
                                userInitials
                            }}</AvatarFallback>
                        </Avatar>
                        <span class="font-semibold text-sm">{{
                            username
                        }}</span>
                    </div>
                    <MoreHorizontal class="h-5 w-5 text-muted-foreground" />
                </div>

                <!-- Media Content -->
                <div
                    class="relative aspect-square bg-muted flex items-center justify-center"
                >
                    <template v-if="currentMedia">
                        <!-- Image -->
                        <img
                            v-if="currentMedia.file_type === 'image'"
                            :src="currentMedia.url"
                            alt="Post media"
                            class="w-full h-full object-cover"
                        />
                        <!-- Video -->
                        <video
                            v-else-if="currentMedia.file_type === 'video'"
                            :src="currentMedia.url"
                            class="w-full h-full object-cover"
                            muted
                            loop
                            autoplay
                        />
                    </template>
                    <template v-else>
                        <div class="text-muted-foreground text-sm">
                            No media selected
                        </div>
                    </template>

                    <!-- Multi-image badge -->
                    <div
                        v-if="media.length > 1"
                        class="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full"
                    >
                        1/{{ media.length }}
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center justify-between px-3 py-2">
                    <div class="flex items-center gap-4">
                        <Heart class="h-6 w-6" />
                        <MessageCircle class="h-6 w-6" />
                        <Send class="h-6 w-6" />
                    </div>
                    <Bookmark class="h-6 w-6" />
                </div>

                <!-- Likes -->
                <div class="px-3 text-sm font-semibold">0 likes</div>

                <!-- Caption -->
                <div class="px-3 py-1 text-sm flex-1 overflow-y-auto">
                    <template v-if="caption">
                        <span class="font-semibold">{{ username }}</span>
                        <span class="ml-1" v-html="formattedCaption" />
                    </template>
                    <span v-else class="text-muted-foreground italic"
                        >No caption</span
                    >
                </div>

                <!-- Timestamp -->
                <div class="px-3 pb-2 text-xs text-muted-foreground uppercase">
                    Just now
                </div>
            </div>

            <!-- Phone Home Indicator -->
            <div class="flex justify-center pb-2 bg-background">
                <div class="w-28 h-1 bg-muted-foreground/30 rounded-full" />
            </div>
        </div>
    </div>
</template>
