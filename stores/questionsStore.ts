import { create } from 'zustand'
import Question from '@/dtos/Question'

import { fetchAllQuestionsService } from '@/services/questionsService'

interface QuestionsStoreState {
    questions: Question[]
    loading: boolean
    error: string | null
    fetchQuestions: () => Promise<void>
    setQuestions: (questions: Question[]) => void
}

export const useQuestionsStore = create<QuestionsStoreState>((set) => ({
    questions: [],
    loading: false,
    error: null,

    fetchQuestions: async () => {
        set({ loading: true, error: null })
        try {
            const result = await fetchAllQuestionsService()
            if (result) {
                set({ questions: result.questions, loading: false })
            } else {
                set({ error: 'Questões não encontradas', loading: false })
            }
        } catch (error: any) {
            set({
                error: error.message || 'Erro ao buscar questões',
                loading: false,
            })
        }
    },

    setQuestions: (questions: Question[]) => set({ questions }),
}))
