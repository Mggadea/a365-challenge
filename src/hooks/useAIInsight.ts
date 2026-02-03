import { useMutation } from '@tanstack/react-query';
import { generateInsight, type InsightParams } from '../API/aiService';

export const useAIInsight = () => {
  return useMutation({
    mutationFn: (params: InsightParams) => generateInsight(params),
  });
};
