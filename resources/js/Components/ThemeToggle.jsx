import { useTheme } from "@/Context/ThemeContext";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        >
            {/* Sun Icon (Light Mode) */}
            <LightModeIcon
                className={`w-5 h-5 text-yellow-500 transition-all duration-300 ${
                    isDark
                        ? "rotate-0 scale-0 opacity-0"
                        : "rotate-0 scale-100 opacity-100"
                } absolute inset-0 m-auto`}
            />

            {/* Moon Icon (Dark Mode) */}
            <DarkModeIcon
                className={`w-5 h-5 text-indigo-300 transition-all duration-300 ${
                    isDark
                        ? "rotate-0 scale-100 opacity-100"
                        : "-rotate-90 scale-0 opacity-0"
                }`}
            />
        </button>
    );
}
