export default function AuthLayout({
    children,
    imagePosition = "left",
    title,
    subtitle,
}) {
    const isImageLeft = imagePosition === "left";

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
                {/* Image Section */}
                <div
                    className={`relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-12 flex flex-col justify-center items-center text-white ${
                        isImageLeft ? "lg:order-1" : "lg:order-2"
                    }`}
                >
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative z-10 text-center max-w-md">
                        <div className="mb-8">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full mx-auto mb-6 flex items-center justify-center">
                                <svg
                                    className="w-10 h-10"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-4xl font-bold mb-4">{title}</h2>
                        <p className="text-lg text-white/90">{subtitle}</p>

                        {/* Decorative elements */}
                        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    </div>
                </div>

                {/* Form Section */}
                <div
                    className={`p-6 lg:p-10 flex flex-col justify-center bg-white dark:bg-gray-800 ${
                        isImageLeft ? "lg:order-2" : "lg:order-1"
                    }`}
                >
                    <div className="w-full max-w-md mx-auto">{children}</div>
                </div>
            </div>
        </div>
    );
}
