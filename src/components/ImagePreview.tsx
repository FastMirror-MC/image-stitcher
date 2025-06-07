import React from 'react';
import { X, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatFileSize } from '@/lib/fileUtils';
import type { ImageItem } from '@/hooks/useImageStore';
import { cn } from '@/lib/utils';

interface ImagePreviewProps {
    image: ImageItem;
    onRemove: (id: string) => void;
    className?: string;
    draggable?: boolean;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
    image,
    onRemove,
    className,
    draggable = true
}) => {
    const handleRemove = () => {
        onRemove(image.id);
    };

    return (
        <Card className={cn("group relative overflow-hidden", className)}>
            <CardContent className="p-0">
                {/* 拖拽手柄 */}
                {draggable && (
                    <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-background/80 backdrop-blur-sm rounded p-1">
                            <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                        </div>
                    </div>
                )}

                {/* 删除按钮 */}
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleRemove}
                    className="absolute top-2 right-2 z-10 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <X className="w-3 h-3" />
                </Button>

                {/* 图像显示 */}
                <div className="aspect-square bg-muted overflow-hidden">
                    <img
                        src={image.preview}
                        alt={image.file.name}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        loading="lazy"
                    />
                </div>

                {/* 图像信息 */}
                <div className="p-3 space-y-2">
                    <div className="space-y-1">
                        <h4 className="text-sm font-medium truncate" title={image.file.name}>
                            {image.file.name}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{formatFileSize(image.file.size)}</span>
                            {image.width && image.height && (
                                <span>{image.width} × {image.height}</span>
                            )}
                        </div>
                    </div>

                    {/* 文件类型标签 */}
                    <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-xs px-2 py-0">
                            {image.file.type.split('/')[1].toUpperCase()}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}; 