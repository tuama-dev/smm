import { Head, useForm } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import MediaUploader from "@/Components/MediaUploader";

export default function Schedule() {
    const { data, setData, post, processing, errors } = useForm({
        media: null,
        caption: "",
        platforms: [],
        scheduled_at: "",
    });

    const platforms = [
        {
            id: "instagram",
            name: "Instagram",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
            ),
            bg: "hover:bg-pink-50 dark:hover:bg-pink-900/20",
            border: "peer-checked:border-pink-500",
            text: "peer-checked:text-pink-600 dark:peer-checked:text-pink-400",
        },
        {
            id: "facebook",
            name: "Facebook",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
            ),
            bg: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
            border: "peer-checked:border-blue-500",
            text: "peer-checked:text-blue-600 dark:peer-checked:text-blue-400",
        },
        {
            id: "tiktok",
            name: "TikTok",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v6.16c0 1.62-.56 3.22-1.61 4.41-1.04 1.17-2.58 1.83-4.14 1.72-2.3-.12-4.32-2.03-4.48-4.35-.14-2.45 1.78-4.66 4.31-4.71.04 0 .09 0 .14 0v4.22c-.63-.03-1.17.43-1.19 1.05-.03.58.4 1.09.98 1.12.58.03 1.09-.4 1.12-.98.01-.15.01-.3 0-.46v-16.26z" />
                </svg>
            ),
            bg: "hover:bg-gray-50 dark:hover:bg-gray-700/50",
            border: "peer-checked:border-gray-900 dark:peer-checked:border-gray-100",
            text: "peer-checked:text-gray-900 dark:peer-checked:text-white",
        },
    ];

    const togglePlatform = (id) => {
        const current = data.platforms;
        const index = current.indexOf(id);

        if (index === -1) {
            setData("platforms", [...current, id]);
        } else {
            setData(
                "platforms",
                current.filter((p) => p !== id)
            );
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("posts.store"));
    };

    return (
        <DashboardLayout>
            <Head title="Schedule Post" />

            <div className="max-w-5xl mx-auto py-6">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Create New Post
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
                        Design your content once and schedule it seamlessly
                        across all your social channels.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="animate-fade-in-up">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Main Content Area */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* Media Upload Section */}
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 transition-all hover:shadow-md">
                                <MediaUploader
                                    onFileSelect={(file) =>
                                        setData("media", file)
                                    }
                                    error={errors.media}
                                />
                            </div>

                            {/* Caption Section */}
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 transition-all hover:shadow-md">
                                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 flex justify-between items-center">
                                    <span>Caption</span>
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full ${
                                            data.caption.length > 2000
                                                ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                                                : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                                        }`}
                                    >
                                        {data.caption.length} / 2200
                                    </span>
                                </label>
                                <div className="relative">
                                    <textarea
                                        rows="6"
                                        className="w-full rounded-2xl border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none p-4"
                                        placeholder="Write a catchy caption..."
                                        value={data.caption}
                                        onChange={(e) =>
                                            setData("caption", e.target.value)
                                        }
                                    />
                                    <div className="absolute bottom-3 right-3 flex gap-2">
                                        <button
                                            type="button"
                                            className="p-1.5 text-gray-400 hover:text-indigo-500 transition-colors"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            className="p-1.5 text-gray-400 hover:text-indigo-500 transition-colors"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                {errors.caption && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center">
                                        <svg
                                            className="w-4 h-4 mr-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                        {errors.caption}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Settings Area */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Platforms Card */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 sticky top-24">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center">
                                    <svg
                                        className="w-5 h-5 mr-2 text-indigo-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    Target Platforms
                                </h3>

                                <div className="space-y-3">
                                    {platforms.map((platform) => (
                                        <label
                                            key={platform.id}
                                            className={`relative flex items-center p-4 cursor-pointer rounded-xl border-2 transition-all duration-200 ${
                                                data.platforms.includes(
                                                    platform.id
                                                )
                                                    ? `${platform.border} bg-white dark:bg-gray-800 shadow-sm`
                                                    : "border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 hover:border-gray-200 dark:hover:border-gray-600"
                                            } ${platform.bg}`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="peer sr-only"
                                                checked={data.platforms.includes(
                                                    platform.id
                                                )}
                                                onChange={() =>
                                                    togglePlatform(platform.id)
                                                }
                                            />
                                            <div
                                                className={`p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm mr-4 text-gray-400 ${platform.text} transition-colors`}
                                            >
                                                {platform.icon}
                                            </div>
                                            <div className="flex-1">
                                                <div
                                                    className={`font-semibold text-gray-900 dark:text-gray-100 ${platform.text}`}
                                                >
                                                    {platform.name}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {data.platforms.includes(
                                                        platform.id
                                                    )
                                                        ? "Selected"
                                                        : "Click to select"}
                                                </div>
                                            </div>
                                            {data.platforms.includes(
                                                platform.id
                                            ) && (
                                                <div className="absolute top-4 right-4">
                                                    <span className="flex h-3 w-3">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                                                    </span>
                                                </div>
                                            )}
                                        </label>
                                    ))}
                                </div>
                                {errors.platforms && (
                                    <p className="mt-3 text-sm text-red-600 text-center bg-red-50 dark:bg-red-900/10 p-2 rounded-lg">
                                        {errors.platforms}
                                    </p>
                                )}

                                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                        <svg
                                            className="w-5 h-5 mr-2 text-indigo-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        Schedule
                                    </h3>
                                    <div className="relative">
                                        <input
                                            type="datetime-local"
                                            className="w-full rounded-xl border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-3"
                                            value={data.scheduled_at}
                                            onChange={(e) =>
                                                setData(
                                                    "scheduled_at",
                                                    e.target.value
                                                )
                                            }
                                            min={new Date()
                                                .toISOString()
                                                .slice(0, 16)}
                                        />
                                    </div>
                                    {errors.scheduled_at && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.scheduled_at}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-8 flex flex-col gap-3">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="group relative w-full flex items-center justify-center py-4 px-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-lg overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                                        <span className="relative flex items-center gap-2">
                                            {processing ? (
                                                <>
                                                    <svg
                                                        className="animate-spin h-5 w-5"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                            fill="none"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        />
                                                    </svg>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    Schedule Post
                                                    <svg
                                                        className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                                                        />
                                                    </svg>
                                                </>
                                            )}
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        className="w-full py-3 px-6 bg-transparent text-gray-500 dark:text-gray-400 font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        Save as Draft
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
