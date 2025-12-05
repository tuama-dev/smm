export default function SocialAccountCard({
    provider,
    accounts = [], // Array of connected accounts: { id, name, avatar }
    onConnect,
    onDisconnect,
}) {
    const config = {
        instagram: {
            name: "Instagram",
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
            ),
            gradient: "from-purple-500 via-pink-500 to-orange-500",
            bg: "bg-linear-to-br",
            textColor: "text-white",
        },
        facebook: {
            name: "Facebook",
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            ),
            gradient: "from-blue-600 to-blue-700",
            bg: "bg-gradient-to-br",
            textColor: "text-white",
        },
        tiktok: {
            name: "TikTok",
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.49-3.35-3.98-5.6-1.77-8.1 4.54-15.14 11.45-12.75.11 2.49.08 6.54.02 9.03.01 1.45-1.37 2.52-2.42 1.87-.55-.33-.88-.93-.93-1.57-.01-2.27.01-4.54-.01-6.81h-4.2c.07 1.6-.14 3.73.91 5.17 1.12 1.54 2.92 2.37 4.78 2.32 1.55.03 3.08-.66 4.15-1.74 1.13-1.12 1.68-2.72 1.63-4.32-.01-3.66.01-7.35-.01-11.02.04-.37.36-.61.7-.66 2.58-.12 5.13-.05 7.7-.02z" />
                </svg>
            ),
            gradient: "from-black to-gray-900",
            bg: "bg-gradient-to-br",
            textColor: "text-white",
        },
    };

    const { name, icon, gradient, bg, textColor } =
        config[provider] || config.instagram;

    const hasAccounts = accounts && accounts.length > 0;

    return (
        <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full">
            <div
                className={`absolute top-0 left-0 w-full h-1 ${bg} ${gradient}`}
            ></div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <div
                        className={`p-3 rounded-xl ${bg} ${gradient} ${textColor} shadow-lg`}
                    >
                        {icon}
                    </div>
                    {hasAccounts && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                            <span className="w-1.5 h-1.5 mr-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            {accounts.length} Connected
                        </span>
                    )}
                </div>

                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {name}
                    </h3>

                    {hasAccounts ? (
                        <div className="mt-4 space-y-3">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                Connected Accounts:
                            </p>
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                {accounts.map((account) => (
                                    <div
                                        key={account.id}
                                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700"
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            {account.avatar ? (
                                                <img
                                                    src={account.avatar}
                                                    alt={account.name}
                                                    className="w-6 h-6 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-bold text-gray-500">
                                                    {account.name.charAt(0)}
                                                </div>
                                            )}
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate max-w-[100px]">
                                                {account.name}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() =>
                                                onDisconnect(account.id)
                                            }
                                            className="text-xs text-red-500 hover:text-red-700 transition-colors p-1"
                                            title="Disconnect"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Connect multiple accounts to manage them all in one
                            place.
                        </p>
                    )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                        onClick={onConnect}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${"bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 hover:bg-white hover:shadow-md border border-gray-200 dark:border-gray-700"}`}
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        {hasAccounts ? "Connect Another" : "Connect Account"}
                    </button>
                </div>
            </div>
        </div>
    );
}
