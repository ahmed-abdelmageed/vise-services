
import { useState, useMemo } from "react";
import { VisaApplication } from "@/types/crm";

export const useClientFilters = (customers: VisaApplication[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const searchMatch =
        customer.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.reference_id?.toLowerCase().includes(searchQuery.toLowerCase());

      const statusMatch = statusFilter
        ? customer.status === statusFilter
        : true;

      return searchMatch && statusMatch;
    });
  }, [customers, searchQuery, statusFilter]);

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredCustomers
  };
};
