import { Test, TestingModule } from '@nestjs/testing';
import { ParsersResolver } from './parsers.resolver';
import { ParsersService } from './parsers.service';

describe('ParsersResolver', () => {
  let resolver: ParsersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParsersResolver, ParsersService],
    }).compile();

    resolver = module.get<ParsersResolver>(ParsersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
