import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Eye, Loader2, AlertCircle } from 'lucide-react';
import { mergeImages, downloadImage, getMergedFileName } from '@/lib/imageProcessor';
import type { ImageItem } from '@/hooks/useImageStore';
import type { MergeOptions } from '@/hooks/useMergeOptions';
import { cn } from '@/lib/utils';

interface PreviewCanvasProps {
    images: ImageItem[];
    options: MergeOptions;
    className?: string;
}

export const PreviewCanvas: React.FC<PreviewCanvasProps> = ({
    images,
    options,
    className
}) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 当图像或选项变化时，重新生成预览
    const optionsKey = useMemo(() =>
        JSON.stringify({
            direction: options.direction,
            spacing: options.spacing,
            resizeMode: options.resizeMode,
            uniformSize: options.uniformSize,
            borderWidth: options.borderWidth,
            backgroundColor: options.backgroundColor,
        })
        , [options]);

    useEffect(() => {
        if (images.length < 2) {
            setPreviewUrl(null);
            setError(null);
            return;
        }

        const generatePreview = async () => {
            setIsGenerating(true);
            setError(null);

            try {
                const mergedUrl = await mergeImages(images, options);
                setPreviewUrl(mergedUrl);
            } catch (err) {
                console.error('Preview generation failed:', err);
                setError(err instanceof Error ? err.message : '预览生成失败');
                setPreviewUrl(null);
            } finally {
                setIsGenerating(false);
            }
        };

        // 防抖处理：延迟生成预览
        const timeoutId = setTimeout(generatePreview, 300);
        return () => clearTimeout(timeoutId);
    }, [images, optionsKey]);

    const handleDownload = async () => {
        if (!previewUrl) return;

        try {
            setIsGenerating(true);
            // 重新生成高质量版本用于下载
            const finalUrl = await mergeImages(images, options);
            const filename = getMergedFileName(images, options);
            downloadImage(finalUrl, filename);
        } catch (err) {
            console.error('Download failed:', err);
            setError(err instanceof Error ? err.message : '下载失败');
        } finally {
            setIsGenerating(false);
        }
    };

    // 如果图像少于2张，显示提示
    if (images.length < 2) {
        return (
            <Card className={cn("", className)}>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        合并预览
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                            <Eye className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium text-muted-foreground mb-2">
                            需要至少 2 张图像
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            上传更多图像以查看合并预览
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={cn("", className)}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        合并预览
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                            {images.length} 张图像
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                            {options.direction === 'horizontal' ? '水平' : '垂直'}合并
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* 错误提示 */}
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* 预览区域 */}
                <div className="relative border rounded-lg overflow-hidden bg-muted/20 min-h-[200px]">
                    {isGenerating && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                <p className="text-sm text-muted-foreground">生成预览中...</p>
                            </div>
                        </div>
                    )}

                    {previewUrl ? (
                        <div className="flex items-center justify-center p-4">
                            <img
                                src={previewUrl}
                                alt="合并预览"
                                className="max-w-full max-h-[400px] object-contain rounded border shadow-sm"
                                style={{ backgroundColor: options.backgroundColor }}
                            />
                        </div>
                    ) : !isGenerating && !error && (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">
                                    等待生成预览...
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* 预览信息 */}
                {previewUrl && !isGenerating && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                            <p className="text-muted-foreground">合并方向:</p>
                            <p className="font-medium">
                                {options.direction === 'horizontal' ? '水平排列' : '垂直排列'}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-muted-foreground">导出格式:</p>
                            <p className="font-medium uppercase">{options.format}</p>
                        </div>
                        {options.spacing > 0 && (
                            <div className="space-y-1">
                                <p className="text-muted-foreground">图像间距:</p>
                                <p className="font-medium">{options.spacing}px</p>
                            </div>
                        )}
                        {options.borderWidth > 0 && (
                            <div className="space-y-1">
                                <p className="text-muted-foreground">边框宽度:</p>
                                <p className="font-medium">{options.borderWidth}px</p>
                            </div>
                        )}
                    </div>
                )}

                {/* 下载按钮 */}
                <Button
                    onClick={handleDownload}
                    disabled={!previewUrl || isGenerating}
                    className="w-full gap-2"
                    size="lg"
                >
                    {isGenerating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Download className="w-4 h-4" />
                    )}
                    {isGenerating ? '处理中...' : '下载合并图像'}
                </Button>
            </CardContent>
        </Card>
    );
}; 