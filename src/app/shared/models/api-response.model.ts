export interface PaginationMetadata {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination: PaginationMetadata | null;
}
