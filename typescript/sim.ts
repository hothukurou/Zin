import { isPointInQuadrilateral } from "./common_ui/check_in_rect";
import { AllPlayerData, Point2d } from "./types";

const ScreenMinX = 50;
const ScreenMinY = 50;
const ScreenWidth = 900;
const ScreenHeight = 500;
export const strangth = 200;

export const simulateThrowStones = (nowPlayer: number, allPlayerData: AllPlayerData): Point2d[] => {
    let bestArea = 0; // 最大の面積
    let bestPoints: Point2d[] = [];
    const simCount = 1000;

    for (let i = 0; i < simCount; i++) {
        // 初期位置を決める
        let firstPoint: Point2d;
        do {
            firstPoint = { x: Math.random() * ScreenWidth + ScreenMinX, y: Math.random() * ScreenHeight + ScreenMinY };
        } while (!isPointInQuadrilateral(allPlayerData[nowPlayer], firstPoint));

        const points: Point2d[] = [firstPoint];

        // 二点目以降を決める
        for (let j = 1; j < 3; j++) {
            const prevPoint = points[j - 1];
            let nextPoint: Point2d;
            do {
                const angle = Math.random() * 2 * Math.PI;
                const distance = Math.random() * strangth;
                nextPoint = {
                    x: prevPoint.x + Math.cos(angle) * distance,
                    y: prevPoint.y + Math.sin(angle) * distance
                };
            } while (nextPoint.x < ScreenMinX || nextPoint.x > ScreenMinX + ScreenWidth ||
            nextPoint.y < ScreenMinY || nextPoint.y > ScreenMinY + ScreenHeight);
            points.push(nextPoint);
        }

        // 四点目を決める
        let fourthPoint: Point2d;
        do {
            fourthPoint = { x: Math.random() * ScreenWidth + ScreenMinX, y: Math.random() * ScreenHeight + ScreenMinY };
        } while (!isPointInQuadrilateral(allPlayerData[nowPlayer], fourthPoint));
        points.push(fourthPoint);

        // 面積を計算
        const area = calcArea(points);
        if (area > bestArea) {
            bestArea = area;
            bestPoints = points;
        }
    }

    return bestPoints;
}

function calcArea(points: Point2d[]): number {
    if (points.length !== 4) {
        throw new Error("Four points are required to calculate the area.");
    }

    const [p1, p2, p3, p4] = points;

    // 三角形の面積を計算するヘルパー関数
    const triangleArea = (a: Point2d, b: Point2d, c: Point2d): number => {
        return Math.abs((a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y)) / 2);
    };

    // 四角形を二つの三角形に分割して面積を計算
    const area1 = triangleArea(p1, p2, p3);
    const area2 = triangleArea(p1, p3, p4);

    return area1 + area2;
}