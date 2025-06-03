import { Pet } from './Pet'

export default interface ItemProps {
    setInteractingWithItem: any
    update: (item: keyof Pet['wellBeing']) => void
}
