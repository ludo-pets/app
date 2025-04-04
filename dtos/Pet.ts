export default interface Pet {
    id: string;
    name: string;
    color: string;
    type: "cat" | "dog";
    purchasedItems: {
        id: string;
        quantity?: number;
    };
    activeItems: string[];
    wellBeing : {
        clean: number;
        fun: number;
        hunger: number;
        thirst: number;
    };
}
