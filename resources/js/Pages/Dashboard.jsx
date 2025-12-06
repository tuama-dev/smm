import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import SocialAccountCard from "@/Components/SocialAccountCard";
import PostScheduleCard from "@/Components/PostScheduleCard";
import UsageLimitsBanner from "@/Components/UsageLimitsBanner";
import { PeopleAltOutlined, ScheduleOutlined } from "@mui/icons-material";

export default function Dashboard({ auth, accounts, posts, usage }) {
    const handleConnect = (provider) => {
        // Implement connection logic
        window.location.href = `/auth/${provider}`;
    };

    const handleDisconnect = (provider) => {
        // Implement disconnect logic
        console.log("Disconnecting", provider);
    };

    return (
        <DashboardLayout>
            <Head title="Dashboard" />

            <div className="space-y-8">
                {/* Welcome & Limits Section */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Welcome back, {auth.user.name} 👋
                    </h1>
                    <UsageLimitsBanner used={usage.used} limit={usage.limit} />
                </div>

                {/* Social Accounts Section */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <PeopleAltOutlined className="w-5 h-5 text-primary-500" />
                        Connected Accounts
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {["instagram", "facebook", "tiktok"].map((provider) => (
                            <SocialAccountCard
                                key={provider}
                                provider={provider}
                                accounts={accounts[provider]}
                                onConnect={() => handleConnect(provider)}
                                onDisconnect={(id) =>
                                    handleDisconnect(provider, id)
                                }
                            />
                        ))}
                    </div>
                </div>

                {/* Scheduled Posts Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <ScheduleOutlined className="w-5 h-5 text-primary-500" />
                            Upcoming Posts
                        </h2>
                        <button className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                            View All &rarr;
                        </button>
                    </div>

                    {posts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post) => (
                                <PostScheduleCard
                                    key={post.id}
                                    post={post}
                                    onEdit={() => console.log("Edit", post.id)}
                                    onDelete={() =>
                                        console.log("Delete", post.id)
                                    }
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                                No scheduled posts
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                Get started by creating your first post
                            </p>
                            <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
                                Schedule Post
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
