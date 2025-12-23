<script setup lang="ts">
import { ref, computed } from "vue";
import { Check, Image as ImageIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface MediaItem {
    id: string;
    url: string;
    file_type: "image" | "video" | "other";
    size_kb: number;
}

interface Props {
    media: MediaItem[];
    selectedIds?: string[];
}

const props = withDefaults(defineProps<Props>(), {
    selectedIds: () => [],
});

const emit = defineEmits<{
    confirm: [selectedIds: string[]];
}>();

const isOpen = ref(false);
const localSelected = ref<Set<string>>(new Set(props.selectedIds));

function toggleSelection(id: string) {
    if (localSelected.value.has(id)) {
        localSelected.value.delete(id);
    } else {
        localSelected.value.add(id);
    }
    // Force reactivity
    localSelected.value = new Set(localSelected.value);
}

function isSelected(id: string): boolean {
    return localSelected.value.has(id);
}

function confirmSelection() {
    emit("confirm", Array.from(localSelected.value));
    isOpen.value = false;
}

function openDialog() {
    localSelected.value = new Set(props.selectedIds);
    isOpen.value = true;
}

const selectedCount = computed(() => localSelected.value.size);
</script>

<template>
    <Dialog v-model:open="isOpen">
        <DialogTrigger as-child>
            <Button variant="outline" class="gap-2" @click="openDialog">
                <ImageIcon class="h-4 w-4" />
                Select Media
            </Button>
        </DialogTrigger>
        <DialogContent class="max-w-3xl max-h-[80vh]">
            <DialogHeader>
                <DialogTitle>Select Media</DialogTitle>
                <DialogDescription>
                    Click on images to select them. Selected:
                    {{ selectedCount }}
                </DialogDescription>
            </DialogHeader>

            <div class="overflow-y-auto max-h-[50vh] py-4">
                <div
                    v-if="media.length === 0"
                    class="text-center py-8 text-muted-foreground"
                >
                    No media available. Upload some images first.
                </div>
                <div
                    v-else
                    class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2"
                >
                    <div
                        v-for="item in media"
                        :key="item.id"
                        class="relative aspect-square cursor-pointer rounded-lg overflow-hidden border-2 transition-all"
                        :class="[
                            isSelected(item.id)
                                ? 'border-primary ring-2 ring-primary/50'
                                : 'border-transparent hover:border-muted-foreground/50',
                        ]"
                        @click="toggleSelection(item.id)"
                    >
                        <img
                            v-if="item.file_type === 'image'"
                            :src="item.url"
                            alt=""
                            class="h-full w-full object-cover"
                            loading="lazy"
                        />
                        <video
                            v-else-if="item.file_type === 'video'"
                            :src="item.url"
                            class="h-full w-full object-cover"
                            muted
                            preload="metadata"
                        />
                        <div
                            v-else
                            class="h-full w-full bg-muted flex items-center justify-center"
                        >
                            <ImageIcon class="h-8 w-8 text-muted-foreground" />
                        </div>

                        <!-- Selection indicator -->
                        <div
                            v-if="isSelected(item.id)"
                            class="absolute top-1 right-1 h-6 w-6 bg-primary rounded-full flex items-center justify-center"
                        >
                            <Check class="h-4 w-4 text-primary-foreground" />
                        </div>
                    </div>
                </div>
            </div>

            <DialogFooter>
                <Button variant="outline" @click="isOpen = false"
                    >Cancel</Button
                >
                <Button @click="confirmSelection">
                    Confirm ({{ selectedCount }})
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
