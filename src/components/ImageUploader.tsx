import React, { useCallback, useState } from 'react';
import { Upload, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getFilesFromDragEvent, validateImageFiles } from '@/lib/fileUtils';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
    onFilesUpload: (files: File[]) => void;
    onError: (errors: string[]) => void;
    isUploading?: boolean;
    className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
    onFilesUpload,
    onError,
    isUploading = false,
    className
}) => {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleFileSelect = useCallback((files: File[]) => {
        const { validFiles, errors } = validateImageFiles(files);

        if (errors.length > 0) {
            onError(errors);
        }

        if (validFiles.length > 0) {
            onFilesUpload(validFiles);
        }
    }, [onFilesUpload, onError]);

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const files = getFilesFromDragEvent(e.nativeEvent);
        if (files.length > 0) {
            handleFileSelect(files);
        }
    }, [handleFileSelect]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            handleFileSelect(files);
        }
        // 清空input值，允许重复选择同一文件
        e.target.value = '';
    }, [handleFileSelect]);

    return (
        <div className={cn("w-full", className)}>
            <div
                className={cn(
                    "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200",
                    isDragOver
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-muted-foreground/50",
                    isUploading && "opacity-50 pointer-events-none"
                )}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <Input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleInputChange}
                    className="sr-only"
                    disabled={isUploading}
                />

                <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        {isUploading ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                        ) : (
                            <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        )}
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">
                            {isUploading ? '正在处理图像...' : '添加图像'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            拖拽图像文件到此处，或点击按钮选择文件
                        </p>
                        <p className="text-xs text-muted-foreground">
                            支持 JPG、PNG、GIF、WebP、BMP、SVG 格式，单个文件最大 10MB
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={() => document.getElementById('file-upload')?.click()}
                        disabled={isUploading}
                        className="gap-2"
                    >
                        <Upload className="w-4 h-4" />
                        选择图像文件
                    </Button>
                </div>

                {isDragOver && (
                    <div className="absolute inset-0 bg-primary/10 border-2 border-primary border-dashed rounded-lg flex items-center justify-center">
                        <div className="text-primary font-medium">释放以添加图像</div>
                    </div>
                )}
            </div>
        </div>
    );
}; 