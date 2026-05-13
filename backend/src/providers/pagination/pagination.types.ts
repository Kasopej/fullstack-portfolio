export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
    total: number;
  };
  links: {
    firstPage: string;
    lastPage: string;
    currentPage: string;
    previouspage: string;
    nextPage: string;
  };
}
