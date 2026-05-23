export interface PaginatedResponse<T = unknown> {
  data: T[]
  meta: {
    itemsPerPage: number
    currentPage: number
    totalPages: number
    total: number
  }
  links: {
    firstPage: string
    lastPage: string
    currentPage: string
    previouspage: string
    nextPage: string
  }
}

export interface PaginationQuery {
  page: string
  limit: string
}

export type DateString = string
export type ms = number
