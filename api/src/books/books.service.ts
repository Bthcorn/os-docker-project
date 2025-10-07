import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FilterBookDto } from './dto/filter-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Book } from './entities/book.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createBookDto: CreateBookDto) {
    const { tags, ...bookData } = createBookDto;

    const book = await this.prisma.book.create({
      data: bookData,
    });

    if (tags && book) {
      await this.prisma.bookTag.createMany({
        data: tags.map((tag) => ({ bookId: book.id, tagId: tag })),
      });
    }

    return book;
  }

  async findAll() {
    return await this.prisma.book.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        BookTag: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.book.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        BookTag: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async filter(filterDto: FilterBookDto) {
    const whereConditions: Prisma.BookWhereInput = {};

    // Only add conditions if parameters are provided
    if (filterDto.authorName !== undefined && filterDto.authorName !== null) {
      whereConditions.author = {
        name: {
          contains: filterDto.authorName.trim(),
          mode: 'insensitive', // Case-insensitive search
        },
      };
    }

    if (
      filterDto.title !== undefined &&
      filterDto.title !== null &&
      filterDto.title.trim() !== ''
    ) {
      whereConditions.title = {
        contains: filterDto.title.trim(),
        mode: 'insensitive', // Case-insensitive search
      };
    }

    if (
      filterDto.publishedYear !== undefined &&
      filterDto.publishedYear !== null
    ) {
      whereConditions.publishedYear = filterDto.publishedYear;
    }

    return await this.prisma.book.findMany({
      where: whereConditions,
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        BookTag: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: [{ publishedYear: 'desc' }, { title: 'asc' }],
    });
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const { tags, ...bookData } = updateBookDto;
    let book: Book | null = null;
    // transaction
    await this.prisma
      .$transaction(async (tx) => {
        await tx.bookTag.deleteMany({
          where: { bookId: id },
        });

        if (tags) {
          await tx.bookTag.createMany({
            data: tags.map((tag) => ({ bookId: id, tagId: tag })),
          });
        }

        book = await tx.book.update({
          where: { id },
          data: bookData,
        });
      })
      .catch((error) => {
        throw new Error(error);
      })
      .finally(() => {
        return book;
      });

    return book;
  }

  async remove(id: number) {
    // Use a transaction to ensure data consistency
    await this.prisma.$transaction(async (tx) => {
      // First, delete all BookTag records associated with this book
      await tx.bookTag.deleteMany({
        where: {
          bookId: id,
        },
      });

      // Then delete the book itself
      await tx.book.delete({
        where: { id },
      });
    });

    return { message: 'Book deleted successfully' };
  }
}
