<script setup lang="ts">
import { computed } from "vue";
import { router, usePage } from "@inertiajs/vue3";
import { route } from "ziggy-js";
import {
    Check,
    ChevronsUpDown,
    Users,
    User as UserIcon,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PageProps, Team } from "@/types";

const page = usePage<PageProps>();

const currentTeam = computed(() => page.props.auth.currentTeam);
const allTeams = computed(() => page.props.auth.allTeams ?? []);

// Separate personal team from organization teams
const personalTeam = computed(() =>
    allTeams.value.find((team) => team.personal_team)
);

const organizationTeams = computed(() =>
    allTeams.value.filter((team) => !team.personal_team)
);

function switchTeam(team: Team) {
    if (team.id === currentTeam.value?.id) return;

    router.put(
        route("current-team.update"),
        { team_id: team.id },
        { preserveScroll: true }
    );
}

function isCurrentTeam(team: Team): boolean {
    return team.id === currentTeam.value?.id;
}
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="outline" class="w-48 justify-between gap-2">
                <div class="flex items-center gap-2 truncate">
                    <component
                        :is="currentTeam?.personal_team ? UserIcon : Users"
                        class="h-4 w-4 shrink-0 text-muted-foreground"
                    />
                    <span class="truncate">{{
                        currentTeam?.name ?? "Select Team"
                    }}</span>
                </div>
                <ChevronsUpDown class="h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent class="w-56" align="start">
            <!-- Personal Team Section -->
            <template v-if="personalTeam">
                <DropdownMenuLabel class="text-xs text-muted-foreground">
                    Personal
                </DropdownMenuLabel>

                <DropdownMenuItem
                    class="cursor-pointer gap-2"
                    @click="switchTeam(personalTeam)"
                >
                    <UserIcon class="h-4 w-4 text-muted-foreground" />
                    <span class="truncate">{{ personalTeam.name }}</span>
                    <Check
                        v-if="isCurrentTeam(personalTeam)"
                        class="ml-auto h-4 w-4 text-primary"
                    />
                </DropdownMenuItem>
            </template>

            <!-- Organization Teams Section -->
            <template v-if="organizationTeams.length > 0">
                <DropdownMenuSeparator v-if="personalTeam" />

                <DropdownMenuLabel class="text-xs text-muted-foreground">
                    Organizations
                </DropdownMenuLabel>

                <DropdownMenuItem
                    v-for="team in organizationTeams"
                    :key="team.id"
                    class="cursor-pointer gap-2"
                    @click="switchTeam(team)"
                >
                    <Users class="h-4 w-4 text-muted-foreground" />
                    <span class="truncate">{{ team.name }}</span>
                    <Check
                        v-if="isCurrentTeam(team)"
                        class="ml-auto h-4 w-4 text-primary"
                    />
                </DropdownMenuItem>
            </template>

            <!-- Create Team Option -->
            <DropdownMenuSeparator />
            <DropdownMenuItem class="cursor-pointer gap-2">
                <Users class="h-4 w-4" />
                <span>Create Team</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
