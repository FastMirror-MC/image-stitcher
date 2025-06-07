import { useState, useCallback } from "react";

export type MergeDirection = "horizontal" | "vertical";
export type ResizeMode = "none" | "fit-width" | "fit-height" | "uniform" | "auto-uniform";

export interface MergeOptions {
    direction: MergeDirection;
    spacing: number;
    resizeMode: ResizeMode;
    uniformSize: { width: number; height: number };
    borderWidth: number;
    backgroundColor: string;
    quality: number;
    format: "png" | "jpeg" | "webp";
}

const defaultOptions: MergeOptions = {
    direction: "horizontal",
    spacing: 0,
    resizeMode: "auto-uniform",
    uniformSize: { width: 800, height: 600 },
    borderWidth: 0,
    backgroundColor: "#ffffff",
    quality: 0.9,
    format: "png",
};

export const useMergeOptions = () => {
    const [options, setOptions] = useState<MergeOptions>(defaultOptions);

    const updateOption = useCallback(
        <K extends keyof MergeOptions>(key: K, value: MergeOptions[K]) => {
            setOptions((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const updateOptions = useCallback((newOptions: Partial<MergeOptions>) => {
        setOptions((prev) => ({ ...prev, ...newOptions }));
    }, []);

    const resetOptions = useCallback(() => {
        setOptions(defaultOptions);
    }, []);

    return {
        options,
        updateOption,
        updateOptions,
        resetOptions,
    };
};
