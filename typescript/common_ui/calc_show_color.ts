/**
 * コンテナ内の全ピクセルを取得して、指定した色が何ピクセル含まれていたかをカウントする
 * @param scene 対象のPhaser.Scene
 * @param container 対象のPhaser.GameObjects.Container
 * @param colors 色の配列（例えば [0xff0000, 0x00ff00, 0x0000ff, 0xffff00]）
 * @returns 指定した色のピクセル数の配列（例: [10, 3, 3, 2]）
 */
export function countColorsInContainer(
    scene: Phaser.Scene,
    graphics: Phaser.GameObjects.Graphics,
    colors: number[]
): number[] {
    // コンテナの幅と高さ
    const width = scene.scale.width;
    const height = scene.scale.height;

    // テクスチャ名をユニークにする
    const uniqueTextureName = `graphics_${Date.now()}_${Math.random()}`;
    const uniqueCanvasName = `graphicsCanvas_${Date.now()}_${Math.random()}`;

    // グラフィックからテクスチャを生成
    graphics.generateTexture(uniqueTextureName);
    const source = scene.textures.get(uniqueTextureName).getSourceImage();

    // キャンバステクスチャを生成
    const canvas = scene.textures.createCanvas(uniqueCanvasName, width, height);
    canvas.draw(0, 0, source as HTMLImageElement);

    // 一時的なテクスチャを削除
    scene.textures.remove(uniqueTextureName);

    // ImageDataを取得
    let imageData = canvas.imageData;
    const data = imageData.data;

    let colorCounts: number[] = Array(colors.length).fill(0);

    // ピクセルごとに色を確認
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];     // 赤
        const g = data[i + 1]; // 緑
        const b = data[i + 2]; // 青

        // 16進数カラーコードに変換
        const color = (r << 16) + (g << 8) + b;

        // 指定した色と一致するか確認し、カウント
        colors.forEach((colorCode, index) => {
            if (color === colorCode) {
                colorCounts[index]++;
            }
        });
    }

    // 使用したキャンバステクスチャを削除
    scene.textures.remove(uniqueCanvasName);

    return colorCounts;
}