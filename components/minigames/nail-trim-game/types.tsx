export interface Nail {
    id: number
    position: { x: number; y: number }
    rotation: `${string}deg`
    isTrimmed: boolean
}
export type NailProgress = { [key: number]: number }
