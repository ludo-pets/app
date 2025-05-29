import { fetchAllQuestionsService } from '@/services/questionService'
import { getDocs } from 'firebase/firestore'

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
}))

describe('fetchAllQuestionsService', () => {
  it('should return a list of questions', async () => {
    const mockDocs = [
      {
        id: 'q1',
        data: () => ({
          answers: ['A', 'B'],
          description: 'desc',
          explanation: 'expl',
          rightAnswer: 'A',
          title: 'Title 1',
        }),
      },
    ]
    ;(getDocs as jest.Mock).mockResolvedValue({ docs: mockDocs })

    const result = await fetchAllQuestionsService()
    expect(result?.questions.length).toBe(1)
    expect(result?.questions[0].id).toBe('q1')
  })

  it('should handle empty results', async () => {
    ;(getDocs as jest.Mock).mockResolvedValue({ docs: [] })
    const result = await fetchAllQuestionsService()
    expect(result?.questions).toEqual([])
  })

  it('should throw on error', async () => {
    ;(getDocs as jest.Mock).mockRejectedValue(new Error('Firestore error'))
    await expect(fetchAllQuestionsService()).rejects.toThrow('Failed to fetch quiz questions.')
  })
})
