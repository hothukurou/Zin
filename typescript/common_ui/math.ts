import { Point2d } from "../types";


export const calcLength = (point1: Point2d, point2: Point2d) => {
    const vec = { x: point2.x - point1.x, y: point2.y - point1.y };
    return length = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}

export const calcUnitVector = (point1: Point2d, point2: Point2d) => {
    const vec = { x: point2.x - point1.x, y: point2.y - point1.y };
    const length = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
    return { x: vec.x / length, y: vec.y / length };
}