import { ImageSourcePropType } from "react-native"
import { Nail } from "./types"

const catNailsSet: Nail[] = [
    {
        id: 1,
        position: { x: 0.215, y: 0.57 },
        rotation: '85deg',
        isTrimmed: false,
    },
    {
        id: 2,
        position: { x: 0.248, y: 0.465 },
        rotation: '0deg',
        isTrimmed: false,
    },
    {
        id: 3,
        position: { x: 0.335, y: 0.42 },
        rotation: '50deg',
        isTrimmed: false,
    },
    {
        id: 4,
        position: { x: 0.48, y: 0.47 },
        rotation: '45deg',
        isTrimmed: false,
    },
]
const dogNailSet: Nail[] = [
    {
        id: 1,
        position: { x: 0.215, y: 0.57 },
        rotation: '85deg',
        isTrimmed: false,
    },
    {
        id: 2,
        position: { x: 0.248, y: 0.465 },
        rotation: '0deg',
        isTrimmed: false,
    },
    {
        id: 3,
        position: { x: 0.335, y: 0.42 },
        rotation: '50deg',
        isTrimmed: false,
    },
    {
        id: 4,
        position: { x: 0.48, y: 0.47 },
        rotation: '45deg',
        isTrimmed: false,
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
        nailSet: dogNailSet, // Placeholder for dog nails set
        pawImage: require('@/assets/images/minigames/nail-trimmer/dog_paw.png'),
        nailLongImage: require('@/assets/images/minigames/nail-trimmer/dog_nail.png'),
        nailShortImage: null
    },
}