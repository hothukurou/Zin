/**
 * 指定したコンテナに多角形を塗りつぶす
 * @param container 対象のPhaser.GameObjects.Container
 * @param points 多角形を構成する頂点の配列 [{x: number, y: number}, ...]
 * @param fillColor 塗りつぶしの色（デフォルト: 白）
 * @param fillAlpha 塗りつぶしの透明度（0.0 ～ 1.0、デフォルト: 1）
 */
export function fillPolygonInContainer(
    graphics: Phaser.GameObjects.Graphics,
    points: { x: number; y: number }[],
    fillColor: number = 0xffffff,
    fillAlpha: number = 1
): Phaser.GameObjects.Graphics {
    if (points.length < 3) {
        console.error("多角形を描画するには、少なくとも3つの頂点が必要です。");
        return;
    }


    // 塗りつぶしスタイルを設定
    graphics.fillStyle(fillColor, fillAlpha);

    // 多角形のパスを開始
    graphics.beginPath();
    graphics.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach((point) => {
        graphics.lineTo(point.x, point.y);
    });
    graphics.closePath(); // パスを閉じる
    graphics.fillPath(); // 塗りつぶし

    return graphics;
}