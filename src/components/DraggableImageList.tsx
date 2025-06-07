import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Eye, X } from 'lucide-react';
import type { ImageItem } from '@/hooks/useImageStore';
import type { MergeOptions } from '@/hooks/useMergeOptions';
import { cn } from '@/lib/utils';

interface DraggableImageListProps {
    images: ImageItem[];
    onRemoveImage: (id: string) => void;
    onReorderImages: (startIndex: number, endIndex: number) => void;
    onClearAll: () => void;
    className?: string;
    options: MergeOptions;
}

// 计算调整后的尺寸（与imageProcessor保持一致）
const calculateResizedDimensions = (
    originalWidth: number,
    originalHeight: number,
    targetWidth: number,
    targetHeight: number,
    mode: "fit-width" | "fit-height" | "uniform"
): { width: number; height: number } => {
    switch (mode) {
        case "fit-width":
            return {
                width: targetWidth,
                height: (originalHeight * targetWidth) / originalWidth,
            };
        case "fit-height":
            return {
                width: (originalWidth * targetHeight) / originalHeight,
                height: targetHeight,
            };
        case "uniform":
            return {
                width: targetWidth,
                height: targetHeight,
            };
        default:
            return { width: originalWidth, height: originalHeight };
    }
};

// 智能计算统一尺寸（与imageProcessor保持一致）
const calculateUniformDimensions = (
    images: ImageItem[],
    direction: "horizontal" | "vertical"
): { width: number; height: number } => {
    if (images.length === 0) {
        return { width: 0, height: 0 };
    }

    const validImages = images.filter(img => img.width && img.height);
    if (validImages.length === 0) {
        return { width: 0, height: 0 };
    }

    if (direction === "horizontal") {
        const targetHeight = Math.min(...validImages.map((img) => img.height!));
        return { width: 0, height: targetHeight };
    } else {
        const targetWidth = Math.min(...validImages.map((img) => img.width!));
        return { width: targetWidth, height: 0 };
    }
};

// 计算预览尺寸（与imageProcessor逻辑完全一致）
const getPreviewDimensions = (images: ImageItem[], options: MergeOptions, containerWidth: number) => {
    if (!images.length || !options) return null;

    const validImages = images.filter(img => img.width && img.height);
    if (validImages.length === 0) return null;

    const { direction, resizeMode, uniformSize, spacing, borderWidth } = options;

    // 计算每个图片的目标尺寸（完全按照imageProcessor的逻辑）
    const imageDimensions = validImages.map((img) => {
        const originalWidth = img.width!;
        const originalHeight = img.height!;

        if (resizeMode === "none") {
            return { width: originalWidth, height: originalHeight };
        }

        // 如果是智能模式，根据排列方向自动计算统一尺寸
        if (resizeMode === "auto-uniform") {
            const uniformDims = calculateUniformDimensions(validImages, direction);

            if (direction === "horizontal") {
                const targetHeight = uniformDims.height;
                return {
                    width: (originalWidth * targetHeight) / originalHeight,
                    height: targetHeight,
                };
            } else {
                const targetWidth = uniformDims.width;
                return {
                    width: targetWidth,
                    height: (originalHeight * targetWidth) / originalWidth,
                };
            }
        }

        return calculateResizedDimensions(
            originalWidth,
            originalHeight,
            uniformSize.width,
            uniformSize.height,
            resizeMode
        );
    });

    // 计算内容区域尺寸（所有图片 + 间距）- 与imageProcessor保持一致
    let contentWidth = 0;
    let contentHeight = 0;

    if (direction === "horizontal") {
        contentWidth =
            imageDimensions.reduce((sum, dim) => sum + dim.width, 0) +
            spacing * (validImages.length - 1);
        contentHeight = Math.max(...imageDimensions.map((dim) => dim.height));
    } else {
        contentWidth = Math.max(...imageDimensions.map((dim) => dim.width));
        contentHeight =
            imageDimensions.reduce((sum, dim) => sum + dim.height, 0) +
            spacing * (validImages.length - 1);
    }

    // 计算画布尺寸（内容 + 边框）- 与imageProcessor保持一致
    const canvasWidth = contentWidth + borderWidth * 2;
    const canvasHeight = contentHeight + borderWidth * 2;

    // 根据容器宽度缩放
    const scale = Math.min(1, Math.min(containerWidth / canvasWidth, 400 / canvasHeight));

    return {
        images: imageDimensions.map(dim => ({
            width: dim.width * scale,
            height: dim.height * scale
        })),
        total: {
            width: canvasWidth * scale,
            height: canvasHeight * scale
        },
        scale,
        spacing: spacing * scale,
        borderWidth: borderWidth * scale,
        validImages
    };
};

// 可拖拽的图像预览组件
const DraggableImagePreview: React.FC<{
    image: ImageItem;
    index: number;
    style: React.CSSProperties;
    onRemove: (id: string) => void;
    onDragStart: (index: number) => void;
    onDragOver: (index: number) => void;
    onDragEnd: () => void;
    isDragging: boolean;
    isDragOver: boolean;
}> = ({
    image,
    index,
    style,
    onRemove,
    onDragStart,
    onDragOver,
    onDragEnd,
    isDragging,
    isDragOver
}) => {
        return (
            <div
                draggable
                onDragStart={() => onDragStart(index)}
                onDragOver={(e) => {
                    e.preventDefault();
                    onDragOver(index);
                }}
                onDragEnd={onDragEnd}
                className={cn(
                    "relative group cursor-grab active:cursor-grabbing transition-all duration-200",
                    isDragging && "opacity-50 scale-95 rotate-1 z-10",
                    isDragOver && "border-primary border-dashed"
                )}
                style={style}
            >
                {/* 图像显示区域 */}
                <div className="relative overflow-hidden shadow-sm bg-white">
                    <img
                        src={image.preview}
                        alt={`图像 ${index + 1}`}
                        className="w-full h-full object-cover"
                    />

                    {/* 图像序号 */}
                    <div className="absolute top-1 left-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {index + 1}
                    </div>

                    {/* 删除按钮 */}
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onRemove(image.id)}
                        className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-3 h-3" />
                    </Button>
                </div>
            </div>
        );
    };

