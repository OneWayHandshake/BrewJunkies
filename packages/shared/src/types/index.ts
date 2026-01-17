export * from './user.types.js';
export * from './coffee.types.js';
export * from './review.types.js';
export * from './ai-analysis.types.js';
export * from './education.types.js';
export * from './passport.types.js';
export * from './brew.types.js';
export * from './grinder.types.js';

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface PaginatedResponse<T> {
  status: 'success';
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
