import { PlayerData, Point2d, TrianglePoint } from "../types";

/**
* 指定した点が3辺形配列に含まれているかを判定する関数
* @param playerData - プレイヤーデータ
* @param point - 判定したい座標
* @returns 含まれていれば true、含まれていなければ false
*/
export function isPointInTriangle(playerData: PlayerData, point: Point2d): boolean {
    for (const triangle of playerData.trianglePoints) {
        if (triangle.length === 3 && isPointInsidePolygon(triangle, point)) {
            return true;
        }
    }
    return false;
}

/**
* 点が任意の3辺形内にあるかを判定する関数
* @param polygon - 四辺形を構成するつの点
* @param point - 判定したい点
* @returns 含まれていれば true、含まれていなければ false
*/
export function isPointInsidePolygon(polygon: TrianglePoint, point: Point2d): boolean {
    // 三角形を2つに分けて、それぞれの内外判定を行う
    return (
        isPointInsideTriangle(polygon[0], polygon[1], polygon[2], point)
    );
}

/**
* 点が三角形内にあるかを判定する関数（ベクトルの外積を使用）
* @param p1 - 三角形の1つ目の頂点
* @param p2 - 三角形の2つ目の頂点
* @param p3 - 三角形の3つ目の頂点
* @param point - 判定したい点
* @returns 含まれていれば true、含まれていなければ false
*/
function isPointInsideTriangle(
    p1: Point2d,
    p2: Point2d,
    p3: Point2d,
    point: Point2d
): boolean {
    // ベクトルの外積を計算
    const area = (a: Point2d, b: Point2d, c: Point2d): number => {
        return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
    };

    const d1 = area(point, p1, p2);
    const d2 = area(point, p2, p3);
    const d3 = area(point, p3, p1);

    // すべての外積が同じ符号であれば三角形内にある
    const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
    const hasPos = d1 > 0 || d2 > 0 || d3 > 0;

    return !(hasNeg && hasPos);
}