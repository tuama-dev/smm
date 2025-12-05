import { useCallback, useState } from "react";

export default function MediaUploader({ onFileSelect, error }) {
    const [preview, setPreview] = useState(null);
    const [fileType, setFileType] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = (file) => {
        if (!file) return;

        const type = file.type.split("/")[0];
        if (type !== "image" && type !== "video") {
            alert("Please upload an image or video file.");
            return;
        }

        if (file.size > 50 * 1024 * 1024) {
            // 50MB
            alert("File size must be less than 50MB.");
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setFileType(type);
        onFileSelect(file);
    };

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    }, []);

    const onDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const removeFile = () => {
        setPreview(null);
        setFileType(null);
        onFileSelect(null);
    };

    return (
        <div className="w-full group">
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Media Content
            </label>

            {preview ? (
                <div className="relative rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 shadow-xs group-hover:shadow-md transition-shadow duration-300">
                    {fileType === "video" ? (
                        <video
                            src={preview}
                            controls
                            className="w-full h-80 object-contain bg-black/5 dark:bg-black/20"
                        />
                    ) : (
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-80 object-contain bg-gray-50 dark:bg-gray-900"
                        />
                    )}
                    <div className="absolute inset-0 bg-transparent hover:bg-black/10 transition-colors duration-200" />
                    <button
                        type="button"
                        onClick={removeFile}
                        className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-500 hover:text-red-500 rounded-full shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                    <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-lg text-xs font-medium text-white">
                        {fileType === "video" ? "Video" : "Image"} Preview
                    </div>
                </div>
            ) : (
                <div
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer group ${
                        isDragging
                            ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10 scale-[1.01]"
                            : "border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 bg-white dark:bg-gray-800"
                    }`}
                >
                    <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={(e) => handleFile(e.target.files[0])}
                        accept="image/*,video/*"
                    />
                    <div className="flex flex-col items-center pointer-events-none transform transition-transform duration-300 group-hover:-translate-y-1">
                        <div
                            className={`p-4 rounded-full mb-4 transition-colors duration-300 ${
                                isDragging
                                    ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 group-hover:text-indigo-500"
                            }`}
                        >
                            <svg
                                className="w-8 h-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            Drop your media here
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                            Support for images and videos. High quality preview
                            generation included.
                        </p>
                    </div>
                </div>
            )}

            {error && (
                <div className="mt-3 flex items-center text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/20">
                    <svg
                        className="w-4 h-4 mr-2 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    {error}
                </div>
            )}
        </div>
    );
}
