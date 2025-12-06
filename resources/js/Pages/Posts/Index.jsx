import React, { useState, useMemo } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, Link } from "@inertiajs/react";
import CreateIcon from "@mui/icons-material/Create";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import { SiTiktok } from "react-icons/si";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import SearchIcon from "@mui/icons-material/Search";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { route } from "ziggy-js";

// Generate 30+ Mock Posts
const generateMockPosts = () => {
    const posts = [];
    const statuses = ["published", "scheduled", "draft", "failed"];
    const platforms = ["instagram", "facebook", "tiktok"];
    const accountNames = [
        "@brandofficial",
        "@brandproducts",
        "Brand Page",
        "@brand_community",
    ];
    const captions = [
        "Getting ready for the big reveal! ☀️ #summer2024",
        "Wait for it... 🔥",
        "Start your week right! 💪",
        "Check out what's new! 🚀",
        "We love our community! ❤️",
        "24 hours only! ⏰",
        "Behind the scenes 👀",
        "Product launch countdown 3...2...1...",
        "Customer appreciation post",
        "Weekend vibes ✨",
    ];

    for (let i = 1; i <= 35; i++) {
        const randomStatus =
            statuses[Math.floor(Math.random() * statuses.length)];
        const randomPlatformCount = Math.floor(Math.random() * 2) + 1; // 1 or 2 accounts
        const postAccounts = [];

        for (let j = 0; j < randomPlatformCount; j++) {
            postAccounts.push({
                platform:
                    platforms[Math.floor(Math.random() * platforms.length)],
                name: accountNames[
                    Math.floor(Math.random() * accountNames.length)
                ],
            });
        }

        posts.push({
            id: i,
            title: `Post Campaign #${i} - ${captions[
                i % captions.length
            ].substring(0, 15)}...`,
            caption: captions[i % captions.length],
            accounts: postAccounts,
            status: randomStatus,
            scheduled_at:
                randomStatus === "scheduled" || randomStatus === "published"
                    ? `2024-06-${(10 + (i % 20))
                          .toString()
                          .padStart(2, "0")} 10:00 AM`
                    : null,
            thumbnail:
                i % 3 === 0
                    ? `https://images.unsplash.com/photo-${
                          1500000000000 + i
                      }?w=100&h=100&fit=crop`
                    : null,
        });
    }
    return posts;
};

const MOCK_POSTS = generateMockPosts();

