import type { PageProps as InertiaPageProps } from "@inertiajs/core";

export interface User {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
    current_team_id: string | null;
}

export interface Team {
    id: string;
    name: string;
    slug: string;
    personal_team: boolean;
}

export interface Auth {
    user: User | null;
    currentTeam: Team | null;
    allTeams?: Team[];
}

export interface FlashMessages {
    success: string | null;
    error: string | null;
}

export interface PageProps extends InertiaPageProps {
    auth: Auth;
    flash: FlashMessages;
    [key: string]: unknown;
}
