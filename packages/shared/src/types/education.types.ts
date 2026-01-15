import { ContentCategory } from '../constants/index.js';

export interface EducationalContent {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  content: string;
  excerpt: string | null;
  category: ContentCategory;
  tags: string[];
  coverImage: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  published: boolean;
  publishedAt: Date | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EducationalContentListItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string | null;
  category: ContentCategory;
  coverImage: string | null;
  publishedAt: Date | null;
}
