
declare function qrcode(typeNumber: number, errorCorrectionLevel: string): qrcode;

declare class qrcode
{
    addData(data: string, mode?: string): void;
    make(): void;
    createTableTag(cellSize?: number, margin?: number): string;
    createSvgTag(cellSize?: number, margin?: number): string;
    createDataURL(cellSize?: number, margin?: number): string;
    createImgTag(cellSize?: number, margin?: number, alt?: string): string;
    renderTo2dContext(context: CanvasRenderingContext2D, cellSize?: number): void;
    getModuleCount(): number;
}
