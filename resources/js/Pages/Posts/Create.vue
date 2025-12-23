<script setup lang="ts">
import { ref, computed } from "vue";
import { useForm, usePage } from "@inertiajs/vue3";
import { route } from "ziggy-js";
import { CalendarClock, Save, Send, X } from "lucide-vue-next";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import PhonePreview from "@/components/app/PhonePreview.vue";
import MediaSelector from "@/components/app/MediaSelector.vue";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MediaItem {
    id: string;
    url: string;
    file_type: "image" | "video" | "other";
    size_kb: number;
}

interface Props {
    media: MediaItem[];
}

const props = defineProps<Props>();

const page = usePage();
const user = computed(() => page.props.auth.user);

const form = useForm({
    caption: "",
    scheduled_at: "",
    media_ids: [] as string[],
    status: "draft" as "draft" | "scheduled",
});

const selectedMediaObjects = computed(() => {
    return props.media.filter((m) => form.media_ids.includes(m.id));
});

function handleMediaConfirm(selectedIds: string[]) {
    form.media_ids = selectedIds;
}

function removeMedia(id: string) {
    form.media_ids = form.media_ids.filter((mid) => mid !== id);
}

function saveDraft() {
    form.status = "draft";
    form.post(route("posts.store"));
}

function schedulePost() {
    if (!form.scheduled_at) {
        alert("Please select a schedule time");
        return;
    }
    form.status = "scheduled";
    form.post(route("posts.store"));
}
</script>

<template>
    <AuthenticatedLayout title="Create Post">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Left Column: Form -->
            <div class="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Post Details</CardTitle>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <!-- Caption -->
                        <div class="space-y-2">
                            <Label for="caption">Caption</Label>
                            <Textarea
                                id="caption"
                                v-model="form.caption"
                                placeholder="Write your caption here..."
                                rows="5"
                                class="resize-none"
                            />
                            <p class="text-xs text-muted-foreground text-right">
                                {{ form.caption.length }} / 2200
                            </p>
                        </div>

                        <!-- Media Selection -->
                        <div class="space-y-2">
                            <Label>Media</Label>
                            <div class="flex items-center gap-2">
                                <MediaSelector
                                    :media="media"
                                    :selected-ids="form.media_ids"
                                    @confirm="handleMediaConfirm"
                                />
                                <span class="text-sm text-muted-foreground">
                                    {{ form.media_ids.length }} selected
                                </span>
                            </div>

                            <!-- Selected thumbnails -->
                            <div
                                v-if="selectedMediaObjects.length > 0"
                                class="flex flex-wrap gap-2 mt-2"
                            >
                                <div
                                    v-for="item in selectedMediaObjects"
                                    :key="item.id"
                                    class="relative group"
                                >
                                    <img
                                        :src="item.url"
                                        alt=""
                                        class="h-16 w-16 object-cover rounded-md"
                                    />
                                    <button
                                        class="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        @click="removeMedia(item.id)"
                                    >
                                        <X class="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Schedule Time -->
                        <div class="space-y-2">
                            <Label for="scheduled_at">Schedule Time</Label>
                            <div class="flex items-center gap-2">
                                <CalendarClock
                                    class="h-4 w-4 text-muted-foreground"
                                />
                                <Input
                                    id="scheduled_at"
                                    v-model="form.scheduled_at"
                                    type="datetime-local"
                                    class="flex-1"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <!-- Actions -->
                <div class="flex gap-3">
                    <Button
                        variant="outline"
                        class="flex-1"
                        :disabled="form.processing"
                        @click="saveDraft"
                    >
                        <Save class="mr-2 h-4 w-4" />
                        Save Draft
                    </Button>
                    <Button
                        class="flex-1"
                        :disabled="form.processing || !form.scheduled_at"
                        @click="schedulePost"
                    >
                        <Send class="mr-2 h-4 w-4" />
                        Schedule Post
                    </Button>
                </div>

                <!-- Errors -->
                <div
                    v-if="Object.keys(form.errors).length > 0"
                    class="rounded-lg bg-destructive/10 border border-destructive/20 p-4"
                >
                    <ul class="list-disc list-inside text-sm text-destructive">
                        <li v-for="(error, key) in form.errors" :key="key">
                            {{ error }}
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Right Column: Preview -->
            <div class="flex justify-center lg:justify-start">
                <PhonePreview
                    :caption="form.caption"
                    :media="selectedMediaObjects"
                    :user="user"
                />
            </div>
        </div>
    </AuthenticatedLayout>
</template>
