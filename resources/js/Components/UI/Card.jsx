export default function Card({
    children,
    className = "",
    hoverEffect = false,
    noPadding = false,
    ...props
}) {
    return (
        <div
            className={`
                bg-white dark:bg-gray-800 
                border border-gray-200 dark:border-gray-700 
                rounded-xl overflow-hidden
                ${
                    hoverEffect
                        ? "transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                        : "shadow-sm"
                }
                ${className}
            `}
            {...props}
        >
            <div className={noPadding ? "" : "p-6"}>{children}</div>
        </div>
    );
}
