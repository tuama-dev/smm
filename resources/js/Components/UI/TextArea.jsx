export default function TextArea({
    label,
    id,
    value,
    onChange,
    error,
    placeholder,
    rows = 4,
    required,
    className = "",
    inputClassName = "",
    ...props
}) {
    return (
        <div className={className}>
            {label && (
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >
                    {label}{" "}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <textarea
                id={id}
                value={value}
                onChange={onChange}
                rows={rows}
                className={`w-full px-3 py-2.5 text-sm rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${
                    error
                        ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:ring-primary-500"
                } ${inputClassName}`}
                placeholder={placeholder}
                required={required}
                {...props}
            />
            {error && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}
