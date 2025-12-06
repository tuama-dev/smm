import React, { useState, useMemo, useEffect } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, Link } from "@inertiajs/react";
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import {
    DndContext,
    useSensor,
    useSensors,
    MouseSensor,
    TouchSensor,
    DragOverlay,
    useDraggable,
    useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

// ---- MOCK DATA ----
const generateMockScheduledPosts = () => {
    // Helper to get a date relative to today
    const getRelativeDate = (daysOffset) => {
        const date = new Date();
        date.setDate(date.getDate() + daysOffset);
        return date.toISOString().split("T")[0];
    };

    // Helper to get day + offset but keep time
    const posts = [
        {
            title: "Summer Sale Announcement",
            status: "published",
            date: getRelativeDate(-2),
            platform: "instagram",
            time: "09:00",
        },
        {
            title: "Product Teaser Video",
            status: "published",
            date: getRelativeDate(-1),
            platform: "tiktok",
            time: "14:30",
        },
        {
            title: "Weekly Roundup",
            status: "scheduled",
            date: getRelativeDate(0),
            platform: "facebook",
            time: "10:00",
        }, // Today
        {
            title: "Meme Monday",
            status: "scheduled",
            date: getRelativeDate(2),
            platform: "instagram",
            time: "11:00",
        },
        {
            title: "Influencer Collab",
            status: "draft",
            date: getRelativeDate(3),
            platform: "instagram",
            time: "16:00",
        },
        {
            title: "Flash Sale Alert",
            status: "scheduled",
            date: getRelativeDate(5),
            platform: "facebook",
            time: "12:00",
        },
        {
            title: "Community Spotlight",
            status: "scheduled",
            date: getRelativeDate(10),
            platform: "instagram",
            time: "09:30",
        },
        {
            title: "New Feature Launch",
            status: "scheduled",
            date: getRelativeDate(15),
            platform: "facebook",
            time: "13:00",
        },
        {
            title: "Holiday Special",
            status: "draft",
            date: getRelativeDate(20),
            platform: "tiktok",
            time: "15:45",
        },
        {
            title: "Failed Upload Retry",
            status: "failed",
            date: getRelativeDate(-5),
            platform: "instagram",
            time: "08:15",
        },
    ];

    return posts.map((post, index) => ({
        id: `post-${index + 1}`,
        // Extract numeric ID for link generation if needed, or use full string ID
        numericId: index + 1,
        ...post,
    }));
};

// ---- COMPONENTS ----

const StatusBadge = ({ status }) => {
    const colors = {
        draft: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        scheduled:
            "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        published:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    };

    return (
        <span
            className={`px-2 py-0.5 text-[10px] font-medium rounded-md capitalize ${
                colors[status] || colors.draft
            }`}
        >
            {status}
        </span>
    );
};

// Draggable Post Card
const DraggablePost = ({ post }) => {
    const isPublished = post.status === "published";
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({
            id: post.id,
            data: post,
            disabled: isPublished,
        });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="opacity-50 p-1.5 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm"
            >
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`group/card relative p-1.5 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-xs transition-all text-xs touch-none
                ${
                    isPublished
                        ? "opacity-75 cursor-not-allowed bg-gray-50/50 dark:bg-gray-800/50"
                        : "hover:shadow-md hover:border-primary-300 dark:hover:border-primary-500 cursor-grab active:cursor-grabbing"
                }
            `}
        >
            {/* Edit Link - Stop propagation to prevent drag start */}
            <Link
                href={`/posts/${post.numericId}/edit`}
                className="absolute top-1 right-1 p-1 rounded-md opacity-0 group-hover/card:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-400 hover:text-primary-600 transition-all z-20"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                title="Edit Post"
            >
                <EditIcon className="w-3.5 h-3.5" />
            </Link>

            <div className="flex flex-col gap-0.5">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">
                        {post.time}
                    </span>
                    <StatusBadge status={post.status} />
                </div>
                <span
                    className="font-medium text-gray-900 dark:text-white truncate pr-4"
                    title={post.title}
                >
                    {post.title}
                </span>
                <span className="text-[10px] text-gray-400 capitalize">
                    {post.platform}
                </span>
            </div>
        </div>
    );
};

