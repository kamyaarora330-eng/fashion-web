import prisma from '../config/database.js';

export const listCategories = async (req, res, next) => {
  try {
    const { gender } = req.query;

    const where = {
      isActive: true,
    };

    if (gender && ['MEN', 'WOMEN', 'UNISEX'].includes(gender.toUpperCase())) {
      where.gender = { in: [gender.toUpperCase(), 'UNISEX'] };
    }

    const categories = await prisma.category.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: { products: { where: { status: 'ACTIVE' } } },
        },
      },
    });

    res.json({
      success: true,
      data: {
        categories: categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description,
          image: c.image,
          gender: c.gender,
          productCount: c._count.products,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: { where: { status: 'ACTIVE' } } },
        },
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    res.json({
      success: true,
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

