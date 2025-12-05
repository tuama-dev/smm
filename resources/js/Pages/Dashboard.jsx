import { router, usePage } from "@inertiajs/react";

export default function Dashboard() {
    const { verified } = usePage().props;

    const handleLogout = () => {
        router.post("/logout");
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    {/* Verification Success Message */}
                    {verified && (
                        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <p className="text-sm text-green-800 dark:text-green-200">
                                ✓ Your email has been verified successfully!
                            </p>
                        </div>
                    )}

                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Welcome! You are now authenticated.
                    </p>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
