import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFooterInfo, updateFooterItem, createFooterItem, FooterItem } from "../api/footer";

// Query hook for fetching all footer items
export const useFooterInfo = () => {
  return useQuery<FooterItem[]>({
    queryKey: ["footer-info"],
    queryFn: fetchFooterInfo,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

// Mutation hook for creating a footer item
export const useCreateFooterItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFooterItem,
    onSuccess: () => {
      // Invalidate and refetch footer info
      queryClient.invalidateQueries({ queryKey: ["footer-info"] });
    },
  });
};

// Mutation hook for updating a footer item
export const useUpdateFooterItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FooterItem> }) =>
      updateFooterItem(id, data),
    onSuccess: (data) => {
      // Invalidate footer list and update specific item cache
      queryClient.invalidateQueries({ queryKey: ["footer-info"] });
      queryClient.setQueryData(["footer-item", data.id], data);
    },
  });
};

export default useFooterInfo;
