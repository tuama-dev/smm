import type { AxiosInstance } from "axios";
import type { route as ziggyRoute } from "ziggy-js";

declare global {
    interface Window {
        axios: AxiosInstance;
    }

    // Ziggy route helper - available globally after ZiggyVue plugin is installed
    const route: typeof ziggyRoute;
}

export {};
