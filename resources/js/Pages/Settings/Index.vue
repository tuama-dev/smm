<script setup lang="ts">
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import ThemeToggle from "@/components/app/ThemeToggle.vue";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
</script>

<template>
    <AuthenticatedLayout title="Settings">
        <div class="space-y-6">
            <!-- Appearance Section -->
            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                        Customize how the application looks on your device.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div class="flex items-center justify-between">
                        <div class="space-y-1">
                            <p class="text-sm font-medium">Theme</p>
                            <p class="text-sm text-muted-foreground">
                                Select your preferred color scheme.
                            </p>
                        </div>
                        <ThemeToggle />
                    </div>
                </CardContent>
            </Card>

            <!-- More settings sections can be added here -->
        </div>
    </AuthenticatedLayout>
</template>
