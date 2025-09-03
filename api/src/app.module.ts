import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthorsModule } from './authors/authors.module';
import { BookTagsModule } from './book-tags/book-tags.module';

@Module({
  imports: [BooksModule, PrismaModule, AuthorsModule, BookTagsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
