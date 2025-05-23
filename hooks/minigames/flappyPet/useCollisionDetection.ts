import { gameConstants } from '@/constants/game'
import { useEffect, useState } from 'react'
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
    const positionYPetNumber = (positionYPet as any).__getValue()
    const positionXPet = gameConstants.positionXPet
    const faixaColisaoEixoXPet =
        gameConstants.positionXPet - gameConstants.petWidth
    const faixaColisaoEixoYPet = positionYPet
    const postionXObstaclesNumber = (positionXObstacles as any).__getValue()

    const { heightObstacleTop, heightObstacleBottom } = obstacleDimensions

    const postionYGround = windowHeight - gameConstants.heightFloor

    const [isColliding, setIsColliding] = useState(false)

    useEffect(() => {
        let animatedFrameId: number

        const checkCollision = () => {
            // console.log('🚀 ~ positionXPet:', positionXPet)
            // console.log('🚀 ~ faixaColisaoEixoYPet:', faixaColisaoEixoYPet)
            // console.log('🚀 ~ heightObstacleTop:', heightObstacleTop)
            // console.log('🚀 ~ heightObstacleBottom:', heightObstacleBottom)

            if (positionYPetNumber >= postionYGround || postionYGround < 0) {
                setIsColliding(true)
                console.log('colidiu no chao')
            }

            // if (postionXObstaclesNumber <= positionXPet) {
            //     // setIsColliding(true)

            //     console.log('colidiu')
            //     console.log(
            //         '🚀 ~ checkCollision ~ postionXObstaclesNumber:',
            //         postionXObstaclesNumber
            //     )
            //     console.log('🚀 ~ positionXObstacles:', positionXObstacles)
            // }

            animatedFrameId = requestAnimationFrame(checkCollision)
        }

        animatedFrameId = requestAnimationFrame(checkCollision)
    })

    return isColliding
}
