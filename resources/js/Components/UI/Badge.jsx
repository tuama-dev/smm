export default function Badge({
    variant = "neutral", // success, warning, error, info, neutral, purple
    pulsing = false,
    className = "",
    children,
}) {
    const variants = {
        success:
            "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30 border-green-200 dark:border-green-800",
        warning:
            "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800",
        error: "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30 border-red-200 dark:border-red-800",
        info: "text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
        neutral:
            "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700 border-gray-200 dark:border-gray-600",
        purple: "text-purple-700 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800",
    };

    const pulseColor = {
        success: "bg-green-500",
        warning: "bg-amber-500",
        error: "bg-red-500",
        info: "bg-blue-500",
        neutral: "bg-gray-400",
        purple: "bg-purple-500",
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${variants[variant]} ${className}`}
        >
            {pulsing && (
                <span className="relative flex h-2 w-2">
                    <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pulseColor[variant]}`}
                    ></span>
                    <span
                        className={`relative inline-flex rounded-full h-2 w-2 ${pulseColor[variant]}`}
                    ></span>
                </span>
            )}
            {children}
        </span>
    );
}
