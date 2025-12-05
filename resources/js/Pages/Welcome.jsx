export default function Welcome({ name = "Guest" }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Welcome to Inertia.js + React!
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Hello, {name}! Your Inertia.js setup with React is working
                    correctly.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        🎉 You're now ready to build amazing things with Laravel
                        + Inertia.js + React!
                    </p>
                </div>
            </div>
        </div>
    );
}
