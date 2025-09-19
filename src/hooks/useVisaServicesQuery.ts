import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchVisaServices,
  createVisaService,
  updateVisaService,
  deleteVisaService,
  toggleVisaServiceStatus,
  updateVisaServiceOrder,
  VisaServiceItem,
} from "../api/visa_services";

// Query keys for React Query
export const visaServicesKeys = {
  all: ["visa-services"] as const,
  list: () => [...visaServicesKeys.all, "list"] as const,
  detail: (id: string) => [...visaServicesKeys.all, "detail", id] as const,
};

// Hook to fetch all visa services
export const useVisaServices = ({ active_only }: { active_only?: boolean }) => {
  return useQuery({
    queryKey: visaServicesKeys.list(),
    queryFn: () => fetchVisaServices(active_only),
  });
};

// Hook to create a new visa service
export const useCreateVisaService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVisaService,
    onSuccess: () => {
      // Invalidate and refetch visa services
      queryClient.invalidateQueries({ queryKey: visaServicesKeys.all });
    },
    onError: (error) => {
      console.error("Error creating visa service:", error);
    },
  });
};

// Hook to update an existing visa service
export const useUpdateVisaService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<VisaServiceItem>;
    }) => updateVisaService(id, data),
    onSuccess: (data, variables) => {
      // Update the specific item in cache
      queryClient.setQueryData(
        visaServicesKeys.list(),
        (old: VisaServiceItem[] | undefined) => {
          if (!old) return old;
          return old.map((item) =>
            item.id === variables.id ? { ...item, ...data } : item
          );
        }
      );

      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: visaServicesKeys.all });
    },
    onError: (error) => {
      console.error("Error updating visa service:", error);
    },
  });
};

// Hook to delete a visa service
export const useDeleteVisaService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVisaService,
    onSuccess: (_, deletedId) => {
      // Remove the item from cache
      queryClient.setQueryData(
        visaServicesKeys.list(),
        (old: VisaServiceItem[] | undefined) => {
          if (!old) return old;
          return old.filter((item) => item.id !== deletedId);
        }
      );

      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: visaServicesKeys.all });
    },
    onError: (error) => {
      console.error("Error deleting visa service:", error);
    },
  });
};

// Hook to toggle visa service status
export const useToggleVisaServiceStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      toggleVisaServiceStatus(id, active),
    onSuccess: (data, variables) => {
      // Update the specific item in cache
      queryClient.setQueryData(
        visaServicesKeys.list(),
        (old: VisaServiceItem[] | undefined) => {
          if (!old) return old;
          return old.map((item) =>
            item.id === variables.id
              ? { ...item, active: variables.active }
              : item
          );
        }
      );
    },
    onError: (error) => {
      console.error("Error toggling visa service status:", error);
    },
  });
};

// Hook to update visa service order
export const useUpdateVisaServiceOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateVisaServiceOrder,
    onSuccess: () => {
      // Invalidate and refetch to get updated order
      queryClient.invalidateQueries({ queryKey: visaServicesKeys.list() });
    },
    onError: (error) => {
      console.error("Error updating visa service order:", error);
    },
  });
};

// Optimistic update hook for reordering (for drag and drop)
export const useOptimisticReorder = () => {
  const queryClient = useQueryClient();

  const optimisticReorder = (newOrder: VisaServiceItem[]) => {
    queryClient.setQueryData(visaServicesKeys.list(), newOrder);
  };

  const revertOptimisticUpdate = () => {
    queryClient.invalidateQueries({ queryKey: visaServicesKeys.list() });
  };

  return { optimisticReorder, revertOptimisticUpdate };
};

// Hook for prefetching visa services (useful for preloading)
export const usePrefetchVisaServices = (active_only?: boolean) => {
  const queryClient = useQueryClient();

  const prefetchVisaServices = () => {
    queryClient.prefetchQuery({
      queryKey: visaServicesKeys.list(),
      queryFn: () => fetchVisaServices(active_only),
      staleTime: 5 * 60 * 1000,
    });
  };

  return { prefetchVisaServices };
};

// Custom hook for visa service by ID (if needed for individual service details)
export const useVisaService = (id: string, enabled = true) => {
  return useQuery({
    queryKey: visaServicesKeys.detail(id),
    queryFn: async () => {
      const services = await fetchVisaServices();
      return services?.find((service) => service.id === id);
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
};
