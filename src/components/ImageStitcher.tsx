import React from 'react';
import { Header } from './Header';
import { ImageUploader } from './ImageUploader';
import { DraggableImageList } from './DraggableImageList';
import { MergeOptionsPanel } from './MergeOptions';
import { PreviewCanvas } from './PreviewCanvas';
import { useImageStore } from '@/hooks/useImageStore';
import { useMergeOptions } from '@/hooks/useMergeOptions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export const ImageStitcher: React.FC = () => {
    const {
        images,
        isUploading,
        error,
        addImages,
        removeImage,
        reorderImages,
        clearImages,
        clearError,
    } = useImageStore();

    const {
        options,
        updateOption,
        resetOptions,
    } = useMergeOptions();

    const handleFilesUpload = (files: File[]) => {
        addImages(files);
    };

    const handleError = (errors: string[]) => {
        console.error('Upload errors:', errors);
        // 这里可以显示更详细的错误信息
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-6 space-y-6">
                {/* 错误提示 */}
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription className="flex items-center justify-between">
                            <span>{error}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearError}
                                className="h-auto p-1 hover:bg-transparent"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    {/* 左侧：上传区域和合并选项 */}
                    <div className="xl:col-span-1 space-y-6">
                        {/* 图像上传 */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">上传图像</h2>
                            <ImageUploader
                                onFilesUpload={handleFilesUpload}
                                onError={handleError}
                                isUploading={isUploading}
                            />
                        </div>

                        {/* 合并选项控制面板 */}
                        {images.length > 0 && (
                            <MergeOptionsPanel
                                options={options}
                                onOptionChange={updateOption}
                                onReset={resetOptions}
                            />
                        )}
                    </div>

                    {/* 中间：图像列表 */}
                    <div className="xl:col-span-2">
                        <DraggableImageList
                            images={images}
                            onRemoveImage={removeImage}
                            onReorderImages={reorderImages}
                            onClearAll={clearImages}
                            options={options}
                        />
                    </div>

                    {/* 右侧：预览区域 */}
                    <div className="xl:col-span-1">
                        <PreviewCanvas
                            images={images}
                            options={options}
                        />
                    </div>
                </div>

                {/* 桌面端的预览区域 (当图像较多时的大预览) */}
                {images.length > 4 && (
                    <div className="mt-8">
                        <div className="xl:hidden">
                            <PreviewCanvas
                                images={images}
                                options={options}
                                className="w-full"
                            />
                        </div>
                    </div>
                )}

                {/* 使用说明 */}
                {images.length === 0 && (
                    <div className="mt-12 max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            <div className="space-y-3">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                    <span className="text-primary font-bold">1</span>
                                </div>
                                <h3 className="font-semibold">上传图像</h3>
                                <p className="text-sm text-muted-foreground">
                                    拖拽或选择多个图像文件上传，支持 JPG、PNG、GIF、WebP 等格式
                                </p>
                            </div>
                            <div className="space-y-3">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                    <span className="text-primary font-bold">2</span>
                                </div>
                                <h3 className="font-semibold">调整选项</h3>
                                <p className="text-sm text-muted-foreground">
                                    选择合并方向、调整图像尺寸、设置间距和边框等选项
                                </p>
                            </div>
                            <div className="space-y-3">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                    <span className="text-primary font-bold">3</span>
                                </div>
                                <h3 className="font-semibold">下载结果</h3>
                                <p className="text-sm text-muted-foreground">
                                    预览合并效果，满意后即可下载高质量的合并图像
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}; 