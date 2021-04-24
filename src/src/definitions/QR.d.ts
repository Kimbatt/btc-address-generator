
declare function qrcode(typeNumber: number, errorCorrectionLevel: string): qrcode;

declare class qrcode
{
    addData(data: string, mode?: "Byte" | "Numeric" | "Alphanumeric" | "Kanji"): void;
    make(): void;
    createTableTag(cellSize?: number, margin?: number): string;
    createSvgTag(cellSize?: number, margin?: number): string;
    createDataURL(cellSize?: number, margin?: number): string;
    createImgTag(cellSize?: number, margin?: number, alt?: string): string;
    renderTo2dContext(context: CanvasRenderingContext2D, cellSize?: number): void;
    getModuleCount(): number;
    isDark(row: number, col: number): boolean;
}

declare function INIT_QR(): typeof qrcode;
