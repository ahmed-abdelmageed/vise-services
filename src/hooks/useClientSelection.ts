
import { useState } from "react";

export const useClientSelection = () => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [bulkActionsOpen, setBulkActionsOpen] = useState(false);

  const toggleItemSelection = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
    
    // Open bulk actions menu if items are selected
    if (newSelected.size > 0) {
      setBulkActionsOpen(true);
    } else {
      setBulkActionsOpen(false);
    }
  };
  
  const selectAll = (ids: string[]) => {
    const newSelected = new Set(ids);
    setSelectedItems(newSelected);
    setBulkActionsOpen(ids.length > 0);
  };
  
  const clearSelections = () => {
    setSelectedItems(new Set());
    setBulkActionsOpen(false);
  };

  return {
    selectedItems,
    bulkActionsOpen, 
    setBulkActionsOpen,
    toggleItemSelection,
    selectAll,
    clearSelections
  };
};
