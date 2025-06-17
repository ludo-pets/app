export interface Nail {
    id: number
    position: { x: number; y: number }
    rotation: `${string}deg`
    isTrimmed: boolean
    isfliped?: boolean
}
export type NailProgress = { [key: number]: number }
