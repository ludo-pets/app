export interface Pet {
    id: string
    name: string
    color: string
    type: 'cat' | 'dog'
    purchasedItems: {
        itemId: string
        quantity?: number
        image?: string
    }[]
    activeItems: {
        bed: string
        food: string
        toy: string
        wc: string
        floor: string
        wallpaper: string
        water: string
    }
    wellBeing: Wellbeing
}

export interface Wellbeing {
    clean: string
    fun: string
    hunger: string
    thirst: string
    sleep: string
}
