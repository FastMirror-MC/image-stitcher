import React from 'react';
import { ImagePreview } from './ImagePreview';
import { Button } from '@/components/ui/button';
import { Trash2, Grid3X3 } from 'lucide-react';
import type { ImageItem } from '@/hooks/useImageStore';
import { cn } from '@/lib/utils';

interface ImageListProps {
    images: ImageItem[];
    onRemoveImage: (id: string) => void;
    onClearAll: () => void;
    className?: string;
}

export const ImageList: React.FC<ImageListProps> = ({
    images,
    onRemoveImage,
    onClearAll,
    className
}) => {
    if (images.length === 0) {
        return (
            <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Grid3X3 className="w-8 h-8 text-muted-foreground" />
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
        <div className={cn("space-y-4", className)}>
            {/* 操作栏 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">
                        已上传图像
                    </h3>
                    <span className="text-sm text-muted-foreground">
                        ({images.length} 张)
                    </span>
                </div>

                {images.length > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClearAll}
                        className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                        <Trash2 className="w-4 h-4" />
                        清空全部
                    </Button>
                )}
            </div>

            {/* 图像网格 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((image) => (
                    <ImagePreview
                        key={image.id}
                        image={image}
                        onRemove={onRemoveImage}
                        className="w-full"
                    />
                ))}
            </div>

            {/* 排序提示 */}
            <div className="text-xs text-muted-foreground text-center">
                <p>提示：可以通过拖拽图像来调整合并顺序</p>
            </div>
        </div>
    );
}; 