// 支持的图像文件类型
export const SUPPORTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/bmp",
    "image/svg+xml",
];

// 最大文件大小 (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// 验证文件类型
export const isValidImageType = (file: File): boolean => {
    return SUPPORTED_IMAGE_TYPES.includes(file.type);
};

// 验证文件大小
export const isValidFileSize = (file: File): boolean => {
    return file.size <= MAX_FILE_SIZE;
};

// 验证文件
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
    if (!isValidImageType(file)) {
        return {
            valid: false,
            error: `不支持的文件格式: ${file.type}。支持的格式: JPG, PNG, GIF, WebP, BMP, SVG`,
        };
    }

    if (!isValidFileSize(file)) {
        return {
            valid: false,
            error: `文件过大: ${(file.size / (1024 * 1024)).toFixed(2)}MB。最大支持: 10MB`,
        };
    }

    return { valid: true };
};

// 批量验证文件
export const validateImageFiles = (files: File[]): { validFiles: File[]; errors: string[] } => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach((file) => {
        const validation = validateImageFile(file);
        if (validation.valid) {
            validFiles.push(file);
        } else {
            errors.push(`${file.name}: ${validation.error}`);
        }
    });

    return { validFiles, errors };
};

// 格式化文件大小
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// 从拖拽事件获取文件
export const getFilesFromDragEvent = (event: DragEvent): File[] => {
    const files: File[] = [];

    if (event.dataTransfer?.files) {
        Array.from(event.dataTransfer.files).forEach((file) => {
            files.push(file);
        });
    }

    if (event.dataTransfer?.items) {
        Array.from(event.dataTransfer.items).forEach((item) => {
            if (item.kind === "file") {
                const file = item.getAsFile();
                if (file) {
                    files.push(file);
                }
            }
        });
    }

    return files;
};