export default function Index({ posts = [] }) {
    // Use mock data if no posts provided (for dev)
    const initialPosts = posts.length > 0 ? posts : MOCK_POSTS;

    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isRowsDropdownOpen, setIsRowsDropdownOpen] = useState(false);

    // Filter, Sort, then Paginate
    const processedPosts = useMemo(() => {
        let items = [...initialPosts];

        // 1. Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            items = items.filter(
                (post) =>
                    post.title.toLowerCase().includes(query) ||
                    post.caption?.toLowerCase().includes(query) ||
                    post.status.toLowerCase().includes(query)
            );
        }

        // 2. Sort
        if (sortConfig.key !== null) {
            items.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Handle nulls
                if (aValue === null && bValue === null) return 0;
                if (aValue === null) return 1;
                if (bValue === null) return -1;

                if (aValue < bValue) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        }

        return items;
    }, [initialPosts, sortConfig, searchQuery]);

    const totalPages = Math.ceil(processedPosts.length / itemsPerPage);

    // 3. Paginate
    const displayedPosts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return processedPosts.slice(start, start + itemsPerPage);
    }, [processedPosts, currentPage, itemsPerPage]);

    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (columnName) => {
        if (sortConfig.key !== columnName) {
            return (
                <UnfoldMoreIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            );
        }
        return sortConfig.direction === "asc" ? (
            <ArrowUpwardIcon className="w-4 h-4 text-primary-500" />
        ) : (
            <ArrowDownwardIcon className="w-4 h-4 text-primary-500" />
        );
    };

    const getPlatformIcon = (platform) => {
        switch (platform) {
            case "instagram":
                return <InstagramIcon className="w-5 h-5 text-pink-600" />;
            case "facebook":
                return <FacebookIcon className="w-5 h-5 text-blue-600" />;
            case "tiktok":
                return (
                    <SiTiktok className="w-4 h-4 text-black dark:text-white" />
                );
            default:
                return null;
        }
    };

    // Helper to group accounts by platform
    const groupAccountsByPlatform = (accounts) => {
        return accounts.reduce((acc, account) => {
            if (!acc[account.platform]) {
                acc[account.platform] = [];
            }
            acc[account.platform].push(account);
            return acc;
        }, {});
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "published":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
            case "scheduled":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
            case "draft":
                return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
            case "failed":
                return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Delete Modal State
    const [postToDelete, setPostToDelete] = useState(null);

    const handleDeleteClick = (post) => {
        setPostToDelete(post);
    };

    const confirmDelete = () => {
        if (postToDelete) {
            console.log(`Deleting post ${postToDelete.id}`);
            // In a real app, you would make an API call here.
            // axios.delete(route('posts.destroy', postToDelete.id));

            // For now, close modal
            setPostToDelete(null);
        }
    };

    return (
        <DashboardLayout>
            <Head title="All Posts" />

            {/* Delete Confirmation Modal */}
            {postToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm transition-opacity">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 transform transition-all scale-100 border border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4 text-red-600 dark:text-red-400">
                                <DeleteIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                Delete Post?
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                                Are you sure you want to delete{" "}
                                <span className="font-semibold text-gray-900 dark:text-gray-200">
                                    "{postToDelete.title}"
                                </span>
                                ? This action cannot be undone.
                            </p>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setPostToDelete(null)}
                                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium shadow-lg hover:shadow-red-500/30 transition-all transform hover:-translate-y-0.5"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="py-12">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            All Posts
                        </h1>
                        <Link
                            href="/posts/create"
                            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-xl inline-flex items-center gap-2 transform transition hover:scale-105 shadow-md"
                        >
                            <CreateIcon />
                            <span>Create Post</span>
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 font-sans">
                        {/* Controls Bar */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                            {/* Search */}
                            <div className="relative w-full sm:w-72">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search posts..."
                                    className="block w-full pl-10 pr-4 py-2.5 border-none bg-gray-100 dark:bg-gray-700/50 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                            </div>

                            {/* Rows Per Page - Custom Styled */}
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Rows per page:
                                </span>
                                <div className="relative">
                                    <button
                                        onClick={() =>
                                            setIsRowsDropdownOpen(
                                                !isRowsDropdownOpen
                                            )
                                        }
                                        className="flex items-center gap-2 pl-4 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm"
                                    >
                                        <span>{itemsPerPage}</span>
                                        <ExpandMoreIcon
                                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                                                isRowsDropdownOpen
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                        />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isRowsDropdownOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-30"
                                                onClick={() =>
                                                    setIsRowsDropdownOpen(false)
                                                }
                                            ></div>
                                            <div className="absolute right-0 top-full mt-2 w-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-40 transform origin-top-right transition-all">
                                                {[5, 10, 20, 50].map(
                                                    (value) => (
                                                        <button
                                                            key={value}
                                                            onClick={() => {
                                                                setItemsPerPage(
                                                                    value
                                                                );
                                                                setCurrentPage(
                                                                    1
                                                                );
                                                                setIsRowsDropdownOpen(
                                                                    false
                                                                );
                                                            }}
                                                            className={`w-full flex items-center justify-center px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                                                                itemsPerPage ===
                                                                value
                                                                    ? "text-primary-600 dark:text-primary-400 font-semibold bg-primary-50 dark:bg-primary-900/10"
                                                                    : "text-gray-700 dark:text-gray-300"
                                                            }`}
                                                        >
                                                            {value}
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {displayedPosts.length > 0 ? (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50/50 dark:bg-gray-700/20">
                                            <tr>
                                                <th
                                                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer group transition-colors select-none"
                                                    onClick={() =>
                                                        requestSort("title")
                                                    }
                                                >
                                                    <div className="flex items-center gap-2 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                                                        Content
                                                        {getSortIcon("title")}
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Platforms
                                                </th>
                                                <th
                                                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer group transition-colors select-none"
                                                    onClick={() =>
                                                        requestSort("status")
                                                    }
                                                >
                                                    <div className="flex items-center gap-2 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                                                        Status
                                                        {getSortIcon("status")}
                                                    </div>
                                                </th>
                                                <th
                                                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer group transition-colors select-none"
                                                    onClick={() =>
                                                        requestSort(
                                                            "scheduled_at"
                                                        )
                                                    }
                                                >
                                                    <div className="flex items-center gap-2 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                                                        Schedule
                                                        {getSortIcon(
                                                            "scheduled_at"
                                                        )}
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700/50">
                                            {displayedPosts.map((post) => {
                                                const groupedAccounts =
                                                    groupAccountsByPlatform(
                                                        post.accounts || []
                                                    );

                                                return (
                                                    <tr
                                                        key={post.id}
                                                        className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors group"
                                                    >
                                                        {/* Content Column */}
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 relative group-hover:shadow-sm transition-shadow">
                                                                    {post.thumbnail ? (
                                                                        <img
                                                                            className="h-full w-full object-cover"
                                                                            src={
                                                                                post.thumbnail
                                                                            }
                                                                            alt=""
                                                                            onError={(
                                                                                e
                                                                            ) => {
                                                                                e.target.onerror =
                                                                                    null;
                                                                                e.target.style.display =
                                                                                    "none";
                                                                                e.target.parentNode.classList.add(
                                                                                    "flex",
                                                                                    "items-center",
                                                                                    "justify-center"
                                                                                );
                                                                                e.target.parentNode.innerHTML =
                                                                                    '<div class="text-xs text-gray-400">No Img</div>';
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs text-center p-1 bg-gray-50 dark:bg-gray-800">
                                                                            No
                                                                            Image
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">
                                                                        {
                                                                            post.title
                                                                        }
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                                                                        {
                                                                            post.caption
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        {/* Platforms Column */}
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex gap-2">
                                                                {Object.entries(
                                                                    groupedAccounts
                                                                ).map(
                                                                    ([
                                                                        platform,
                                                                        accounts,
                                                                    ]) => (
                                                                        <div
                                                                            key={
                                                                                platform
                                                                            }
                                                                            className="relative inline-flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-600 shadow-sm group cursor-help hover:-translate-y-0.5 transition-transform"
                                                                            title={`${
                                                                                platform
                                                                                    .charAt(
                                                                                        0
                                                                                    )
                                                                                    .toUpperCase() +
                                                                                platform.slice(
                                                                                    1
                                                                                )
                                                                            }: ${accounts
                                                                                .map(
                                                                                    (
                                                                                        a
                                                                                    ) =>
                                                                                        a.name
                                                                                )
                                                                                .join(
                                                                                    ", "
                                                                                )}`}
                                                                        >
                                                                            {getPlatformIcon(
                                                                                platform
                                                                            )}
                                                                            {accounts.length >
                                                                                1 && (
                                                                                <span className="absolute -top-1 -right-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-[9px] font-bold px-1 rounded-full min-w-[14px] h-[14px] flex items-center justify-center border-2 border-white dark:border-gray-800">
                                                                                    {
                                                                                        accounts.length
                                                                                    }
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </td>
                                                        {/* Status Column */}
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span
                                                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize shadow-sm ${getStatusColor(
                                                                    post.status
                                                                )}`}
                                                            >
                                                                {post.status}
                                                            </span>
                                                        </td>
                                                        {/* Schedule Column */}
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                            {post.scheduled_at ? (
                                                                <span className="font-medium text-gray-600 dark:text-gray-300">
                                                                    {
                                                                        post.scheduled_at
                                                                    }
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400 italic text-xs">
                                                                    Not
                                                                    scheduled
                                                                </span>
                                                            )}
                                                        </td>
                                                        {/* Actions Column */}
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Link
                                                                    href={route(
                                                                        "posts.edit",
                                                                        post.id
                                                                    )}
                                                                    className="p-1 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                                                >
                                                                    <EditIcon className="w-5 h-5" />
                                                                </Link>
                                                                <button
                                                                    onClick={() =>
                                                                        handleDeleteClick(
                                                                            post
                                                                        )
                                                                    }
                                                                    className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                                                >
                                                                    <DeleteIcon className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination Footer */}
                                <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between sm:px-6">
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                Showing{" "}
                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                    {processedPosts.length > 0
                                                        ? (currentPage - 1) *
                                                              itemsPerPage +
                                                          1
                                                        : 0}
                                                </span>{" "}
                                                to{" "}
                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                    {Math.min(
                                                        currentPage *
                                                            itemsPerPage,
                                                        processedPosts.length
                                                    )}
                                                </span>{" "}
                                                of{" "}
                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                    {processedPosts.length}
                                                </span>{" "}
                                                results
                                            </p>
                                        </div>
                                        <div>
                                            <nav
                                                className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px"
                                                aria-label="Pagination"
                                            >
                                                <button
                                                    onClick={() =>
                                                        handlePageChange(
                                                            currentPage - 1
                                                        )
                                                    }
                                                    disabled={currentPage === 1}
                                                    className={`relative inline-flex items-center px-3 py-2 rounded-l-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium ${
                                                        currentPage === 1
                                                            ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                                                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
                                                    }`}
                                                >
                                                    <span className="sr-only">
                                                        Previous
                                                    </span>
                                                    <ChevronLeftIcon
                                                        className="h-5 w-5"
                                                        aria-hidden="true"
                                                    />
                                                </button>

                                                {/* Simple Page Numbers */}
                                                {[...Array(totalPages)].map(
                                                    (_, idx) => (
                                                        <button
                                                            key={idx + 1}
                                                            onClick={() =>
                                                                handlePageChange(
                                                                    idx + 1
                                                                )
                                                            }
                                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                currentPage ===
                                                                idx + 1
                                                                    ? "z-10 bg-primary-600 border-primary-600 text-white"
                                                                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
                                                            }`}
                                                        >
                                                            {idx + 1}
                                                        </button>
                                                    )
                                                )}

                                                <button
                                                    onClick={() =>
                                                        handlePageChange(
                                                            currentPage + 1
                                                        )
                                                    }
                                                    disabled={
                                                        currentPage ===
                                                            totalPages ||
                                                        totalPages === 0
                                                    }
                                                    className={`relative inline-flex items-center px-3 py-2 rounded-r-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium ${
                                                        currentPage ===
                                                            totalPages ||
                                                        totalPages === 0
                                                            ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                                                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
                                                    }`}
                                                >
                                                    <span className="sr-only">
                                                        Next
                                                    </span>
                                                    <ChevronRightIcon
                                                        className="h-5 w-5"
                                                        aria-hidden="true"
                                                    />
                                                </button>
                                            </nav>
                                        </div>
                                    </div>
                                    {/* Mobile Pagination View */}
                                    <div className="flex items-center justify-between sm:hidden w-full gap-2">
                                        <button
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage - 1
                                                )
                                            }
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        <span className="text-sm text-gray-700 dark:text-gray-400">
                                            Page {currentPage} of{" "}
                                            {totalPages || 1}
                                        </span>
                                        <button
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage + 1
                                                )
                                            }
                                            disabled={
                                                currentPage === totalPages ||
                                                totalPages === 0
                                            }
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-20 px-6">
                                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900/20 mb-6">
                                    <SearchIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    No posts found
                                </h3>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                                    {posts.length === 0
                                        ? "Get started by creating your first post."
                                        : "Try adjusting your search terms."}
                                </p>
                                {posts.length === 0 && (
                                    <div className="mt-6">
                                        <Link
                                            href="/posts/create"
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                        >
                                            <CreateIcon
                                                className="-ml-1 mr-2 h-5 w-5"
                                                aria-hidden="true"
                                            />
                                            Create New Post
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
