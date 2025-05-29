import { fetchQuestionById } from '@/services/questionService'
import { getDoc, doc } from 'firebase/firestore'

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}))

describe('fetchQuestionById', () => {
  it('should return question data by ID', async () => {
    const mockSnap = {
      exists: () => true,
      id: 'q1',
      data: () => ({
        answers: ['A', 'B'],
        description: 'desc',
        explanation: 'expl',
        rightAnswer: 'A',
        title: 'Title 1',
      }),
    }
    ;(getDoc as jest.Mock).mockResolvedValue(mockSnap)

    const result = await fetchQuestionById('q1')
    expect(result.id).toBe('q1')
  })

  it('should throw if document does not exist', async () => {
    const mockSnap = { exists: () => false }
    ;(getDoc as jest.Mock).mockResolvedValue(mockSnap)
    await expect(fetchQuestionById('invalid')).rejects.toThrow(
      'Question with ID invalid does not exist.'
    )
  })

  it('should throw on error', async () => {
    ;(getDoc as jest.Mock).mockRejectedValue(new Error('Firestore error'))
    await expect(fetchQuestionById('q1')).rejects.toThrow('Failed to fetch the question.')
  })
})