// Droppable Calendar Cell
const DroppableDay = ({ date, isToday, isCurrentMonth, children }) => {
    const dateStr = date.toISOString().split("T")[0];
    const { isOver, setNodeRef } = useDroppable({
        id: dateStr,
        data: { date: dateStr }, // Pass date string as data
    });

    return (
        <div
            ref={setNodeRef}
            className={`group relative border-b border-r border-gray-100 dark:border-gray-700/50 p-2 min-h-[120px] transition-colors 
            ${
                isOver
                    ? "bg-primary-50 dark:bg-primary-900/20 ring-2 ring-inset ring-primary-500/50 z-10"
                    : "hover:bg-gray-50/50 dark:hover:bg-gray-700/20"
            }
            ${
                !isCurrentMonth
                    ? "bg-gray-50/50 dark:bg-gray-800/30"
                    : "bg-white dark:bg-gray-800"
            }
            ${isToday && !isOver ? "bg-blue-50/30 dark:bg-blue-900/10" : ""}`}
        >
            <div className="flex justify-between items-start mb-1">
                <span
                    className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium ${
                        isToday
                            ? "bg-primary-600 text-white shadow-sm"
                            : "text-gray-700 dark:text-gray-300"
                    }`}
                >
                    {date.getDate()}
                </span>
            </div>
            <div className="space-y-1">{children}</div>
        </div>
    );
};

const CalendarView = ({ posts, onDateChange, year, month, onChangeMonth }) => {
    // Helper to get calendar grid days
    const getCalendarDays = () => {
        const firstDayOfMonth = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
        const prevMonthDays = [];

        // Fill previous month days
        for (let i = 0; i < firstDayOfWeek; i++) {
            const d = new Date(year, month, 1);
            d.setDate(d.getDate() - (firstDayOfWeek - i));
            prevMonthDays.push(d);
        }

        const currentMonthDays = [];
        for (let i = 1; i <= daysInMonth; i++) {
            currentMonthDays.push(new Date(year, month, i));
        }

        const daysNeeded =
            42 - (prevMonthDays.length + currentMonthDays.length);
        const nextMonthDays = [];
        for (let i = 1; i <= daysNeeded; i++) {
            nextMonthDays.push(new Date(year, month + 1, i));
        }

        return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
    };

    const calendarDays = getCalendarDays();

    const isSameDate = (d1, d2) => {
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        );
    };

    return (
        <div className="border rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-sm">
            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                        <div
                            key={day}
                            className="py-3 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                        >
                            {day}
                        </div>
                    )
                )}
            </div>

            <div className="grid grid-cols-7 auto-rows-[minmax(120px,auto)] text-sm">
                {calendarDays.map((date, index) => {
                    const dateStr = date.toISOString().split("T")[0];
                    const dayPosts = posts.filter((p) => p.date === dateStr);
                    const isToday = isSameDate(date, new Date());
                    const isCurrentMonth = date.getMonth() === month;

                    return (
                        <DroppableDay
                            key={index}
                            date={date}
                            isToday={isToday}
                            isCurrentMonth={isCurrentMonth}
                        >
                            {dayPosts.map((post) => (
                                <DraggablePost key={post.id} post={post} />
                            ))}
                        </DroppableDay>
                    );
                })}
            </div>
        </div>
    );
};

export default function Scheduled() {
    // Generate initial posts once
    const [posts, setPosts] = useState(() => generateMockScheduledPosts());

    const [currentDate, setCurrentDate] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState("");
    const [activeId, setActiveId] = useState(null);
    const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
    const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

    // DnD Sensors
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 10, // Require 10px movement before drag starts
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        })
    );

    // Backend Update Stub
    const updatePostDate = async (postId, newDate) => {
        // In a real scenario, this would be an API call
        // await axios.patch(route('posts.update-schedule', postId), { date: newDate });
        console.log(
            `[API STUB] Updating Post ID: ${postId} to Date: ${newDate}`
        );
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (over && active.id !== over.id) {
            // over.id is the date string from DroppableDay
            const newDate = over.id;

            setPosts((prevPosts) => {
                return prevPosts.map((post) => {
                    if (post.id === active.id) {
                        // Call backend stub
                        updatePostDate(post.numericId || post.id, newDate);

                        return {
                            ...post,
                            date: newDate,
                            status: "scheduled",
                        };
                    }
                    return post;
                });
            });
        }
    };

    const activePost = activeId ? posts.find((p) => p.id === activeId) : null;

    // Filter Logic
    const filteredPosts = useMemo(() => {
        let items = posts;
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            items = items.filter(
                (post) =>
                    post.title.toLowerCase().includes(lowerQuery) ||
                    post.platform.toLowerCase().includes(lowerQuery) ||
                    post.status.toLowerCase().includes(lowerQuery) ||
                    (post.date && post.date.includes(lowerQuery))
            );
        }
        return items;
    }, [posts, searchQuery]);

    const handleMonthChange = (e) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(parseInt(e.target.value));
        setCurrentDate(newDate);
    };

    const handleYearChange = (e) => {
        const newDate = new Date(currentDate);
        newDate.setFullYear(parseInt(e.target.value));
        setCurrentDate(newDate);
    };

    const changeMonth = (offset) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setCurrentDate(newDate);
    };

    return (
        <DashboardLayout>
            <Head title="Scheduled Posts" />

            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="py-8 h-full">
                    <div className="max-w-full mx-auto sm:px-6 lg:px-8 h-full flex flex-col">
                        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Scheduled Posts
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Drag and drop posts to reschedule instantly
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
                                {/* Search Bar */}
                                <div className="relative flex-1 sm:min-w-[280px]">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <SearchIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="block w-full pl-10 pr-4 py-2 border-none bg-white dark:bg-gray-800 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 shadow-sm transition-all"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 gap-4 mb-4">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white hidden sm:block">
                                {currentDate.toLocaleString("default", {
                                    month: "long",
                                    year: "numeric",
                                })}
                            </h2>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => changeMonth(-1)}
                                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full border border-gray-200 dark:border-gray-600 transition-colors"
                                >
                                    <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </button>

                                <div className="flex gap-2">
                                    {/* Month Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => {
                                                setIsMonthDropdownOpen(
                                                    !isMonthDropdownOpen
                                                );
                                                setIsYearDropdownOpen(false);
                                            }}
                                            className="flex items-center gap-2 pl-4 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm min-w-[140px] justify-between"
                                        >
                                            <span>
                                                {new Date(
                                                    0,
                                                    currentDate.getMonth()
                                                ).toLocaleString("default", {
                                                    month: "long",
                                                })}
                                            </span>
                                            <ExpandMoreIcon
                                                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                                                    isMonthDropdownOpen
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                            />
                                        </button>

                                        {isMonthDropdownOpen && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-30"
                                                    onClick={() =>
                                                        setIsMonthDropdownOpen(
                                                            false
                                                        )
                                                    }
                                                ></div>
                                                <div className="absolute right-0 top-full mt-2 w-40 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-40 transform origin-top-right transition-all custom-scrollbar">
                                                    {Array.from(
                                                        { length: 12 },
                                                        (_, i) => (
                                                            <button
                                                                key={i}
                                                                onClick={() => {
                                                                    const newDate =
                                                                        new Date(
                                                                            currentDate
                                                                        );
                                                                    newDate.setMonth(
                                                                        i
                                                                    );
                                                                    setCurrentDate(
                                                                        newDate
                                                                    );
                                                                    setIsMonthDropdownOpen(
                                                                        false
                                                                    );
                                                                }}
                                                                className={`w-full flex items-center px-4 py-2 text-sm hover:bg-primary-500 hover:text-white transition-colors ${
                                                                    currentDate.getMonth() ===
                                                                    i
                                                                        ? "text-primary-600 dark:text-primary-400 font-semibold bg-primary-50 dark:bg-primary-900/10"
                                                                        : "text-gray-700 dark:text-gray-300"
                                                                }`}
                                                            >
                                                                {new Date(
                                                                    0,
                                                                    i
                                                                ).toLocaleString(
                                                                    "default",
                                                                    {
                                                                        month: "long",
                                                                    }
                                                                )}
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Year Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => {
                                                setIsYearDropdownOpen(
                                                    !isYearDropdownOpen
                                                );
                                                setIsMonthDropdownOpen(false);
                                            }}
                                            className="flex items-center gap-2 pl-4 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm w-[100px] justify-between"
                                        >
                                            <span>
                                                {currentDate.getFullYear()}
                                            </span>
                                            <ExpandMoreIcon
                                                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                                                    isYearDropdownOpen
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                            />
                                        </button>

                                        {isYearDropdownOpen && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-30"
                                                    onClick={() =>
                                                        setIsYearDropdownOpen(
                                                            false
                                                        )
                                                    }
                                                ></div>
                                                <div className="absolute right-0 top-full mt-2 w-28 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-40 transform origin-top-right transition-all custom-scrollbar">
                                                    {Array.from(
                                                        { length: 10 },
                                                        (_, i) => {
                                                            const y =
                                                                new Date().getFullYear() -
                                                                5 +
                                                                i;
                                                            return (
                                                                <button
                                                                    key={y}
                                                                    onClick={() => {
                                                                        const newDate =
                                                                            new Date(
                                                                                currentDate
                                                                            );
                                                                        newDate.setFullYear(
                                                                            y
                                                                        );
                                                                        setCurrentDate(
                                                                            newDate
                                                                        );
                                                                        setIsYearDropdownOpen(
                                                                            false
                                                                        );
                                                                    }}
                                                                    className={`w-full flex items-center justify-center px-4 py-2 text-sm hover:bg-primary-500 hover:text-white transition-colors ${
                                                                        currentDate.getFullYear() ===
                                                                        y
                                                                            ? "text-primary-600 dark:text-primary-400 font-semibold bg-primary-50 dark:bg-primary-900/10"
                                                                            : "text-gray-700 dark:text-gray-300"
                                                                    }`}
                                                                >
                                                                    {y}
                                                                </button>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => changeMonth(1)}
                                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full border border-gray-200 dark:border-gray-600 transition-colors"
                                >
                                    <ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </button>

                                <button
                                    onClick={() => setCurrentDate(new Date())}
                                    className="ml-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-3 py-2 rounded-lg transition-colors shadow-sm"
                                >
                                    Today
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 min-h-[600px] mb-8">
                            <CalendarView
                                posts={filteredPosts}
                                year={currentDate.getFullYear()}
                                month={currentDate.getMonth()}
                            />
                        </div>
                    </div>
                </div>

                {/* Drag Overlay for smooth visual */}
                <DragOverlay>
                    {activePost ? (
                        <div className="p-2 rounded-md bg-white dark:bg-gray-700 border border-primary-500 shadow-xl opacity-90 w-[180px] rotate-3 cursor-grabbing">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">
                                    {activePost.time}
                                </span>
                                <StatusBadge status={activePost.status} />
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white text-sm">
                                {activePost.title}
                            </span>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </DashboardLayout>
    );
}
