import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FilterBookDto } from './dto/filter-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Get('filter')
  @ApiOperation({ summary: 'Filter books by author, title, or published year' })
  @ApiQuery({
    name: 'authorName',
    required: false,
    type: String,
    description: 'Filter by author name',
  })
  @ApiQuery({
    name: 'title',
    required: false,
    type: String,
    description: 'Filter by book title (partial match, case-insensitive)',
  })
  @ApiQuery({
    name: 'publishedYear',
    required: false,
    type: Number,
    description: 'Filter by published year',
  })
  @ApiResponse({
    status: 200,
    description: 'Books matching the filter criteria',
  })
  filter(@Query() filterDto: FilterBookDto) {
    return this.booksService.filter(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}
