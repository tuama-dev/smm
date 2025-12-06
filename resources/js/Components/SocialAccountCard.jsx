import { Facebook, Instagram } from "@mui/icons-material";
import { AiOutlineTikTok } from "react-icons/ai";

export default function SocialAccountCard({
    provider,
    accounts = [], // Array of connected accounts: { id, name, avatar }
    onConnect,
    onDisconnect,
}) {
    const config = {
        instagram: {
            name: "Instagram",
            icon: <Instagram className="w-6 h-6" />,
            gradient: "from-purple-500 via-pink-500 to-orange-500",
            bg: "bg-linear-to-br",
            textColor: "text-white",
        },
        facebook: {
            name: "Facebook",
            icon: <Facebook className="w-6 h-6" />,
            gradient: "from-blue-600 to-blue-700",
            bg: "bg-gradient-to-br",
            textColor: "text-white",
        },
        tiktok: {
            name: "TikTok",
            icon: <AiOutlineTikTok className="w-6 h-6" />,
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
