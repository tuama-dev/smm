import React from "react";
import { Head, useForm } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import MediaUploader from "@/Components/MediaUploader";
import CreateIcon from "@mui/icons-material/Create";
import PublicIcon from "@mui/icons-material/Public";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import { SiTiktok } from "react-icons/si";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { route } from "ziggy-js";

export default function Create({ post = null }) {
    const isEditMode = !!post;

    const {
        data,
        setData,
        post: store,
        put,
        processing,
        errors,
    } = useForm({
        title: post?.title || "",
        media: post?.media || null, // Note: Handling file inputs for edit is tricky, usually requires separate handling for existing vs new media
        caption: post?.caption || "",
        platforms: post?.platforms || [],
        selectedAccounts: post?.selectedAccounts || {},
        scheduled_at: post?.scheduled_at || "",
    });

    const [currentStep, setCurrentStep] = React.useState(1);
    const totalSteps = 2;

    const steps = [
        { number: 1, name: "Post Content", icon: <CreateIcon /> },
        { number: 2, name: "Select Platforms", icon: <PublicIcon /> },
    ];

    // Mock account data (Keep existing mock data...)
    const mockAccounts = {
        instagram: [
            {
                id: 1,
                name: "@brandofficial",
                followers: "125K",
                avatar: "https://ui-avatars.com/api/?name=Brand+Official&background=E1306C&color=fff",
            },
            {
                id: 2,
                name: "@brandproducts",
                followers: "45K",
                avatar: "https://ui-avatars.com/api/?name=Brand+Products&background=C13584&color=fff",
            },
            {
                id: 3,
                name: "@brandceo",
                followers: "12K",
                avatar: "https://ui-avatars.com/api/?name=Brand+CEO&background=833AB4&color=fff",
            },
        ],
        facebook: [
            {
                id: 4,
                name: "Brand Official Page",
                followers: "250K",
                avatar: "https://ui-avatars.com/api/?name=Brand+Page&background=1877F2&color=fff",
            },
            {
                id: 5,
                name: "Brand Community",
                followers: "80K",
                avatar: "https://ui-avatars.com/api/?name=Brand+Community&background=4267B2&color=fff",
            },
        ],
        tiktok: [
            {
                id: 6,
                name: "@brand_official",
                followers: "500K",
                avatar: "https://ui-avatars.com/api/?name=Brand+TikTok&background=000000&color=fff",
            },
            {
                id: 7,
                name: "@brand_fun",
                followers: "200K",
                avatar: "https://ui-avatars.com/api/?name=Brand+Fun&background=25F4EE&color=000",
            },
            {
                id: 8,
                name: "@brand_tutorials",
                followers: "150K",
                avatar: "https://ui-avatars.com/api/?name=Brand+Tutorials&background=FE2C55&color=fff",
            },
        ],
    };

    const platforms = [
        {
            id: "instagram",
            name: "Instagram",
            icon: <InstagramIcon className="w-5 h-5" />,
            border: "border-pink-500",
            text: "text-pink-600 dark:text-pink-400",
        },
        {
            id: "facebook",
            name: "Facebook",
            icon: <FacebookIcon className="w-5 h-5" />,
            border: "border-blue-500",
            text: "text-blue-600 dark:text-blue-400",
        },
        {
            id: "tiktok",
            name: "TikTok",
            icon: <SiTiktok className="w-5 h-5" />,
            border: "border-gray-900 dark:border-gray-100",
            text: "text-gray-900 dark:text-white",
        },
    ];

    const togglePlatform = (id) => {
        const current = data.platforms;
        const index = current.indexOf(id);

        if (index === -1) {
            setData((prevData) => ({
                ...prevData,
                platforms: [...current, id],
                selectedAccounts: {
                    ...prevData.selectedAccounts,
                    [id]: [],
                },
            }));
        } else {
            const newSelectedAccounts = { ...data.selectedAccounts };
            delete newSelectedAccounts[id];
            setData((prevData) => ({
                ...prevData,
                platforms: current.filter((p) => p !== id),
                selectedAccounts: newSelectedAccounts,
            }));
        }
    };

    const toggleAccount = (platformId, accountId) => {
        const currentAccounts = data.selectedAccounts[platformId] || [];
        const index = currentAccounts.indexOf(accountId);

        if (index === -1) {
            setData("selectedAccounts", {
                ...data.selectedAccounts,
                [platformId]: [...currentAccounts, accountId],
            });
        } else {
            setData("selectedAccounts", {
                ...data.selectedAccounts,
                [platformId]: currentAccounts.filter((id) => id !== accountId),
            });
        }
    };

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const previousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentStep < totalSteps) {
            nextStep();
        } else {
            if (isEditMode) {
                // Update existing post
                put(route("posts.update", post.id));
            } else {
                // Create new post
                store(route("posts.store"));
            }
        }
    };

    return (
        <DashboardLayout>
            <Head title={isEditMode ? "Edit Post" : "Schedule Post"} />

            <div className="max-w-full mx-auto py-6 px-4">
                {/* Step Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-4">
                        {steps.map((step, index) => (
                            <React.Fragment key={step.number}>
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                                            currentStep === step.number
                                                ? "bg-primary-500 text-white scale-110 shadow-lg"
                                                : currentStep > step.number
                                                ? "bg-green-500 text-white"
                                                : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                                        }`}
                                    >
                                        {currentStep > step.number ? (
                                            <CheckCircleIcon className="w-6 h-6" />
                                        ) : (
                                            step.icon
                                        )}
                                    </div>
                                    <span
                                        className={`mt-2 text-sm font-medium ${
                                            currentStep === step.number
                                                ? "text-primary-500"
                                                : "text-gray-500 dark:text-gray-400"
                                        }`}
                                    >
                                        {step.name}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="flex-1 h-1 max-w-[100px] mt-[-24px]">
                                        <div
                                            className={`h-full rounded-full transition-all duration-300 ${
                                                currentStep > step.number
                                                    ? "bg-green-500"
                                                    : "bg-gray-200 dark:bg-gray-700"
                                            }`}
                                        ></div>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Step 1: Post Content */}
                    {currentStep === 1 && (
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 space-y-6 animate-fade-in-up">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                {isEditMode ? "Edit Post" : "Create Your Post"}
                            </h2>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                    Post Title{" "}
                                    <span className="text-gray-400 font-normal">
                                        (Internal Name)
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 p-4"
                                    placeholder="e.g., Summer Campaign Launch"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                />
                                {errors.title && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Media */}
                            <div>
                                <MediaUploader
                                    onFileSelect={(file) =>
                                        setData("media", file)
                                    }
                                    error={errors.media}
                                />
                            </div>

                            {/* Caption */}
                            <div>
                                <label className="flex justify-between text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                    <span>Caption</span>
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full ${
                                            data.caption.length > 2000
                                                ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                                                : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                                        }`}
                                    >
                                        {data.caption.length} / 2200
                                    </span>
                                </label>
                                <textarea
                                    rows="6"
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none p-4"
                                    placeholder="Write a catchy caption..."
                                    value={data.caption}
                                    onChange={(e) =>
                                        setData("caption", e.target.value)
                                    }
                                />
                                {errors.caption && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.caption}
                                    </p>
                                )}
                            </div>

                            {/* Schedule Time */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                    Schedule Time
                                </label>
                                <input
                                    type="datetime-local"
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 p-4"
                                    value={data.scheduled_at}
                                    onChange={(e) =>
                                        setData("scheduled_at", e.target.value)
                                    }
                                    min={new Date().toISOString().slice(0, 16)}
                                />
                                {errors.scheduled_at && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.scheduled_at}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Platform & Account Selection */}
                    {currentStep === 2 && (
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 space-y-6 animate-fade-in-up">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Select Platforms & Accounts
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                                {platforms.map((platform) => {
                                    const isSelected = data.platforms.includes(
                                        platform.id
                                    );
                                    return (
                                        <div
                                            key={platform.id}
                                            className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-4 transition-all h-fit"
                                        >
                                            {/* Platform Header */}
                                            <label className="flex items-center gap-4 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 text-primary-500 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
                                                    checked={isSelected}
                                                    onChange={() =>
                                                        togglePlatform(
                                                            platform.id
                                                        )
                                                    }
                                                />
                                                <div
                                                    className={`p-2 rounded-lg ${
                                                        isSelected
                                                            ? platform.text
                                                            : "text-gray-400"
                                                    }`}
                                                >
                                                    {platform.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <div
                                                        className={`font-bold ${
                                                            isSelected
                                                                ? platform.text
                                                                : "text-gray-700 dark:text-gray-300"
                                                        }`}
                                                    >
                                                        {platform.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {isSelected
                                                            ? `${
                                                                  (
                                                                      data
                                                                          .selectedAccounts[
                                                                          platform
                                                                              .id
                                                                      ] || []
                                                                  ).length
                                                              } of ${
                                                                  mockAccounts[
                                                                      platform
                                                                          .id
                                                                  ].length
                                                              } accounts selected`
                                                            : "Click to select"}
                                                    </div>
                                                </div>
                                            </label>

                                            {/* Account List */}
                                            {isSelected && (
                                                <div className="mt-4 ml-9 space-y-2 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                                                    {mockAccounts[
                                                        platform.id
                                                    ].map((account) => (
                                                        <label
                                                            key={account.id}
                                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                className="w-4 h-4 text-primary-500 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
                                                                checked={(
                                                                    data
                                                                        .selectedAccounts[
                                                                        platform
                                                                            .id
                                                                    ] || []
                                                                ).includes(
                                                                    account.id
                                                                )}
                                                                onChange={() =>
                                                                    toggleAccount(
                                                                        platform.id,
                                                                        account.id
                                                                    )
                                                                }
                                                            />
                                                            <img
                                                                src={
                                                                    account.avatar
                                                                }
                                                                alt={
                                                                    account.name
                                                                }
                                                                className="w-8 h-8 rounded-full"
                                                            />
                                                            <div className="flex-1">
                                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                    {
                                                                        account.name
                                                                    }
                                                                </div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                    {
                                                                        account.followers
                                                                    }{" "}
                                                                    followers
                                                                </div>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {errors.platforms && (
                                <p className="text-sm text-red-600">
                                    {errors.platforms}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-4">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={previousStep}
                                className="flex-1 py-4 px-6 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <ArrowBackIcon className="w-5 h-5" />
                                Back
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 py-4 px-6 bg-linear-to-br from-primary-500 via-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                "Processing..."
                            ) : currentStep < totalSteps ? (
                                <>
                                    Next
                                    <ArrowForwardIcon className="w-5 h-5" />
                                </>
                            ) : (
                                <>
                                    {isEditMode
                                        ? "Update Post"
                                        : "Schedule Post"}
                                    <RocketLaunchIcon className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
