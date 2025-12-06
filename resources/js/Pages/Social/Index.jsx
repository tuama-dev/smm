import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head } from "@inertiajs/react";
import {
    Facebook,
    Twitter,
    Instagram,
    LinkedIn,
    Add,
    LinkOff,
} from "@mui/icons-material";
import { useState } from "react";
import { AiOutlineTikTok } from "react-icons/ai";
import Button from "@/Components/UI/Button";
import Card from "@/Components/UI/Card";
import Badge from "@/Components/UI/Badge";

export default function Index({ auth }) {
    // Social Accounts Page Component
    // Mock data for social platforms
    const [platforms, setPlatforms] = useState([
        {
            id: "facebook",
            name: "Facebook",
            icon: <Facebook className="w-8 h-8" />,
            color: "from-blue-600 to-blue-800",
            textColor: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-900/20",
            description: "Connect your Facebook Pages to auto-publish posts.",
            connected: true,
            status: "available",
            accounts: [
                {
                    id: 1,
                    name: "My Business Page",
                    avatar: "https://ui-avatars.com/api/?name=My+Business&background=1877F2&color=fff",
                },
            ],
        },
        {
            id: "instagram",
            name: "Instagram",
            icon: <Instagram className="w-8 h-8" />,
            color: "from-pink-500 via-red-500 to-yellow-500",
            textColor: "text-pink-600",
            bgColor: "bg-pink-50 dark:bg-pink-900/20",
            description: "Share photos and reels to your business profile.",
            connected: true,
            status: "available",
            accounts: [
                {
                    id: 2,
                    name: "Creative Studio",
                    avatar: "https://ui-avatars.com/api/?name=Creative+Studio&background=E1306C&color=fff",
                },
                {
                    id: 3,
                    name: "Personal Brand",
                    avatar: "https://ui-avatars.com/api/?name=Personal+Brand&background=F56040&color=fff",
                },
            ],
        },
        {
            id: "tiktok",
            name: "TikTok",
            icon: <AiOutlineTikTok className="w-8 h-8" />,
            color: "from-gray-900 to-black",
            textColor: "text-gray-900 dark:text-gray-100",
            bgColor: "bg-gray-50 dark:bg-gray-800",
            description: "Share short-form videos to your audience.",
            connected: false,
            status: "available",
            accounts: [],
        },
        {
            id: "twitter",
            name: "X (Twitter)",
            icon: <Twitter className="w-8 h-8" />,
            color: "from-gray-700 to-black",
            textColor: "text-gray-900 dark:text-gray-100",
            bgColor: "bg-gray-50 dark:bg-gray-800",
            description: "Post tweets and threads directly from the dashboard.",
            connected: false,
            status: "coming_soon",
            accounts: [],
        },
        {
            id: "linkedin",
            name: "LinkedIn",
            icon: <LinkedIn className="w-8 h-8" />,
            color: "from-blue-700 to-blue-900",
            textColor: "text-blue-700",
            bgColor: "bg-blue-50 dark:bg-blue-900/20",
            description: "Manage your professional company page and profile.",
            connected: false,
            status: "coming_soon",
            accounts: [],
        },
    ]);

    const handleConnect = (platformId) => {
        window.location.href = route("social.redirect", platformId);
    };

    return (
        <DashboardLayout user={auth.user}>
            <Head title="Social Accounts" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="bg-linear-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">
                                Connected Accounts
                            </span>
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Manage your social media connections and authorized
                            pages.
                        </p>
                    </div>
                    <Button
                        icon={Add}
                        className="bg-linear-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 hover:scale-105 shadow-lg shadow-primary-500/30"
                    >
                        Add New Account
                    </Button>
                </div>

                {/* Platforms Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {platforms.map((platform) => (
                        <Card
                            key={platform.id}
                            hoverEffect={true}
                            noPadding={true}
                            className={`group relative ${
                                platform.connected
                                    ? ""
                                    : "border-dashed! border-gray-300! dark:border-gray-700! opacity-90 hover:opacity-100"
                            }`}
                        >
                            {/* Decorative Background Gradient (subtle) */}
                            <div
                                className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-linear-to-br ${platform.color} pointer-events-none`}
                            />

                            <div className="p-6">
                                {/* Card Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div
                                        className={`p-3 rounded-xl bg-linear-to-br ${platform.color} shadow-lg text-white`}
                                    >
                                        {platform.icon}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {platform.status === "coming_soon" ? (
                                            <Badge variant="warning">
                                                Coming Soon
                                            </Badge>
                                        ) : platform.connected ? (
                                            <Badge variant="success" pulsing>
                                                Active
                                            </Badge>
                                        ) : (
                                            <Badge variant="neutral">
                                                Not Connected
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Platform Info */}
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                    {platform.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 min-h-[40px] mb-4">
                                    {platform.description}
                                </p>

                                {/* Connected Accounts List or Connect Button */}
                                <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    {platform.connected ? (
                                        <div className="space-y-2">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Connected Profiles
                                            </p>
                                            {platform.accounts.map(
                                                (account) => (
                                                    <ConnectedAccountItem
                                                        key={account.id}
                                                        account={account}
                                                    />
                                                )
                                            )}
                                            <Button
                                                onClick={() =>
                                                    handleConnect(platform.id)
                                                }
                                                variant="outline"
                                                size="sm"
                                                icon={Add}
                                                className="w-full mt-2 border-dashed border-primary-200 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/10"
                                            >
                                                Connect another profile
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            disabled={
                                                platform.status ===
                                                "coming_soon"
                                            }
                                            onClick={() =>
                                                platform.status !==
                                                    "coming_soon" &&
                                                handleConnect(platform.id)
                                            }
                                            variant={
                                                platform.status ===
                                                "coming_soon"
                                                    ? "secondary" // visually neutral
                                                    : "secondary"
                                            }
                                            className="w-full font-semibold"
                                        >
                                            {platform.status === "coming_soon"
                                                ? "Coming Soon"
                                                : `Connect ${platform.name}`}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}

function ConnectedAccountItem({ account }) {
    return (
        <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors group/account overflow-hidden">
            <div className="flex items-center gap-3">
                <img
                    src={account.avatar}
                    alt={account.name}
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {account.name}
                </span>
            </div>
            <button className="text-gray-400 hover:text-red-600 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 rounded p-1.5 transition-all cursor-pointer!">
                <LinkOff className="w-4 h-4" />
            </button>
        </div>
    );
}
