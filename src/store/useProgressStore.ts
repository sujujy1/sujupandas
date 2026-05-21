import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProblemScore {
  problemId: string;
  score: number;
  completed: boolean;
  lastAttempt: string;
}

interface ProgressState {
  totalScore: number;
  completedProblems: number;
  totalProblems: number;
  problemScores: ProblemScore[];
  updateScore: (problemId: string, score: number) => void;
  resetProgress: () => void;
}

const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      totalScore: 0,
      completedProblems: 0,
      totalProblems: 11, // 10 problems + 1 case study
      problemScores: [],
      updateScore: (problemId, score) =>
        set((state) => {
          const existingScore = state.problemScores.find((s) => s.problemId === problemId);
          
          if (existingScore) {
            // Only update if the new score is higher
            if (score <= existingScore.score) {
              return state;
            }
            
            const newProblemScores = state.problemScores.map((s) =>
              s.problemId === problemId
                ? { ...s, score, completed: true, lastAttempt: new Date().toISOString() }
                : s
            );
            
            const newTotalScore = state.totalScore - existingScore.score + score;
            const completedCount = newProblemScores.filter((s) => s.completed).length;
            
            return {
              problemScores: newProblemScores,
              totalScore: newTotalScore,
              completedProblems: completedCount,
            };
          } else {
            // New problem score
            const newProblemScores = [
              ...state.problemScores,
              {
                problemId,
                score,
                completed: true,
                lastAttempt: new Date().toISOString(),
              },
            ];
            
            const newTotalScore = state.totalScore + score;
            const completedCount = newProblemScores.filter((s) => s.completed).length;
            
            return {
              problemScores: newProblemScores,
              totalScore: newTotalScore,
              completedProblems: completedCount,
            };
          }
        }),
      resetProgress: () =>
        set({
          totalScore: 0,
          completedProblems: 0,
          problemScores: [],
        }),
    }),
    {
      name: 'pandas-practice-progress', // LocalStorage key
    }
  )
);

export default useProgressStore;