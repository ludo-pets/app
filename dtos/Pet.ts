export default interface Pet {
    id: string
    name: string
    color: string
    type: 'cat' | 'dog'
    purchasedItems: {
        itemId: string
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
    wellBeing: {
        clean: string
        fun: string
        hunger: string
        thirst: string
        sleep: string
    }
}
