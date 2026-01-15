import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/error.middleware.js';

export const educationController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { category } = req.query;

      const where: Record<string, unknown> = { published: true };
      if (category) {
        where.category = category as string;
      }

      const content = await prisma.educationalContent.findMany({
        where,
        orderBy: [{ category: 'asc' }, { order: 'asc' }],
        select: {
          id: true,
          slug: true,
          title: true,
          category: true,
          excerpt: true,
        },
      });

      // Group by category
      const grouped = content.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {} as Record<string, typeof content>);

      res.json({
        status: 'success',
        data: grouped,
      });
    } catch (error) {
      next(error);
    }
  },

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const content = await prisma.educationalContent.findUnique({
        where: { slug: req.params.slug },
      });

      if (!content || !content.published) {
        throw new AppError(404, 'Article not found');
      }

      res.json({
        status: 'success',
        data: content,
      });
    } catch (error) {
      next(error);
    }
  },

  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await prisma.educationalContent.groupBy({
        by: ['category'],
        where: { published: true },
        _count: { id: true },
      });

      res.json({
        status: 'success',
        data: categories.map((c) => ({
          name: c.category,
          count: c._count.id,
        })),
      });
    } catch (error) {
      next(error);
    }
  },
};
