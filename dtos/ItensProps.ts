import Pet from './Pet'

export default interface ItemProps {
    update: (item: keyof Pet['wellBeing']) => void
}
