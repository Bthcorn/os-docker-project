import { Test, TestingModule } from '@nestjs/testing';
import { BookTagsService } from './book-tags.service';

describe('BookTagsService', () => {
  let service: BookTagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookTagsService],
    }).compile();

    service = module.get<BookTagsService>(BookTagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
