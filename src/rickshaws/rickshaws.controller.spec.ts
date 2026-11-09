import { Test, TestingModule } from '@nestjs/testing';
import { RickshawsController } from './rickshaws.controller.js';

describe('RickshawsController', () => {
  let controller: RickshawsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RickshawsController],
    }).compile();

    controller = module.get<RickshawsController>(RickshawsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
