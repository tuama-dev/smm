import { Link } from "@inertiajs/react";
import { useState } from "react"; // Kept for future or strict mode compliance since we used it before,
// actually we don't need useState anymore if no dropdown.
// But wait, the Sidebar is generic and we're removing `onLogout` and `user` usage from Sidebar?
// Ah user is only used for profile which we removed. So we can clear props too.
import HomeIcon from "@mui/icons-material/Home";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupsIcon from "@mui/icons-material/Groups";
import SettingsIcon from "@mui/icons-material/Settings";
import BoltIcon from "@mui/icons-material/Bolt";
import CloseIcon from "@mui/icons-material/Close";

export default function Sidebar({ open, setOpen }) {
    const navigation = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: "HomeIcon",
            current:
                window.location.pathname === "/dashboard" ||
                window.location.pathname === "/",
        },
        {
            name: "Schedule Posts",
            href: "/posts/schedule",
            icon: "CalendarIcon",
            current: window.location.pathname.startsWith("/posts/schedule"),
        },
        {
            name: "Social Accounts",
            href: "/accounts",
            icon: "UserGroupIcon",
            current: window.location.pathname.startsWith("/accounts"),
        },
    ];

    return (
        <div
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                open ? "translate-x-0" : "-translate-x-full"
            }`}
        >
            <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-linear-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <BoltIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                            SocialHub
                        </span>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <CloseIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                item.current
                                    ? "bg-primary-500 text-primary-50 dark:text-primary-50"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                        >
                            <NavigationIcon name={item.icon} />
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
}

function NavigationIcon({ name }) {
    const icons = {
        HomeIcon: <HomeIcon className="w-5 h-5" />,
        CalendarIcon: <CalendarMonthIcon className="w-5 h-5" />,
        UserGroupIcon: <GroupsIcon className="w-5 h-5" />,
        CogIcon: <SettingsIcon className="w-5 h-5" />,
    };

    return icons[name] || null;
}
