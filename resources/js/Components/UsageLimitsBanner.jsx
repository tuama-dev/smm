export default function UsageLimitsBanner({ used, limit }) {
    const percentage = Math.min((used / limit) * 100, 100);
    const isLimitReached = used >= limit;

    return (
        <div className="relative overflow-hidden bg-linear-to-r from-primary-900 to-purple-900 rounded-2xl p-6 text-white shadow-xl">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <svg
                    className="w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0 0 L100 100 M100 0 L0 100"
                        stroke="white"
                        strokeWidth="0.5"
                    />
                </svg>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex-1 w-full">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-primary-100 uppercase tracking-wider">
                            Free Plan Usage
                        </span>
                        <span className="text-sm font-bold text-white">
                            {used} / {limit} Posts
                        </span>
                    </div>

                    <div className="w-full h-3 bg-primary-950/50 rounded-full overflow-hidden backdrop-blur-sm border border-primary-700/30">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ease-out ${
                                isLimitReached
                                    ? "bg-red-500"
                                    : "bg-linear-to-r from-cyan-400 to-primary-400"
                            }`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>

                    <p className="mt-3 text-sm text-primary-200">
                        {isLimitReached
                            ? "You've reached your monthly limit of 3 scheduled posts."
                            : `You can schedule ${
                                  limit - used
                              } more posts this month.`}
                    </p>
                </div>

                <div className="shrink-0 w-full sm:w-auto">
                    <button className="group w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary-900 rounded-xl font-bold hover:bg-primary-50 transition-colors shadow-lg shadow-white/10">
                        <span>Upgrade to Pro</span>
                        <svg
                            className="w-4 h-4 transition-transform group-hover:translate-x-1"
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
                    </button>
                    <p className="mt-2 text-xs text-center text-primary-300">
                        Unlock unlimited posts & advanced analytics
                    </p>
                </div>
            </div>
        </div>
    );
}
