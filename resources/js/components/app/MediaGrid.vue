<script setup lang="ts">
import { ref } from "vue";
import { router } from "@inertiajs/vue3";
import { route } from "ziggy-js";
import { Trash2, Play, Image as ImageIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MediaItem {
    id: string;
    url: string;
    file_type: "image" | "video" | "other";
    mime_type: string;
    width: number | null;
    height: number | null;
    size_kb: number;
    created_at: string;
}

interface Props {
    media: MediaItem[];
}

defineProps<Props>();

const isDeleteOpen = ref(false);
const deletingId = ref<string | null>(null);
const isDeleting = ref(false);

function openDeleteDialog(id: string) {
    deletingId.value = id;
    isDeleteOpen.value = true;
}

function confirmDelete() {
    if (!deletingId.value) return;

    isDeleting.value = true;

    router.delete(route("media.destroy", { media: deletingId.value }), {
        preserveScroll: true,
        onSuccess: () => {
            isDeleteOpen.value = false;
            deletingId.value = null;
            isDeleting.value = false;
        },
        onError: () => {
            isDeleting.value = false;
        },
    });
}

function formatSize(kb: number): string {
    if (kb >= 1024) {
        return `${(kb / 1024).toFixed(1)} MB`;
    }
    return `${kb} KB`;
}
</script>

<template>
    <div
        v-if="media.length === 0"
        class="flex flex-col items-center justify-center py-16 text-center"
    >
        <ImageIcon class="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 class="text-lg font-medium text-muted-foreground">No media yet</h3>
        <p class="text-sm text-muted-foreground/70">
            Upload images or videos to get started
        </p>
    </div>

    <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
    >
        <div
            v-for="item in media"
            :key="item.id"
            class="group relative aspect-square rounded-lg overflow-hidden bg-muted border"
        >
            <!-- Image -->
            <img
                v-if="item.file_type === 'image'"
                :src="item.url"
                :alt="`Media ${item.id}`"
                class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                loading="lazy"
            />

            <!-- Video -->
            <div
                v-else-if="item.file_type === 'video'"
                class="relative h-full w-full"
            >
                <video
                    :src="item.url"
                    class="h-full w-full object-cover"
                    muted
                    preload="metadata"
                />
                <div
                    class="absolute inset-0 flex items-center justify-center bg-black/20"
                >
                    <Play class="h-10 w-10 text-white drop-shadow-lg" />
                </div>
            </div>

            <!-- Other file type -->
            <div v-else class="flex h-full w-full items-center justify-center">
                <ImageIcon class="h-12 w-12 text-muted-foreground" />
            </div>

            <!-- Overlay with actions -->
            <div
                class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200"
            >
                <div
                    class="absolute inset-x-0 bottom-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                    <div class="flex items-center justify-between">
                        <span
                            class="text-xs text-white font-medium drop-shadow"
                        >
                            {{ formatSize(item.size_kb) }}
                        </span>
                        <Button
                            variant="destructive"
                            size="icon"
                            class="h-8 w-8"
                            @click.stop="openDeleteDialog(item.id)"
                        >
                            <Trash2 class="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <AlertDialog v-model:open="isDeleteOpen">
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Delete Media</AlertDialogTitle>
                <AlertDialogDescription>
                    Are you sure you want to delete this file? This action
                    cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel :disabled="isDeleting"
                    >Cancel</AlertDialogCancel
                >
                <AlertDialogAction
                    :disabled="isDeleting"
                    class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    @click="confirmDelete"
                >
                    {{ isDeleting ? "Deleting..." : "Delete" }}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>
