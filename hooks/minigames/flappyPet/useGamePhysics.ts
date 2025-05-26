import { gameConstants } from '@/constants/minigames/flappyPet/game'
import { useEffect, useRef, useState } from 'react'
import { Animated } from 'react-native'
import useGameManager from './useGameManager'

export default function useGamePhysics(gameOver: boolean, isPaused: boolean) {
    const gameManager = useGameManager()
    const isFallingAnimation = gameManager.isFallingAnimation

    const prevValuePositionY = useRef(gameConstants.initialDimensions.positionY)
    const [gravity, setGravity] = useState(gameConstants.initialGravity)
    const positionYPet = useRef(
        new Animated.Value(gameConstants.initialDimensions.positionY)
    ).current
    const animationFrame = useRef<number | null>(null)

    const airPlaneDegree = useRef(
        new Animated.Value(gameConstants.airPlaneDegree)
    ).current

    function handleFlyDirection(direction: 'up' | 'down' | 'none') {
        let gravityStrength = 0
        switch (direction) {
            case 'up':
                gravityStrength = gameConstants.flyUpStrength
                break
            case 'down':
                gravityStrength = gameConstants.flyDownStrength
                break
            case 'none':
                gravityStrength = gameConstants.initialGravity
                break
        }
        setGravity(gravityStrength)
    }

    function handleAirPlaneDegree(degree: number) {
        airPlaneDegree.stopAnimation()
        if (gameOver || isPaused || isFallingAnimation) {
            airPlaneDegree.setValue(gameConstants.airPlaneDegree)
            return
        }
        Animated.spring(airPlaneDegree, {
            toValue: degree,
            useNativeDriver: false,
            bounciness: 0,
            speed: 10,
        }).start()
    }
    function resetAnimation() {
        if (animationFrame.current !== null) {
            cancelAnimationFrame(animationFrame.current)
            animationFrame.current = null
        }
    }
    useEffect(() => {
        if (
            prevValuePositionY.current == null ||
            gameOver ||
            isPaused ||
            isFallingAnimation
        ) {
            resetAnimation()
            return
        }
        const updatePetPosition = () => {
            const newPosition = prevValuePositionY.current + gravity
            positionYPet.setValue(newPosition)
            prevValuePositionY.current = newPosition
            animationFrame.current = requestAnimationFrame(updatePetPosition)
        }
        animationFrame.current = requestAnimationFrame(updatePetPosition)

        return () => {
            resetAnimation()
        }
    }, [gravity, gameOver, isPaused, isFallingAnimation])

    return {
        positionYPet,
        airPlaneDegree,
        setGravity,
        handleFlyDirection,
        handleAirPlaneDegree,
    }
}
