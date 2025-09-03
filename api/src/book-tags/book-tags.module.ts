import { Module } from '@nestjs/common';
import { BookTagsService } from './book-tags.service';
import { BookTagsController } from './book-tags.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BookTagsController],
  providers: [BookTagsService],
})
export class BookTagsModule {}
