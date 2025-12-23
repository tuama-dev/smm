<script setup lang="ts">
import { usePage } from '@inertiajs/vue3'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { PageProps } from '@/types'

const page = usePage<PageProps>()
const user = page.props.auth.user
const team = page.props.auth.currentTeam
</script>

<template>
  <AuthenticatedLayout title="Dashboard">
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <!-- Welcome Card -->
      <Card class="col-span-full bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <CardHeader>
          <CardTitle class="text-2xl">
            Welcome back, {{ user?.name?.split(' ')[0] }}! 👋
          </CardTitle>
          <CardDescription>
            You're currently working in <span class="font-medium text-foreground">{{ team?.name }}</span>.
            Here's what's happening with your social media.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex flex-wrap gap-4">
            <div class="flex items-center gap-2 rounded-lg bg-background px-4 py-2 shadow-sm">
              <div class="text-2xl font-bold text-primary">0</div>
              <div class="text-sm text-muted-foreground">Scheduled Posts</div>
            </div>
            <div class="flex items-center gap-2 rounded-lg bg-background px-4 py-2 shadow-sm">
              <div class="text-2xl font-bold text-primary">0</div>
              <div class="text-sm text-muted-foreground">Connected Profiles</div>
            </div>
            <div class="flex items-center gap-2 rounded-lg bg-background px-4 py-2 shadow-sm">
              <div class="text-2xl font-bold text-primary">0</div>
              <div class="text-sm text-muted-foreground">Media Assets</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Quick Actions -->
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with common tasks</CardDescription>
        </CardHeader>
        <CardContent class="grid gap-2">
          <button class="flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <span class="text-lg">📝</span>
            </div>
            <div>
              <div class="font-medium">Create Post</div>
              <div class="text-sm text-muted-foreground">Schedule new content</div>
            </div>
          </button>
          <button class="flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <span class="text-lg">🔗</span>
            </div>
            <div>
              <div class="font-medium">Connect Profile</div>
              <div class="text-sm text-muted-foreground">Add social accounts</div>
            </div>
          </button>
        </CardContent>
      </Card>

      <!-- Recent Activity -->
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex h-24 items-center justify-center text-sm text-muted-foreground">
            No recent activity
          </div>
        </CardContent>
      </Card>

      <!-- Upcoming Posts -->
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Posts</CardTitle>
          <CardDescription>Scheduled for this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex h-24 items-center justify-center text-sm text-muted-foreground">
            No posts scheduled
          </div>
        </CardContent>
      </Card>
    </div>
  </AuthenticatedLayout>
</template>
