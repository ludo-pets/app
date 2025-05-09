export default interface Pet {
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
    wellBeing: {
        clean: string
        fun: string
        hunger: string
        thirst: string
        sleep: string
    }
}
