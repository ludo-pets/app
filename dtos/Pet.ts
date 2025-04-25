export interface Pet {
    id: string
    name: string
    color: string
    type: 'cat' | 'dog'
    purchasedItems: {
        id: string
        quantity?: number
    }[]
    activeItems: {
        bed: string
        food: string
        toy: string
        wc: string
        floor: string
        wallpaper: string
    }
    wellBeing: Wellbeing
}

export interface Wellbeing {
    clean: Date
    fun: Date
    hunger: Date
    thirst: Date
    sleep: Date
}