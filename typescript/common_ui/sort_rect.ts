import { RectPoint } from "../types";

/**
 * 四角形の頂点がクロスしないように並び替える関数
 * @param rectPoints - 四角形の頂点の配列
 * @returns クロスしないように並び替えられた配列
 */
export function sortRectPoints(rectPoints: RectPoint): RectPoint {
    if (rectPoints.length !== 4) {
        throw new Error("四角形の頂点は4つである必要があります");
    }

    // 重心を計算
    const centroid = rectPoints.reduce(
        (acc, point) => ({
            x: acc.x + point.x / 4,
            y: acc.y + point.y / 4,
        }),
        { x: 0, y: 0 }
    );

    // 各点を重心を基準に時計回りにソート
    const sortedPoints = rectPoints.slice().sort((a, b) => {
        const angleA = Math.atan2(a.y - centroid.y, a.x - centroid.x);
        const angleB = Math.atan2(b.y - centroid.y, b.x - centroid.x);
        return angleA - angleB;
    });

    return sortedPoints;
}