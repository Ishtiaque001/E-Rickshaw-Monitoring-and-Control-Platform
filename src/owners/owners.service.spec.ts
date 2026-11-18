import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { OwnersService } from './owners.service.js';
import { Owner } from './owner.entity.js';
import { Rickshaw } from '../rickshaws/rickshaw.entity.js';

describe('OwnersService', () => {
  let service: OwnersService;

  // Mock Owner Repository
  const ownersRepositoryMock = {
    findAndCount: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
  };

  // Mock Rickshaw Repository
  const rickshawsRepositoryMock = {
    countBy: vi.fn(),
  };

  // Setup before each test
  beforeEach(async () => {
    vi.resetAllMocks();

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          OwnersService,
          {
            provide: getRepositoryToken(Owner),
            useValue: ownersRepositoryMock,
          },
          {
            provide: getRepositoryToken(Rickshaw),
            useValue: rickshawsRepositoryMock,
          },
        ],
      }).compile();

    service = module.get<OwnersService>(OwnersService);
  });

  // Test 1: Service Initialization
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test 2: Owner Pagination
  it('should return paginated owners', async () => {
    const owners = [
      {
        id: 1,
        name: 'Rahim',
      },
    ];

    ownersRepositoryMock.findAndCount.mockResolvedValue([
      owners,
      1,
    ]);

    const result = await service.findAll({
      page: 1,
      limit: 10,
    });

    expect(result.data).toEqual(owners);

    expect(result.meta).toEqual({
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    });

    expect(
      ownersRepositoryMock.findAndCount,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 10,
      }),
    );
  });

  // Test 3: Create Owner
  it('should create an owner successfully', async () => {
    const createOwnerDto = {
      name: 'Rahim Uddin',
      phone: '01712345678',
      address: 'Dhaka',
      identityDocumentReference: 'NID-12345',
    };

    const savedOwner = {
      id: 1,
      ...createOwnerDto,
      createdAt: new Date(),
    };

    ownersRepositoryMock.create.mockReturnValue(savedOwner);

    ownersRepositoryMock.save.mockResolvedValue(savedOwner);

    const result = await service.create(createOwnerDto);

    expect(
      ownersRepositoryMock.create,
    ).toHaveBeenCalledWith(createOwnerDto);

    expect(
      ownersRepositoryMock.save,
    ).toHaveBeenCalledWith(savedOwner);

    expect(result).toEqual(savedOwner);
  });
});