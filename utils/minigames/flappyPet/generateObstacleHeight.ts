export function generateObstacleHeights(
    windowHeight: number,
    heightSpace: number,
    heightFloor: number
) {
    const spaceOffset = windowHeight - heightSpace
    const heightTopObstacle = Math.random() * spaceOffset
    const heightBottomObstacle = spaceOffset - heightTopObstacle

    return {
        heightObstacleTop: heightTopObstacle,
        heightObstacleBottom: heightBottomObstacle,
    }
}
