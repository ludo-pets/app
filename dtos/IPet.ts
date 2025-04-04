export interface IPet {
    id: string
    name: string
    type: 'cat' | 'dog'
    color: string
    items: Array<{
        is_active: boolean
        item_id: string // ID do item (ou DocumentReference)
        quantity: number
    }>
    well_being: {
        clean: number
        fun: number
        hunger: number
        thirst: number
    }
}