// 合并预览组件
const MergePreview: React.FC<{
    images: ImageItem[];
    options: MergeOptions;
    containerWidth: number;
    onRemove: (id: string) => void;
    onDragStart: (index: number) => void;
    onDragOver: (index: number) => void;
    onDragEnd: () => void;
    draggedIndex: number | null;
    dragOverIndex: number | null;
}> = ({
    images,
    options,
    containerWidth,
    onRemove,
    onDragStart,
    onDragOver,
    onDragEnd,
    draggedIndex,
    dragOverIndex
}) => {
        const dimensions = getPreviewDimensions(images, options, containerWidth);

        if (!dimensions || images.length === 0) return null;

        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <h4 className="text-sm font-medium">合并预览</h4>
                    <span className="text-xs text-muted-foreground">
                        ({options.direction === 'horizontal' ? '水平' : '垂直'}排列, {images.length}张图片)
                    </span>
                </div>

                <div className="border rounded-lg p-4 bg-muted/20">
                    <div
                        className="mx-auto rounded border shadow-sm"
                        style={{
                            width: dimensions.total.width,
                            height: dimensions.total.height,
                            backgroundColor: options.backgroundColor,
                            display: 'flex',
                            flexDirection: options.direction === 'horizontal' ? 'row' : 'column',
                            alignItems: 'stretch',
                            gap: dimensions.spacing,
                            padding: dimensions.borderWidth
                        }}
                    >
                        {dimensions.validImages.map((image, index) => (
                            <DraggableImagePreview
                                key={image.id}
                                image={image}
                                index={index}
                                style={{
                                    width: dimensions.images[index]?.width || 100,
                                    height: dimensions.images[index]?.height || 100,
                                    flexShrink: 0
                                }}
                                onRemove={onRemove}
                                onDragStart={onDragStart}
                                onDragOver={onDragOver}
                                onDragEnd={onDragEnd}
                                isDragging={draggedIndex === index}
                                isDragOver={dragOverIndex === index}
                            />
                        ))}
                    </div>

                    <div className="mt-3 text-xs text-muted-foreground text-center">
                        预期输出尺寸: {Math.round(dimensions.total.width / dimensions.scale)} × {Math.round(dimensions.total.height / dimensions.scale)} px
                    </div>
                </div>
            </div>
        );
    };

// 主组件
export const DraggableImageList: React.FC<DraggableImageListProps> = ({
    images,
    onRemoveImage,
    onReorderImages,
    onClearAll,
    className,
    options
}) => {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [containerWidth, setContainerWidth] = useState<number>(600); // 默认值
    const containerRef = useRef<HTMLDivElement>(null);

    // 计算容器宽度（减去边框、内边距等）
    useEffect(() => {
        const updateContainerWidth = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const computedStyle = window.getComputedStyle(containerRef.current);

                // 获取边框和内边距
                const paddingLeft = parseFloat(computedStyle.paddingLeft);
                const paddingRight = parseFloat(computedStyle.paddingRight);
                const borderLeft = parseFloat(computedStyle.borderLeftWidth);
                const borderRight = parseFloat(computedStyle.borderRightWidth);

                // 计算可用宽度 = 容器宽度 - 边框 - 内边距
                const availableWidth = rect.width - paddingLeft - paddingRight - borderLeft - borderRight;

                // 预留一些空间给滚动条等
                const finalWidth = Math.max(300, availableWidth - 32);

                setContainerWidth(finalWidth);
            }
        };

        // 初始计算
        updateContainerWidth();

        // 监听窗口大小变化
        const resizeObserver = new ResizeObserver(updateContainerWidth);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (index: number) => {
        if (draggedIndex !== null && draggedIndex !== index) {
            setDragOverIndex(index);
        }
    };

    const handleDragEnd = () => {
        if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
            onReorderImages(draggedIndex, dragOverIndex);
        }
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    if (images.length === 0) {
        return (
            <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)} ref={containerRef}>
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Eye className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    暂无图像
                </h3>
                <p className="text-sm text-muted-foreground">
                    上传一些图像开始拼接吧
                </p>
            </div>
        );
    }

    return (
        <div className={cn("space-y-4", className)} ref={containerRef}>
            {/* 操作栏 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">图像拼接预览</h3>
                    <span className="text-sm text-muted-foreground">({images.length} 张)</span>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={onClearAll}
                    className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                    <Trash2 className="w-4 h-4" />
                    清空全部
                </Button>
            </div>

            {/* 合并预览 */}
            <MergePreview
                images={images}
                options={options}
                containerWidth={containerWidth}
                onRemove={onRemoveImage}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                draggedIndex={draggedIndex}
                dragOverIndex={dragOverIndex}
            />

            {/* 操作提示 */}
            <div className="text-xs text-muted-foreground text-center space-y-1">
                <p>💡 直接在预览中拖拽图像可调整合并顺序</p>
                <p>🎨 通过左侧的合并选项调整图像大小和间距</p>
            </div>
        </div>
    );
}; 