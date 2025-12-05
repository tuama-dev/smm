import { router } from "@inertiajs/react";
import { useState } from "react";

export default function VerifyEmail({ status }) {
    const [resending, setResending] = useState(false);

    const handleResend = () => {
        setResending(true);
        router.post(
            "/email/verification-notification",
            {},
            {
                onFinish: () => setResending(false),
            }
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
                    Verify Your Email
                </h1>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                    Thanks for signing up! We've sent you a verification link to
                    your email address.
                </p>

                {/* Status Message */}
                {status === "verification-link-sent" && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-sm text-green-800 dark:text-green-200 text-center">
                            ✓ A new verification link has been sent to your
                            email address.
                        </p>
                    </div>
                )}

                {/* Instructions */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        Please check your email and click the verification link
                        to continue. If you didn't receive the email, you can
                        request a new one.
                    </p>
                </div>

                {/* Resend Button */}
                <button
                    onClick={handleResend}
                    disabled={resending}
                    className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {resending ? "Sending..." : "Resend Verification Email"}
                </button>

                {/* Info */}
                <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
                    Check your spam folder if you don't see the email within a
                    few minutes.
                </p>
            </div>
        </div>
    );
}
