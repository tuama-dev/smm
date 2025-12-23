<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "@inertiajs/vue3";
import { route } from "ziggy-js";
import { Upload, Loader2 } from "lucide-vue-next";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import MediaStats from "@/components/app/MediaStats.vue";
import MediaGrid from "@/components/app/MediaGrid.vue";
import { Button } from "@/components/ui/button";

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

interface StorageStats {
    used_kb: number;
    limit_kb: number;
    percentage: number;
}

interface Props {
    media: MediaItem[];
    storageStats: StorageStats;
}

const props = defineProps<Props>();

const fileInput = ref<HTMLInputElement | null>(null);

const form = useForm({
    file: null as File | null,
});

function triggerUpload() {
    fileInput.value?.click();
}

function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) return;

    form.file = file;

    form.post(route("media.store"), {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => {
            form.reset();
            if (fileInput.value) {
                fileInput.value.value = "";
            }
        },
        onError: () => {
            if (fileInput.value) {
                fileInput.value.value = "";
            }
        },
    });
}
</script>

<template>
    <AuthenticatedLayout title="Media Library">
        <!-- Header -->
        <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
        >
            <div class="flex-1">
                <MediaStats
                    :used-kb="storageStats.used_kb"
                    :limit-kb="storageStats.limit_kb"
                />
            </div>

            <div>
                <input
                    ref="fileInput"
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,video/webm"
                    class="hidden"
                    @change="handleFileChange"
                />
                <Button :disabled="form.processing" @click="triggerUpload">
                    <Loader2
                        v-if="form.processing"
                        class="mr-2 h-4 w-4 animate-spin"
                    />
                    <Upload v-else class="mr-2 h-4 w-4" />
                    {{ form.processing ? "Uploading..." : "Upload" }}
                </Button>
            </div>
        </div>

        <!-- Error Message -->
        <div
            v-if="form.errors.file"
            class="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-4"
        >
            <p class="text-sm text-destructive">{{ form.errors.file }}</p>
        </div>

        <!-- Media Grid -->
        <MediaGrid :media="media" />
    </AuthenticatedLayout>
</template>
