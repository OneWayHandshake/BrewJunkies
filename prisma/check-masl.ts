import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const article = await prisma.educationalContent.findUnique({
    where: { slug: 'understanding-masl-altitude' },
    select: { slug: true, title: true, category: true }
  });

  console.log('Current MASL article:', article);

  if (article && article.category !== 'SCIENCE') {
    console.log('Updating category to SCIENCE...');
    await prisma.educationalContent.update({
      where: { slug: 'understanding-masl-altitude' },
      data: { category: 'SCIENCE' }
    });
    console.log('Updated successfully!');
  } else if (article?.category === 'SCIENCE') {
    console.log('Category is already SCIENCE');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
