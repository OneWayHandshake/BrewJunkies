import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const articles = await prisma.educationalContent.findMany({
    where: { category: 'LOCATIONS' },
    select: { slug: true, title: true },
    orderBy: { order: 'asc' },
    take: 50,
  });

  articles.forEach((a) => {
    console.log(`'${a.slug}': '...', // ${a.title}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
