import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RotateCw, ArrowLeftRight, ArrowUpDown, Settings } from 'lucide-react';
import type { MergeOptions, ResizeMode } from '@/hooks/useMergeOptions';
import { cn } from '@/lib/utils';

interface MergeOptionsProps {
    options: MergeOptions;
    onOptionChange: <K extends keyof MergeOptions>(key: K, value: MergeOptions[K]) => void;
    onReset: () => void;
    className?: string;
}

export const MergeOptionsPanel: React.FC<MergeOptionsProps> = ({
    options,
    onOptionChange,
    onReset,
    className
}) => {
    return (
        <Card className={cn("", className)}>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    合并选项
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* 合并方向 */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">合并方向</Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            variant={options.direction === 'horizontal' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => onOptionChange('direction', 'horizontal')}
                            className="gap-2"
                        >
                            <ArrowLeftRight className="w-4 h-4" />
                            水平
                        </Button>
                        <Button
                            variant={options.direction === 'vertical' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => onOptionChange('direction', 'vertical')}
                            className="gap-2"
                        >
                            <ArrowUpDown className="w-4 h-4" />
                            垂直
                        </Button>
                    </div>
                </div>

                <Separator />

                {/* 尺寸调整 */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">尺寸调整</Label>
                    <Select
                        value={options.resizeMode}
                        onValueChange={(value: ResizeMode) => onOptionChange('resizeMode', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="auto-uniform">智能对齐（推荐）</SelectItem>
                            <SelectItem value="none">保持原始尺寸</SelectItem>
                            <SelectItem value="fit-width">适应宽度</SelectItem>
                            <SelectItem value="fit-height">适应高度</SelectItem>
                            <SelectItem value="uniform">统一尺寸</SelectItem>
                        </SelectContent>
                    </Select>

                    {options.resizeMode === 'auto-uniform' && (
                        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md">
                            <p>智能模式会自动调整图像尺寸：</p>
                            <ul className="mt-1 space-y-0.5 list-disc list-inside">
                                <li>水平排列时：保持统一高度</li>
                                <li>垂直排列时：保持统一宽度</li>
                            </ul>
                        </div>
                    )}

                    {options.resizeMode === 'uniform' && (
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">宽度</Label>
                                <Input
                                    type="number"
                                    value={options.uniformSize.width}
                                    onChange={(e) => onOptionChange('uniformSize', {
                                        ...options.uniformSize,
                                        width: parseInt(e.target.value) || 800
                                    })}
                                    min="1"
                                    className="h-8"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">高度</Label>
                                <Input
                                    type="number"
                                    value={options.uniformSize.height}
                                    onChange={(e) => onOptionChange('uniformSize', {
                                        ...options.uniformSize,
                                        height: parseInt(e.target.value) || 600
                                    })}
                                    min="1"
                                    className="h-8"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <Separator />

                {/* 间距 */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">图像间距</Label>
                        <span className="text-xs text-muted-foreground">{options.spacing}px</span>
                    </div>
                    <Slider
                        value={[options.spacing]}
                        onValueChange={(value) => onOptionChange('spacing', value[0])}
                        max={100}
                        step={5}
                        className="w-full"
                    />
                </div>

                <Separator />

                {/* 边框 */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">边框宽度</Label>
                        <span className="text-xs text-muted-foreground">{options.borderWidth}px</span>
                    </div>
                    <Slider
                        value={[options.borderWidth]}
                        onValueChange={(value) => onOptionChange('borderWidth', value[0])}
                        max={100}
                        step={5}
                        className="w-full"
                    />
                </div>

                <Separator />

                {/* 背景色 */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">背景颜色</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            type="color"
                            value={options.backgroundColor}
                            onChange={(e) => onOptionChange('backgroundColor', e.target.value)}
                            className="w-12 h-8 p-1 border rounded"
                        />
                        <Input
                            type="text"
                            value={options.backgroundColor}
                            onChange={(e) => onOptionChange('backgroundColor', e.target.value)}
                            className="h-8 text-xs"
                            placeholder="#ffffff"
                        />
                    </div>
                    {options.borderWidth > 0 && (
                        <div className="text-xs text-muted-foreground">
                            💡 背景颜色同时用作边框颜色
                        </div>
                    )}
                </div>

                <Separator />

                {/* 导出设置 */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">导出设置</Label>
                    <div className="space-y-2">
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">格式</Label>
                            <Select
                                value={options.format}
                                onValueChange={(value: 'png' | 'jpeg' | 'webp') => onOptionChange('format', value)}
                            >
                                <SelectTrigger className="h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="png">PNG</SelectItem>
                                    <SelectItem value="jpeg">JPEG</SelectItem>
                                    <SelectItem value="webp">WebP</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {options.format !== 'png' && (
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs text-muted-foreground">质量</Label>
                                    <span className="text-xs text-muted-foreground">{Math.round(options.quality * 100)}%</span>
                                </div>
                                <Slider
                                    value={[options.quality]}
                                    onValueChange={(value) => onOptionChange('quality', value[0])}
                                    min={0.1}
                                    max={1}
                                    step={0.1}
                                    className="w-full"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* 重置按钮 */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onReset}
                    className="w-full gap-2"
                >
                    <RotateCw className="w-4 h-4" />
                    重置选项
                </Button>
            </CardContent>
        </Card>
    );
}; 