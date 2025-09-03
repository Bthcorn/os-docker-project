import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookTagsService } from './book-tags.service';
import { CreateBookTagDto } from './dto/create-book-tag.dto';
import { UpdateBookTagDto } from './dto/update-book-tag.dto';

@Controller('book-tags')
export class BookTagsController {
  constructor(private readonly bookTagsService: BookTagsService) {}

  @Post()
  create(@Body() createBookTagDto: CreateBookTagDto) {
    return this.bookTagsService.create(createBookTagDto);
  }

  @Get()
  findAll() {
    return this.bookTagsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookTagsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookTagDto: UpdateBookTagDto) {
    return this.bookTagsService.update(+id, updateBookTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookTagsService.remove(+id);
  }
}
