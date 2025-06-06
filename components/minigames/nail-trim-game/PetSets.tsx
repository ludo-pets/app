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
        pawImage: ImageSourcePropType;
        nailShortImage: ImageSourcePropType | null;
        nailLongImage: ImageSourcePropType;
    },
    dog:  {
        nailSet: Nail[];
        pawImage: ImageSourcePropType;
        nailShortImage: ImageSourcePropType | null;
        nailLongImage: ImageSourcePropType;
    }
}
export const petSet: petSetType = {
    cat: {
        nailSet: catNailsSet,
        pawImage: require('@/assets/images/minigames/nail-trimmer/paw.png'),
        nailShortImage: require('@/assets/images/minigames/nail-trimmer/nail-short.png'),
        nailLongImage: require('@/assets/images/minigames/nail-trimmer/nail-long.png'),

    },
    dog: {
        nailSet: dogNailSet,
        pawImage: require('@/assets/images/minigames/nail-trimmer/dog_paw.png'),
        nailLongImage: require('@/assets/images/minigames/nail-trimmer/dog_nail.png'),
        nailShortImage: null
    },
}