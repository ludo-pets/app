import { gameConstants } from '@/constants/game'
import { useEffect, useRef, useState } from 'react'
import { Animated } from 'react-native'

export default function useGamePhysics(gameOver: boolean, isPaused: boolean) {
    const prevValuePositionY = useRef(gameConstants.initialDimensions.positionY)
    const [gravity, setGravity] = useState(gameConstants.initialGravity)
    const positionYPet = useRef(
        new Animated.Value(gameConstants.initialDimensions.positionY)
    ).current
    // const positionYPet = useRef(new Animated.Value(0)).current
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
        if (gameOver) {
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

    useEffect(() => {
        if (gameOver || isPaused) {
            // if (gameOver || isPaused) {
            if (animationFrame.current) {
                cancelAnimationFrame(animationFrame.current)
            }
            return
        }
        const updatePetPosition = () => {
            if (prevValuePositionY.current == null) return

            const newPosition = prevValuePositionY.current + gravity
            positionYPet.setValue(newPosition)
            prevValuePositionY.current = newPosition
            animationFrame.current = requestAnimationFrame(updatePetPosition)
        }
        animationFrame.current = requestAnimationFrame(updatePetPosition)

        return () => {
            if (animationFrame.current) {
                cancelAnimationFrame(animationFrame.current)
            }
        }
    }, [gravity, gameOver, isPaused])

    return {
        positionYPet,
        airPlaneDegree,
        setGravity,
        handleFlyDirection,
        handleAirPlaneDegree,
    }
}
