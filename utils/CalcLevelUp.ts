export const calcLevelUp = (
    xp: number,
    level: number
): { xp: number; level: number } => {
    let currentXp = xp
    let currentLevel = level

    while (true) {
        const xpToNextLevel = calcMaxXp(currentLevel)

        if (currentXp >= xpToNextLevel) {
            currentXp -= xpToNextLevel
            currentLevel++
        } else {
            break
        }
    }

    return { xp: currentXp, level: currentLevel }
}

export const calcMaxXp = (currentLevel: number) => {
    const xpToNextLevel = 90 + currentLevel * 10
    return xpToNextLevel
}
