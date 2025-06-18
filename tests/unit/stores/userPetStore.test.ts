import { act } from '@testing-library/react-native'
import { getUserWithPetByEmail, updateUser } from '@/services/userService'
import { updatePet } from '@/services/petService'
import User from '@/dtos/User'
import { Pet } from '@/dtos/Pet'
import { useUserPetStore } from '@/stores/userPetStore'

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
    lastLessonConcluded: '',
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
    const initialState = {
        user: null,
        pet: null,
        loading: true,
        error: null,
    }

    beforeEach(() => {
        act(() => {
            useUserPetStore.setState(initialState)
        })
        jest.clearAllMocks()
    })

    describe('fetchUserAndPetByEmail', () => {
        const email = 'test@example.com'

        it('should fetch user and pet on success', async () => {
            mockedGetUserWithPetByEmail.mockResolvedValue({
                user: mockUser,
                pet: mockPet,
            })
            await useUserPetStore.getState().fetchUserAndPetByEmail(email)
            const { user, pet, loading, error } = useUserPetStore.getState()
            expect(user).toEqual(mockUser)
            expect(pet).toEqual(mockPet)
            expect(loading).toBe(false)
            expect(error).toBeNull()
        })

        it('should set an error if service returns falsy', async () => {
            mockedGetUserWithPetByEmail.mockResolvedValue(null)
            await useUserPetStore.getState().fetchUserAndPetByEmail(email)
            const { error, loading } = useUserPetStore.getState()
            expect(error).toBe('User ou Pet não encontrado')
            expect(loading).toBe(false)
        })

        it('should set an error if service throws', async () => {
            const errorMessage = 'DB error'
            mockedGetUserWithPetByEmail.mockRejectedValue(
                new Error(errorMessage)
            )
            await useUserPetStore.getState().fetchUserAndPetByEmail(email)
            const { error, loading } = useUserPetStore.getState()
            expect(error).toBe(errorMessage)
            expect(loading).toBe(false)
        })
    })

    describe('updateUser', () => {
        it('should update user state on success', async () => {
            act(() => useUserPetStore.setState({ user: mockUser }))
            mockedUpdateUser.mockResolvedValue(true)
            const userData: Partial<User> = { money: 150 }
            await useUserPetStore.getState().updateUser('user1', userData)
            const { user, loading } = useUserPetStore.getState()
            expect(user?.money).toBe(150)
            expect(loading).toBe(false)
        })

        it('should not update state if original user is not present', async () => {
            mockedUpdateUser.mockResolvedValue(true)
            const userData: Partial<User> = { money: 150 }
            await useUserPetStore.getState().updateUser('user1', userData)
            const { user } = useUserPetStore.getState()
            expect(user).toBeNull()
        })

        it('should set an error if update service returns false', async () => {
            act(() => useUserPetStore.setState({ user: mockUser }))
            mockedUpdateUser.mockResolvedValue(false)
            const userData: Partial<User> = { money: 150 }
            await useUserPetStore.getState().updateUser('user1', userData)
            const { error, loading } = useUserPetStore.getState()
            expect(error).toBe('Erro ao atualizar o usuário')
            expect(loading).toBe(false)
        })

        it('should set an error if update service throws', async () => {
            act(() => useUserPetStore.setState({ user: mockUser }))
            const errorMessage = 'Update failed'
            mockedUpdateUser.mockRejectedValue(new Error(errorMessage))
            const userData: Partial<User> = { money: 150 }
            await useUserPetStore.getState().updateUser('user1', userData)
            const { error, loading } = useUserPetStore.getState()
            expect(error).toBe(errorMessage)
            expect(loading).toBe(false)
        })
    })

    describe('updatePet', () => {
        it('should update pet state on success', async () => {
            act(() => useUserPetStore.setState({ pet: mockPet }))
            mockedUpdatePet.mockResolvedValue(true)
            const petData: Partial<Pet> = {
                name: 'Max',
                wellBeing: { ...mockPet.wellBeing, fun: 'medium' },
            }
            await useUserPetStore.getState().updatePet('pet1', petData)
            const { pet } = useUserPetStore.getState()
            expect(pet?.name).toBe('Max')
            expect(pet?.wellBeing?.fun).toBe('medium')
        })

        it('should set an error if update service returns false', async () => {
            act(() => useUserPetStore.setState({ pet: mockPet }))

            mockedUpdatePet.mockResolvedValue(false)

            await useUserPetStore.getState().updatePet('pet1', {})

            expect(useUserPetStore.getState().error).toBe(
                'Erro ao atualizar o pet'
            )
        })

        it('should set an error if update service throws', async () => {
            act(() => useUserPetStore.setState({ pet: mockPet }))
            const errorMessage = 'Pet update failed'
            mockedUpdatePet.mockRejectedValue(new Error(errorMessage))
            await useUserPetStore.getState().updatePet('pet1', {})
            expect(useUserPetStore.getState().error).toBe(errorMessage)
        })

        it('should handle update failure when no pet is in state', async () => {
            mockedUpdatePet.mockResolvedValue(false)

            await useUserPetStore
                .getState()
                .updatePet('any-pet-id', { name: 'Ghost' })

            const { pet, error } = useUserPetStore.getState()

            expect(mockedUpdatePet).toHaveBeenCalledWith('any-pet-id', {
                name: 'Ghost',
            })

            expect(error).toBe('Erro ao atualizar o pet')

            expect(pet).toBeNull()
        })
    })

    describe('updateAchievements', () => {
        it('should add a new achievement if not already owned', async () => {
            act(() =>
                useUserPetStore.setState({
                    user: { ...mockUser, achievements: [] },
                })
            )
            mockedUpdateUser.mockResolvedValue(true)
            const newAchievement = 'ach2'
            await useUserPetStore.getState().updateAchievements(newAchievement)
            const { user } = useUserPetStore.getState()
            expect(user?.achievements).toContain(newAchievement)
            expect(mockedUpdateUser).toHaveBeenCalledWith('user1', {
                achievements: [newAchievement],
            })
        })

        it('should not add an achievement if already owned', async () => {
            act(() => useUserPetStore.setState({ user: mockUser }))
            await useUserPetStore.getState().updateAchievements('ach1')
            expect(mockedUpdateUser).not.toHaveBeenCalled()
        })

        it('should set an error if updating achievements fails', async () => {
            act(() => {
                useUserPetStore.setState({
                    user: { ...mockUser, achievements: [] },
                })
            })

            const errorMessage =
                'Falha ao atualizar conquistas no banco de dados'
            mockedUpdateUser.mockRejectedValue(new Error(errorMessage))

            await useUserPetStore
                .getState()
                .updateAchievements('nova-conquista')

            const { error } = useUserPetStore.getState()
            expect(error).toBe(errorMessage)
        })

        it('should always set loading to false after execution', async () => {
            act(() => {
                useUserPetStore.setState({ user: mockUser, loading: true })
            })

            await useUserPetStore
                .getState()
                .updateAchievements('any-achievement')

            const { loading } = useUserPetStore.getState()
            expect(loading).toBe(false)
        })

        it('should set an error if the user update fails', async () => {
            act(() => {
                useUserPetStore.setState({ user: mockUser })
            })

            const errorMessage = 'API Error'
            mockedUpdateUser.mockRejectedValue(new Error(errorMessage))

            await useUserPetStore
                .getState()
                .updateAchievements('new-achievement')

            expect(useUserPetStore.getState().error).toBe(errorMessage)
        })

        it('should set an error when trying to update achievements for a null user', async () => {
            act(() => {
                useUserPetStore.setState({ user: null })
            })

            await useUserPetStore
                .getState()
                .updateAchievements('any-achievement')

            const { error, loading } = useUserPetStore.getState()

            expect(loading).toBe(false)
            expect(error).toBe('Usuário não encontrado')
        })
    })

    describe('setters', () => {
        it('should set user correctly', () => {
            act(() => useUserPetStore.getState().setUser(mockUser))
            expect(useUserPetStore.getState().user).toEqual(mockUser)
        })

        it('should set pet correctly', () => {
            act(() => useUserPetStore.getState().setPet(mockPet))
            expect(useUserPetStore.getState().pet).toEqual(mockPet)
        })

        it('setAchievements should be callable without errors', () => {
            expect(() =>
                useUserPetStore.getState().setAchievements('test')
            ).not.toThrow()
        })
    })
})
