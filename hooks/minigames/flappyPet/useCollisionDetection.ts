import { gameConstants } from '@/constants/game'
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
    // const positionYPetNumber = (positionYPet as any).__getValue()
    const positionXPet = gameConstants.positionXPet
    const faixaColisaoEixoXPet =
        gameConstants.positionXPet - gameConstants.petWidth
    const faixaColisaoEixoYPet = positionYPet
    // const postionXObstaclesNumber = (positionXObstacles as any).__getValue()

    const postionYGround = windowHeight - gameConstants.heightFloor
    const faixaColisaoGround = postionYGround - gameConstants.petHeight * 1.7
    const faixaColisaoRoof = 0 - gameConstants.petHeight * 0.4
    // const faixaColisaoRoof = 0
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
            // const { heightObstacleTop, heightObstacleBottom } =
            //     obstacleDimensions
            positionYPet.addListener((event) => {
                positionYPetNumber = event.value
            })
            positionXObstacles.addListener((event) => {
                positionXObstaclesNumber = event.value
            })

            if (positionYPetNumber >= faixaColisaoGround) {
                setIsColliding(true)
                // console.log('colidiu no chao')
            }

            // positionYPetNumber >= heightObstacleTop.current
            // positionYPetNumber <= heightObstacleTop.current

            const colisaoObstaculoBottom =
                windowHeight -
                gameConstants.heightFloor -
                heightObstacleBottom.current

            if (
                positionXObstaclesNumber <= faixaColisaoObstaculo &&
                (positionYPetNumber >=
                    colisaoObstaculoBottom - gameConstants.petHeight * 0.8 ||
                    positionYPetNumber <=
                        heightObstacleTop.current -
                            gameConstants.petHeight * 0.4)
            ) {
                setIsColliding(true)
            }

            animatedFrameId = requestAnimationFrame(checkCollision)
        }

        animatedFrameId = requestAnimationFrame(checkCollision)
    }, [obstacleDimensions])

    return isColliding
}
