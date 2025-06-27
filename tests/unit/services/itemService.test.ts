import { collection, getDocs, addDoc, doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebaseConfig'
import { getAllItems, addItem, duplicateDocument } from '@/services/itemService'
import Item from '@/dtos/Item'

jest.mock('@/firebaseConfig', () => ({ db: {} }))
jest.mock('firebase/firestore')

const mockGetDocs = getDocs as jest.Mock
const mockAddDoc = addDoc as jest.Mock
const mockGetDoc = getDoc as jest.Mock
const mockDoc = doc as jest.Mock
const mockCollection = collection as jest.Mock

describe('ItemService', () => {
    let consoleSpy: jest.SpyInstance

    beforeEach(() => {
        jest.clearAllMocks()
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
        consoleSpy.mockRestore()
    })

    describe('getAllItems', () => {
        it('should return a list of items on success', async () => {
            const mockItemsData: Partial<Item>[] = [
                { id: 'item1', name: 'Healing Potion' },
            ]
            const mockDocs = mockItemsData.map((item) => ({
                id: item.id,
                data: () => item,
            }))
            mockGetDocs.mockResolvedValue({ docs: mockDocs })

            const result = await getAllItems()

            expect(result?.items).toHaveLength(1)
            expect(result?.items[0].name).toBe('Healing Potion')

            expect(result?.items[0].id).toBe('item1')
        })

        it('should use doc.id as a fallback if data.id is missing', async () => {
            const mockItemDataWithoutId = { name: 'Sword of Fallback' }
            const mockDocs = [
                { id: 'fallback-doc-id', data: () => mockItemDataWithoutId },
            ]
            mockGetDocs.mockResolvedValue({ docs: mockDocs })

            const result = await getAllItems()

            expect(result).not.toBeNull()
            expect(result?.items).toHaveLength(1)

            expect(result?.items[0].id).toBe('fallback-doc-id')
        })

        it('should return null and log an error if the fetch fails', async () => {
            const error = new Error('Fetch failed')
            mockGetDocs.mockRejectedValue(error)
            const result = await getAllItems()
            expect(result).toBeNull()
            expect(consoleSpy).toHaveBeenCalledWith(
                'Erro ao buscar itens:',
                error
            )
        })
    })

    describe('addItem', () => {
        it('should add an item and return null', async () => {
            const result = await addItem()
            expect(mockAddDoc).toHaveBeenCalled()
            expect(result).toBeNull()
        })

        it('should log an error if adding fails', async () => {
            const error = new Error('Failed to add')
            mockAddDoc.mockRejectedValue(error)
            const result = await addItem()
            expect(result).toBeNull()
            expect(consoleSpy).toHaveBeenCalledWith(
                'Erro ao adicionar Pet:',
                error
            )
        })
    })

    describe('duplicateDocument', () => {
        it('should duplicate a document if it exists', async () => {
            const mockData = { email: 'test@example.com' }

            mockGetDoc.mockResolvedValue({
                exists: () => true,
                data: () => mockData,
            })
            mockAddDoc.mockResolvedValue({ id: 'newDocId' })

            await duplicateDocument()

            expect(consoleSpy).toHaveBeenCalledWith(mockData)
            expect(mockAddDoc).toHaveBeenCalledWith(expect.anything(), mockData)

            expect(consoleSpy).toHaveBeenCalledWith(
                'Documento duplicado com ID:',
                'newDocId'
            )
        })

        it('should log "Documento não encontrado!" by forcing a falsy snapshot', async () => {
            mockGetDoc.mockResolvedValue(null)

            await duplicateDocument()

            expect(consoleSpy).toHaveBeenCalledWith('Documento não encontrado!')
            expect(mockAddDoc).not.toHaveBeenCalled()
        })

        it('should log that the document was not found if it does not exist', async () => {
            mockGetDoc.mockResolvedValue({
                exists: () => false,
                data: () => undefined,
            })

            await duplicateDocument()

            expect(consoleSpy).toHaveBeenCalledWith('Documento não encontrado!')
            expect(mockAddDoc).not.toHaveBeenCalled()
        })
    })
})
