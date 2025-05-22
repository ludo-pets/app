import { Coordinate } from "@/dtos/GestureEventType";

export const checkGameOver = (dogHead: Coordinate, boundaries: any):boolean => {
    return (
        dogHead.x < boundaries.xMin ||
        dogHead.x > boundaries.xMax ||
        dogHead.y > boundaries.yMax ||
        dogHead.y < boundaries.yMin 

    )
}