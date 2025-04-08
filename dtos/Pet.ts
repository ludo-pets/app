export default interface Pet {
    id: string;
    name: string;
    color: string;
    type: "cat" | "dog";
    purchasedItems: {
        id: string;
        quantity?: number;
    }[];
    activeItems: {
        bed: string;
        food: string;
        toy: string;
        wc: string;
    };
    wellBeing : {
        clean: Date;
        fun: Date;
        hunger: Date;
        thirst: Date;
        sleep: Date;
    };
}
