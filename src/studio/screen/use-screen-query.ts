import { useQuery } from '@tanstack/react-query';

import { loadScreen } from '@/studio/screen/service/screen-service';

export const useScreenQuery = (screenId: string) =>
  useQuery({
    queryFn: () => loadScreen(screenId),
    queryKey: ['screen', screenId],
    staleTime: 30_000,
  });
