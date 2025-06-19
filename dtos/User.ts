export default interface User {
    id: string
    email: string
    money: number
    level: number
    experience: number
    lastLessonConcluded: string | null
    notifications: boolean
    pet: string
    achievements: string[]
}
