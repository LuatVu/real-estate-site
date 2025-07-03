import { PaginationData } from "../types/pagination";

export function calculatePagination(
  totalItems: number,
  itemsPerPage: number,
  currentPage: number = 1
): PaginationData {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const safePage = Math.max(1, Math.min(currentPage, totalPages));

  return {
    currentPage: safePage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage: safePage < totalPages,
    hasPreviousPage: safePage > 1
  };
}

export function getOffset(page: number, itemsPerPage: number): number {
  return (page - 1) * itemsPerPage;
}