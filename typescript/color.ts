export enum Color {
    red = 0x996666,
    blue = 0x666699,
    green = 0x669966,
    yellow = 0x999966,
    black = 0x000000,
    white = 0xffffff
}

/**
 * 数値型カラーコードを文字列型に変換する関数
 * @param color - 数値型のカラーコード（例: 0xffffff）
 * @returns 文字列型のカラーコード（例: "#ffffff"）
 */
export function numberToColorString(color: number): string {
    // 16進数に変換し、ゼロ埋めして6桁にする
    return `#${color.toString(16).padStart(6, '0')}`;
}