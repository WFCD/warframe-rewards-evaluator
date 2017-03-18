export const TESSERACT_PROGRESS = "TESSERACT_PROGRESS";

export function tesseractProgress(progress: number) {
    return {
        type: TESSERACT_PROGRESS,
        progress: progress
    };
};
