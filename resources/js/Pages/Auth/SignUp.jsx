import { Link, useForm } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import SocialButton from "@/Components/SocialButton";
import Button from "@/Components/UI/Button";
import TextInput from "@/Components/UI/TextInput";
import { route } from "ziggy-js";

export default function SignUp() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        phone: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("signup"));
    };

    return (
        <AuthLayout
            imagePosition="left"
            title="Join Us Today"
            subtitle="Start your journey with us and unlock amazing features"
        >
            <div className="w-full">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Create Account
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Sign up to get started
                    </p>
                </div>

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
                            Or sign up with email
                        </span>
                    </div>
                </div>

                {/* Sign Up Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Name Field */}
                    <TextInput
                        id="name"
                        label="Full Name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        placeholder="John Doe"
                        autoComplete="name"
                        error={errors.name}
                    />

                    {/* Phone Field */}
                    <TextInput
                        id="phone"
                        label={
                            <>
                                Phone Number{" "}
                                <span className="text-gray-400 text-xs">
                                    (Optional)
                                </span>
                            </>
                        }
                        type="tel"
                        value={data.phone}
                        onChange={(e) => setData("phone", e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        autoComplete="tel"
                        error={errors.phone}
                    />

                    {/* Email Field */}
                    <TextInput
                        id="email"
                        label="Email Address"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="john@example.com"
                        autoComplete="email"
                        error={errors.email}
                    />

                    {/* Password Field */}
                    <TextInput
                        id="password"
                        label="Password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        error={errors.password}
                    />

                    {/* Confirm Password Field */}
                    <TextInput
                        id="password_confirmation"
                        label="Confirm Password"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        placeholder="••••••••"
                        autoComplete="new-password"
                    />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full mt-4"
                        disabled={processing}
                        isLoading={processing}
                    >
                        Create Account
                    </Button>
                </form>

                {/* Sign In Link */}
                <div className="mt-5 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{" "}
                        <Link
                            href={route("signin")}
                            className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
