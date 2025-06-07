import React from 'react';
import { Separator } from '@/components/ui/separator';

export const Header: React.FC = () => {
    return (
        <header className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-2xl">拼</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-foreground">图像拼接工具</h1>
                                <p className="text-sm text-muted-foreground">轻松合并多个图像</p>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>支持 JPG、PNG、GIF、WebP 等格式</span>
                        <Separator orientation="vertical" className="h-4" />
                        <span>最大文件大小 10MB</span>
                    </div>
                </div>
            </div>
        </header>
    );
}; 