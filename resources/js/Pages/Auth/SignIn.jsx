import { Link, useForm } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import SocialButton from "@/Components/SocialButton";
import Button from "@/Components/UI/Button";
import TextInput from "@/Components/UI/TextInput";
import { route } from "ziggy-js";

export default function SignIn({ error }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("signin"));
    };

    return (
        <AuthLayout
            imagePosition="right"
            title="Welcome Back"
            subtitle="Sign in to continue your journey with us"
        >
            <div className="w-full">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Sign In
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Welcome back! Please enter your details
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-5 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-xs text-red-600 dark:text-red-400">
                            {error}
                        </p>
                    </div>
                )}

                {/* Social Login Buttons */}
                <div className="space-y-2 mb-5">
                    <SocialButton provider="google" />
                    <SocialButton provider="instagram" />
                </div>

                {/* Divider */}
                <div className="relative mb-5">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                            Or sign in with email
                        </span>
                    </div>
                </div>

                {/* Sign In Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <TextInput
                        id="email"
                        label="Email Address"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="john@example.com"
                        autoComplete="email"
                        autoFocus
                        error={errors.email}
                        required
                    />

                    <TextInput
                        id="password"
                        label="Password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        error={errors.password}
                        required
                    />

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between py-1">
                        <div className="flex items-center">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData("remember", e.target.checked)
                                }
                                className="w-4 h-4 text-indigo-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:ring-2"
                            />
                            <label
                                htmlFor="remember"
                                className="ml-2 text-xs text-gray-700 dark:text-gray-300"
                            >
                                Remember me
                            </label>
                        </div>
                        <a
                            href="#"
                            className="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                        >
                            Forgot password?
                        </a>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full mt-2"
                        disabled={processing}
                        isLoading={processing}
                    >
                        Sign In
                    </Button>
                </form>

                {/* Sign Up Link */}
                <div className="mt-5 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?{" "}
                        <Link
                            href={route("signup")}
                            className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
