
export type Point2d = { x: number, y: number };
export type PlayerState = "setStone" | "triangle";

// 四角形の定義
export type TrianglePoint = Point2d[];
export type PlayerData = { trianglePoints: TrianglePoint[], state: PlayerState };
export type AllPlayerData = PlayerData[];
