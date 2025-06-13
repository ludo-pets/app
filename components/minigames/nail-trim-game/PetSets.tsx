import { ImageSourcePropType } from "react-native"
import { Nail } from "./types"

const catNailsSet: Nail[] = [
    {
        id: 1,
        position: { x: 0.20, y: 0.57 },
        rotation: '345deg',
        isTrimmed: false,
        isfliped: false
    },
    {
        id: 2,
        position: { x: 0.248, y: 0.465 },
        rotation: '0deg',
        isTrimmed: false,
        isfliped: false
    },
    {
        id: 3,
        position: { x: 0.335, y: 0.42 },
        rotation: '0deg',
        isTrimmed: false,
        isfliped: false
    },
    {
        id: 4,
        position: { x: 0.48, y: 0.47 },
        rotation: '45deg',
        isTrimmed: false,
        isfliped: false
    },
]
const dogNailSet: Nail[] = [
    {
        id: 1,
        position: { x: 0.230, y: 0.52 },
        rotation: '0deg',
        isTrimmed: false,
        isfliped: false
    },
    {
        id: 2,
        position: { x: 0.34, y: 0.415 },
        rotation: '0deg',
        isTrimmed: false,
        isfliped: false
    },
    {
        id: 3,
        position: { x: 0.50, y: 0.415 },
        rotation: '0deg',
        isTrimmed: false,
        isfliped: true
    },
    {
        id: 4,
        position: { x: 0.6, y: 0.52 },
        rotation: '0deg',
        isTrimmed: false,
        isfliped: true
    },
]

type petSetType = {
    cat: {
        nailSet: Nail[];
        pawImage: string;
        nailShortImage: string | null;
        nailLongImage: string;
    },
    dog:  {
        nailSet: Nail[];
        pawImage: string;
        nailShortImage: string | null;
        nailLongImage: string;
    }
}
export const petSet: petSetType = {
    cat: {
        nailSet: catNailsSet,
        pawImage: "https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/assets/minigames/nail-trimmer/paw.png",
        nailShortImage: "https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/assets/minigames/nail-trimmer/nail-short.png",
        nailLongImage: "https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/assets/minigames/nail-trimmer/nail-long.png",

    },
    dog: {
        nailSet: dogNailSet,
        pawImage: "https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/assets/minigames/nail-trimmer/dog_paw-min.png",
        nailLongImage: "https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/assets/minigames/nail-trimmer/dog_nail-min.png",
        nailShortImage: null
    },
}