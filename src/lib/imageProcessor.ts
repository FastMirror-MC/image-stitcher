import type { ImageItem } from "@/hooks/useImageStore";
import type { MergeOptions } from "@/hooks/useMergeOptions";

// 加载图像为HTMLImageElement
export const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
};

// 计算调整后的尺寸
export const calculateResizedDimensions = (
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

// 智能计算统一尺寸 - 新增函数
export const calculateUniformDimensions = (
    images: HTMLImageElement[],
    direction: "horizontal" | "vertical"
): { width: number; height: number } => {
    if (images.length === 0) {
        return { width: 0, height: 0 };
    }

    if (direction === "horizontal") {
        // 水平排列：保持统一高度，选择所有图像的最小高度作为目标高度
        // 这样可以避免图像被过度放大，保持较好的视觉效果
        const targetHeight = Math.min(...images.map((img) => img.height));
        return { width: 0, height: targetHeight }; // width 将根据比例计算
    } else {
        // 垂直排列：保持统一宽度，选择所有图像的最小宽度作为目标宽度
        const targetWidth = Math.min(...images.map((img) => img.width));
        return { width: targetWidth, height: 0 }; // height 将根据比例计算
    }
};

// 绘制单个图像到Canvas
const drawImageToCanvas = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number
) => {
    // 直接绘制图像，边框由外层统一处理
    ctx.drawImage(img, x, y, width, height);
};

// 合并图像
export const mergeImages = async (images: ImageItem[], options: MergeOptions): Promise<string> => {
    if (images.length === 0) {
        throw new Error("No images to merge");
    }

    // 加载所有图像
    const loadedImages = await Promise.all(images.map((image) => loadImage(image.preview)));

    // 计算每个图像的尺寸
    const imageDimensions = loadedImages.map((img) => {
        const originalWidth = img.width;
        const originalHeight = img.height;

        if (options.resizeMode === "none") {
            return { width: originalWidth, height: originalHeight };
        }

        // 如果是智能模式，根据排列方向自动计算统一尺寸
        if (options.resizeMode === "auto-uniform") {
            const uniformDims = calculateUniformDimensions(loadedImages, options.direction);

            if (options.direction === "horizontal") {
                // 水平排列：统一高度，按比例计算宽度
                const targetHeight = uniformDims.height;
                return {
                    width: (originalWidth * targetHeight) / originalHeight,
                    height: targetHeight,
                };
            } else {
                // 垂直排列：统一宽度，按比例计算高度
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
            options.uniformSize.width,
            options.uniformSize.height,
            options.resizeMode
        );
    });

    // 计算内容区域尺寸（所有图片 + 间距）
    const borderWidth = options.borderWidth;
    const spacing = options.spacing;

    let contentWidth = 0;
    let contentHeight = 0;

    if (options.direction === "horizontal") {
        contentWidth =
            imageDimensions.reduce((sum, dim) => sum + dim.width, 0) +
            spacing * (images.length - 1);
        contentHeight = Math.max(...imageDimensions.map((dim) => dim.height));
    } else {
        contentWidth = Math.max(...imageDimensions.map((dim) => dim.width));
        contentHeight =
            imageDimensions.reduce((sum, dim) => sum + dim.height, 0) +
            spacing * (images.length - 1);
    }

    // 计算画布尺寸（内容 + 边框）
    const canvasWidth = contentWidth + borderWidth * 2;
    const canvasHeight = contentHeight + borderWidth * 2;

    // 创建Canvas
    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("Failed to get canvas context");
    }

    // 填充背景色
    ctx.fillStyle = options.backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 绘制外边框
    if (borderWidth > 0) {
        ctx.fillStyle = options.backgroundColor;
        // 上边框
        ctx.fillRect(0, 0, canvasWidth, borderWidth);
        // 下边框
        ctx.fillRect(0, canvasHeight - borderWidth, canvasWidth, borderWidth);
        // 左边框
        ctx.fillRect(0, 0, borderWidth, canvasHeight);
        // 右边框
        ctx.fillRect(canvasWidth - borderWidth, 0, borderWidth, canvasHeight);
    }

    // 在边框内部绘制图像
    let currentX = borderWidth;
    let currentY = borderWidth;

    for (let i = 0; i < loadedImages.length; i++) {
        const img = loadedImages[i];
        const dimensions = imageDimensions[i];

        drawImageToCanvas(ctx, img, currentX, currentY, dimensions.width, dimensions.height);

        if (options.direction === "horizontal") {
            currentX += dimensions.width + spacing;
        } else {
            currentY += dimensions.height + spacing;
        }
    }

    // 导出为Base64
    return canvas.toDataURL(`image/${options.format}`, options.quality);
};

// 下载图像
export const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// 获取合并后的文件名
export const getMergedFileName = (images: ImageItem[], options: MergeOptions): string => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
    const direction = options.direction === "horizontal" ? "H" : "V";
    const count = images.length;
    return `merged-${count}images-${direction}-${timestamp}.${options.format}`;
};
