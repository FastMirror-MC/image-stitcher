import { useState, useCallback } from "react";

export interface ImageCropSettings {
    aspectRatio: string;
    cropX?: number;
    cropY?: number;
    cropWidth?: number;
    cropHeight?: number;
}

export interface ImageItem {
    id: string;
    file: File;
    preview: string;
    width?: number;
    height?: number;
    cropSettings?: ImageCropSettings;
}

export interface ImageStoreState {
    images: ImageItem[];
    isUploading: boolean;
    error: string | null;
}

export const useImageStore = () => {
    const [state, setState] = useState<ImageStoreState>({
        images: [],
        isUploading: false,
        error: null,
    });

    const addImages = useCallback((files: File[]) => {
        setState((prev) => ({ ...prev, isUploading: true, error: null }));

        const newImages: ImageItem[] = [];
        let processedCount = 0;

        files.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = e.target?.result as string;

                // 创建图像元素获取尺寸
                const img = new Image();
                img.onload = () => {
                    newImages.push({
                        id: `${Date.now()}-${index}`,
                        file,
                        preview,
                        width: img.width,
                        height: img.height,
                        cropSettings: { aspectRatio: "original" }, // 默认裁切设置
                    });

                    processedCount++;
                    if (processedCount === files.length) {
                        setState((prev) => ({
                            ...prev,
                            images: [...prev.images, ...newImages],
                            isUploading: false,
                        }));
                    }
                };
                img.src = preview;
            };

            reader.onerror = () => {
                setState((prev) => ({
                    ...prev,
                    error: `Failed to read file: ${file.name}`,
                    isUploading: false,
                }));
            };

            reader.readAsDataURL(file);
        });
    }, []);

    const removeImage = useCallback((id: string) => {
        setState((prev) => ({
            ...prev,
            images: prev.images.filter((img) => img.id !== id),
        }));
    }, []);

    const reorderImages = useCallback((startIndex: number, endIndex: number) => {
        setState((prev) => {
            const result = Array.from(prev.images);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            return { ...prev, images: result };
        });
    }, []);

    const updateImageCrop = useCallback((id: string, cropSettings: ImageCropSettings) => {
        setState((prev) => ({
            ...prev,
            images: prev.images.map((img) => (img.id === id ? { ...img, cropSettings } : img)),
        }));
    }, []);

    const clearImages = useCallback(() => {
        setState((prev) => ({
            ...prev,
            images: [],
        }));
    }, []);

    const clearError = useCallback(() => {
        setState((prev) => ({ ...prev, error: null }));
    }, []);

    return {
        ...state,
        addImages,
        removeImage,
        reorderImages,
        updateImageCrop,
        clearImages,
        clearError,
    };
};
