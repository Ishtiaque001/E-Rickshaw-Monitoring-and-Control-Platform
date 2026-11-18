import { Test, TestingModule } from '@nestjs/testing';
import { RickshawsService } from './rickshaws.service.js';

describe('RickshawsService', () => {
  let service: RickshawsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RickshawsService],
    }).compile();

    service = module.get<RickshawsService>(RickshawsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
