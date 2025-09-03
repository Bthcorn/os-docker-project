import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // create 10 books
  const alice = await prisma.author.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Alice',
      bio: 'Alice is a writer',
      books: {
        create: {
          title: 'Book 1',
          isbn: '1234567890',
          publishedYear: 2020,
          summary: 'Book 1 is a book about Alice',
          BookTag: { create: { tag: { create: { name: 'Tag 1' } } } },
        },
      },
    },
  });

  const bob = await prisma.author.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Bob',
      bio: 'Bob is a writer',
      books: {
        create: {
          title: 'Book 2',
          isbn: '1234567891',
          publishedYear: 2021,
          summary: 'Book 2 is a book about Bob',
          BookTag: { create: { tag: { create: { name: 'Tag 2' } } } },
        },
      },
    },
  });

  const charlie = await prisma.author.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Charlie',
      bio: 'Charlie is a writer',
      books: {
        create: {
          title: 'Book 3',
          isbn: '1234567892',
          publishedYear: 2022,
          summary: 'Book 3 is a book about Charlie',
          BookTag: { create: { tag: { create: { name: 'Tag 3' } } } },
        },
      },
    },
  });

  const david = await prisma.author.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: 'David',
      bio: 'David is a writer',
      books: {
        create: {
          title: 'Book 4',
          isbn: '1234567893',
          publishedYear: 2023,
          summary: 'Book 4 is a book about David',
          BookTag: { create: { tag: { create: { name: 'Tag 4' } } } },
        },
      },
    },
  });

  const eve = await prisma.author.upsert({
    where: { id: 5 },
    update: {},
    create: {
      name: 'Eve',
      bio: 'Eve is a writer',
      books: {
        create: {
          title: 'Book 5',
          isbn: '1234567894',
          publishedYear: 2024,
          summary: 'Book 5 is a book about Eve',
          BookTag: { create: { tag: { create: { name: 'Tag 5' } } } },
        },
      },
    },
  });

  console.log(alice, bob, charlie, david, eve);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
