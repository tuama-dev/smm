import { Link } from "@inertiajs/react";
import { useState } from "react";
import { route } from "ziggy-js";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupsIcon from "@mui/icons-material/Groups";
import SettingsIcon from "@mui/icons-material/Settings";
import BoltIcon from "@mui/icons-material/Bolt";
import CloseIcon from "@mui/icons-material/Close";
import ArticleIcon from "@mui/icons-material/Article";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ListAltIcon from "@mui/icons-material/ListAlt";
import EventIcon from "@mui/icons-material/Event";

export default function Sidebar({ open, setOpen }) {
    // State to track open/closed parent menus
    // Initialize with 'Posts' open if we are in a posts route
    const [openMenus, setOpenMenus] = useState({
        Posts: route().current("posts.*"),
    });

    const toggleMenu = (name) => {
        setOpenMenus((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));
    };

    const navigation = [
        {
            name: "Dashboard",
            href: route("dashboard"),
            icon: "DashboardIcon",
            current: route().current("dashboard"),
        },
        {
            name: "Social Accounts",
            href: "/accounts", // No route defined yet
            icon: "UserGroupIcon",
            current: window.location.pathname.startsWith("/accounts"),
        },
        {
            name: "Posts",
            icon: "ArticleIcon",
            current: route().current("posts.*"),
            children: [
                {
                    name: "All Posts",
                    href: route("posts.index"),
                    icon: "ListAltIcon",
                    current: route().current("posts.index"),
                },
                {
                    name: "Create Post",
                    href: route("posts.create"),
                    icon: "AddCircleOutlineIcon",
                    current: route().current("posts.create"),
                },
                {
                    name: "Scheduled Posts",
                    href: route("posts.scheduled"),
                    icon: "EventIcon",
                    current: route().current("posts.scheduled"),
                },
            ],
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
                        <div key={item.name}>
                            {item.children ? (
                                /* Parent with Children */
                                <>
                                    <button
                                        onClick={() => toggleMenu(item.name)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                            item.current
                                                ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/10"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <NavigationIcon name={item.icon} />
                                            {item.name}
                                        </div>
                                        {openMenus[item.name] ? (
                                            <ExpandLess className="w-5 h-5" />
                                        ) : (
                                            <ExpandMore className="w-5 h-5" />
                                        )}
                                    </button>

                                    {/* Children Links */}
                                    <div
                                        className={`pl-11 space-y-1 overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                                            openMenus[item.name]
                                                ? "max-h-96 mt-1"
                                                : "max-h-0"
                                        }`}
                                    >
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.name}
                                                href={child.href}
                                                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                                                    child.current
                                                        ? "text-primary-600 dark:text-primary-400 font-medium"
                                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                                }`}
                                            >
                                                <span>{child.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                /* Regular Link */
                                <Link
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
                            )}
                        </div>
                    ))}
                </nav>
            </div>
        </div>
    );
}

function NavigationIcon({ name }) {
    const icons = {
        DashboardIcon: <DashboardIcon className="w-5 h-5" />,
        CalendarIcon: <CalendarMonthIcon className="w-5 h-5" />,
        UserGroupIcon: <GroupsIcon className="w-5 h-5" />,
        CogIcon: <SettingsIcon className="w-5 h-5" />,
        ArticleIcon: <ArticleIcon className="w-5 h-5" />,
        ListAltIcon: <ListAltIcon className="w-5 h-5" />,
        AddCircleOutlineIcon: <AddCircleOutlineIcon className="w-5 h-5" />,
        EventIcon: <EventIcon className="w-5 h-5" />,
    };

    return icons[name] || null;
}
