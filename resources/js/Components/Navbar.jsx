import { Link } from "@inertiajs/react";
import { useState } from "react";
import ThemeToggle from "@/Components/ThemeToggle";
import NavigationIcon from "@/Components/Sidebar"; // We might need to export NavigationIcon or duplicate it/move it to a shared place?
import { Logout, Settings } from "@mui/icons-material";
// Actually NavigationIcon is not exported from Sidebar.jsx. I should probably move it to a shared component or just duplicate the icon logic for now since it's used inside the dropdown.
// Better yet, I will verify if I can export it from Sidebar or if I should just use the SVGs directly here to avoid circular deps or tight coupling if Sidebar imports Navbar later (unlikely but good practice).
// Given the simplicity, I'll duplicate the CogIcon/Logout SVG logic or move icons to a separate file later if needed. For now, duplication is safer to avoid breaking Sidebar.

export default function Navbar({ user, setSidebarOpen, onLogout }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>

                <div className="flex-1" />

                <div className="flex items-center gap-4">
                    <ThemeToggle />

                    {/* User Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        >
                            <div className="w-8 h-8 bg-linear-to-br from-primary-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-md shadow-primary-500/20">
                                {user?.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-none">
                                    {user?.name || "User"}
                                </p>
                            </div>
                            <svg
                                className={`hidden md:block w-4 h-4 text-gray-400 transition-transform duration-200 ${
                                    isDropdownOpen ? "rotate-180" : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-30"
                                    onClick={() => setIsDropdownOpen(false)}
                                ></div>
                                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-40 transform origin-top-right transition-all">
                                    <div className="md:hidden px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {user?.name || "User"}
                                        </p>
                                    </div>

                                    <div className="py-1">
                                        <Link
                                            href="/settings"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                            onClick={() =>
                                                setIsDropdownOpen(false)
                                            }
                                        >
                                            <Settings className="w-4! h-4! text-gray-400" />
                                            Settings
                                        </Link>
                                        <button
                                            onClick={() => {
                                                onLogout();
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 text-left"
                                        >
                                            <Logout className="w-4! h-4! text-red-400" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
