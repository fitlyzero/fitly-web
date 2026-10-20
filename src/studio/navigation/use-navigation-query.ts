import { useQuery } from '@tanstack/react-query';

import { loadNavigation } from '@/studio/navigation/service/navigation-service';

export const useNavigationQuery = () =>
  useQuery({ queryFn: loadNavigation, queryKey: ['navigation'], staleTime: 60_000 });
