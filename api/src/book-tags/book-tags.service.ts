import { Injectable } from '@nestjs/common';
import { CreateBookTagDto } from './dto/create-book-tag.dto';
import { UpdateBookTagDto } from './dto/update-book-tag.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookTagsService {
  constructor(private readonly prisma: PrismaService) {}
  create(createBookTagDto: CreateBookTagDto) {
    return this.prisma.tag.create({
      data: createBookTagDto,
    });
  }

  findAll() {
    return this.prisma.tag.findMany();
  }

  findOne(id: number) {
    return this.prisma.tag.findUnique({
      where: { id },
    });
  }

  update(id: number, updateBookTagDto: UpdateBookTagDto) {
    return this.prisma.tag.update({
      where: { id },
      data: updateBookTagDto,
    });
  }

  remove(id: number) {
    return this.prisma.tag.delete({
      where: { id },
    });
  }
}
