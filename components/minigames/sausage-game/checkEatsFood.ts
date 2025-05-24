import { Coordinate } from "@/dtos/GestureEventType";

export const checkEatsFood = (
    head: Coordinate,
    food: Coordinate,
    area: number
): boolean => {
    const distanceBetweenFoodAndDogX: number = Math.abs(head.x - food.x);
    const distanceBetweenFoodAndDogY: number = Math.abs(head.y - food.y);
    return (
        distanceBetweenFoodAndDogX < area && distanceBetweenFoodAndDogY < area
    )
}