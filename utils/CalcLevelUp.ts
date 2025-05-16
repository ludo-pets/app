export const calcLevelUp = (
    oldXp: number,
    level: number,
    newXp: number
) => {
    let currentXp = oldXp + newXp
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
