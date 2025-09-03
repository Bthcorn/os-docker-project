import { Test, TestingModule } from '@nestjs/testing';
import { BookTagsController } from './book-tags.controller';
import { BookTagsService } from './book-tags.service';

describe('BookTagsController', () => {
  let controller: BookTagsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookTagsController],
      providers: [BookTagsService],
    }).compile();

    controller = module.get<BookTagsController>(BookTagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
