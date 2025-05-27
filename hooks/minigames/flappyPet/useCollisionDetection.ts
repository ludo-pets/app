import { gameConstants } from '@/constants/minigames/flappyPet/game'
import { useEffect, useRef, useState } from 'react'
import { Animated, Dimensions } from 'react-native'
import { DimensionsObstacle } from './useObstacleManager'

interface CollisionProps {
    positionYPet: Animated.Value
    positionXObstacles: Animated.Value
    obstacleDimensions: DimensionsObstacle
}

export default function useCollisionDetection({
    positionYPet,
    obstacleDimensions,
    positionXObstacles,
}: CollisionProps) {
    const { height: windowHeight } = Dimensions.get('window')

    const postionYGround = windowHeight - gameConstants.heightFloor
    // const faixaColisaoGround = postionYGround - gameConstants.petHeight * 1.7
    const faixaColisaoGround = postionYGround

    const faixaColisaoObstaculo =
        gameConstants.petWidth + gameConstants.petWidth * 0.8

    const [isColliding, setIsColliding] = useState(false)

    const heightObstacleTop = useRef(obstacleDimensions.heightObstacleTop)
    const heightObstacleBottom = useRef(obstacleDimensions.heightObstacleBottom)

    useEffect(() => {
        let animatedFrameId: number
        let positionYPetNumber: number
        let positionXObstaclesNumber: number

        heightObstacleTop.current = obstacleDimensions.heightObstacleTop
        heightObstacleBottom.current = obstacleDimensions.heightObstacleBottom

        const checkCollision = () => {
            positionYPet.addListener((event) => {
                positionYPetNumber = event.value
            })

            positionXObstacles.addListener((event) => {
                positionXObstaclesNumber = event.value
            })

            if (positionYPetNumber >= faixaColisaoGround) {
                setIsColliding(true)
            }

            const colisaoObstaculoBottom =
                windowHeight -
                gameConstants.heightFloor -
                heightObstacleBottom.current

            const isObstacleInCollisionRange =
                positionXObstaclesNumber <= faixaColisaoObstaculo

            const isCollidingWithBottomObstacle =
                positionYPetNumber >=
                colisaoObstaculoBottom - gameConstants.petHeight * 0.8

            const isCollidingWithTopObstacle =
                positionYPetNumber <=
                heightObstacleTop.current - gameConstants.petHeight * 0.4

            if (
                isObstacleInCollisionRange &&
                (isCollidingWithBottomObstacle || isCollidingWithTopObstacle)
            ) {
                setIsColliding(true)
            }

            animatedFrameId = requestAnimationFrame(checkCollision)
        }

        animatedFrameId = requestAnimationFrame(checkCollision)

        return () => {
            positionYPet.removeAllListeners()
            positionXObstacles.removeAllListeners()
            if (animatedFrameId) {
                cancelAnimationFrame(animatedFrameId)
            }
        }
    }, [obstacleDimensions])

    return isColliding
}
