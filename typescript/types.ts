
export type Point2d = { x: number, y: number };

// 四角形の定義
export type RectPoint = Point2d[];
export type PlayerData = { rectPoints: RectPoint[] };
export type AllPlayerData = PlayerData[];
