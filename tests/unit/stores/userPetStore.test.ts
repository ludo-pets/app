import { act } from '@testing-library/react-native'
import { getUserWithPetByEmail, updateUser } from '@/services/userService'
import { updatePet } from '@/services/petService'
import User from '@/dtos/User'
import { Pet } from '@/dtos/Pet'
import { useUserPetStore } from '@/stores/userPetStore'

//

//

jest.mock('@/firebaseConfig')
jest.mock('@/services/userService', () => ({
    getUserWithPetByEmail: jest.fn(),
    updateUser: jest.fn(),
}))
jest.mock('@/services/petService', () => ({
    updatePet: jest.fn(),
}))

const mockedGetUserWithPetByEmail = getUserWithPetByEmail as jest.Mock
const mockedUpdateUser = updateUser as jest.Mock
const mockedUpdatePet = updatePet as jest.Mock

const mockUser: User = {
    id: 'user1',
    email: 'test@example.com',
    achievements: ['ach1'],
    money: 100,
    pet: 'pet1',
    level: 0,
    experience: 0,
    lastLessonConcluded: null,
    notifications: false,
}

const mockPet: Pet = {
    id: 'pet1',
    name: 'Buddy',
    color: 'brown',
    type: 'dog',
    purchasedItems: [],
    activeItems: {
        bed: 'bed1',
        food: 'food1',
        toy: 'toy1',
        wc: 'wc1',
        floor: 'floor1',
        wallpaper: 'wallpaper1',
        water: 'water1',
    },
    wellBeing: {
        clean: 'medium',
        fun: 'high',
        hunger: 'low',
        thirst: 'medium',
        sleep: 'high',
    },
}

describe('useUserPetStore', () => {
    beforeEach(() => {
        act(() => {
            useUserPetStore.setState({
                user: null,
                pet: null,
                loading: true,
                error: null,
            })
        })
        jest.clearAllMocks()
    })

    describe('fetchUserAndPetByEmail', () => {
        it('should fetch user and pet on success', async () => {
            mockedGetUserWithPetByEmail.mockResolvedValue({
                user: mockUser,
                pet: mockPet,
            })
            await useUserPetStore
                .getState()
                .fetchUserAndPetByEmail('test@example.com')
            const { user, pet } = useUserPetStore.getState()
            expect(user).toEqual(mockUser)
            expect(pet).toEqual(mockPet)
        })
    })

    describe('updateUser', () => {
        it('should update user state on success', async () => {
            act(() => useUserPetStore.setState({ user: mockUser }))
            mockedUpdateUser.mockResolvedValue(true)
            await useUserPetStore.getState().updateUser('user1', { money: 150 })
            expect(useUserPetStore.getState().user?.money).toBe(150)
        })
    })

    describe('updatePet', () => {
        it('should update pet state on success', async () => {
            act(() => useUserPetStore.setState({ pet: mockPet }))
            mockedUpdatePet.mockResolvedValue(true)
            await useUserPetStore.getState().updatePet('pet1', { name: 'Max' })
            expect(useUserPetStore.getState().pet?.name).toBe('Max')
        })
    })
})
