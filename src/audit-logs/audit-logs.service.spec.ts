import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { EntityManager, Repository } from 'typeorm';
import { AuditLogsService } from './audit-logs.service.js';
import { AuditAction, AuditLog } from './entities/audit-log.entity.js';
import { UserRole } from '../users/entities/user.entity.js';

describe('AuditLogsService', () => {
  const input = {
    actorId: '550e8400-e29b-41d4-a716-446655440000',
    actorRole: UserRole.ADMIN,
    action: AuditAction.USER_CREATED,
    targetType: 'users',
    targetId: '550e8400-e29b-41d4-a716-446655440001',
  };

  function setup(active = true) {
    const repository = {
      findAndCount: vi.fn(),
      findOneBy: vi.fn(),
    };
    const manager = {
      queryRunner: { isTransactionActive: active },
      insert: vi.fn().mockResolvedValue({}),
    };
    const service = new AuditLogsService(
      repository as unknown as Repository<AuditLog>,
    );

    return {
      service,
      repository,
      manager,
      transactionManager: manager as unknown as EntityManager,
    };
  }

  it('rejects writes outside a transaction', async () => {
    const { service, manager, transactionManager } = setup(false);

    await expect(service.record(input, transactionManager)).rejects.toThrow(
      'Audit logging requires an active transaction',
    );
    expect(manager.insert).not.toHaveBeenCalled();
  });

  it('inserts only audit fields, ignoring extra sensitive or identity fields', async () => {
    const { service, manager, transactionManager } = setup();
    const untrustedInput = {
      ...input,
      id: 'client-supplied-id',
      createdAt: new Date(0),
      password: 'must-not-be-recorded',
      passwordHash: 'must-not-be-recorded',
      access_token: 'must-not-be-recorded',
    };

    await service.record(untrustedInput, transactionManager);

    expect(manager.insert).toHaveBeenCalledWith(AuditLog, input);
  });

  it('propagates insert errors so the caller transaction can roll back', async () => {
    const { service, manager, transactionManager } = setup();
    const failure = new Error('Insert failed');
    manager.insert.mockRejectedValue(failure);

    await expect(service.record(input, transactionManager)).rejects.toBe(
      failure,
    );
  });

  it('returns paginated logs with stable ordering', async () => {
    const { service, repository } = setup();
    const logs = [{ ...input, id: 'log-id' }];
    repository.findAndCount.mockResolvedValue([logs, 21]);

    await expect(service.findAll(2, 10)).resolves.toEqual({
      data: logs,
      meta: { total: 21, page: 2, limit: 10, totalPages: 3 },
    });
    expect(repository.findAndCount).toHaveBeenCalledWith({
      skip: 10,
      take: 10,
      order: { createdAt: 'DESC', id: 'DESC' },
    });
  });

  it('rejects excessive page sizes before reading the database', async () => {
    const { service, repository } = setup();

    await expect(service.findAll(1, 101)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(repository.findAndCount).not.toHaveBeenCalled();
  });

  it('returns 404 for a missing log', async () => {
    const { service, repository } = setup();
    repository.findOneBy.mockResolvedValue(null);

    await expect(service.findOne(input.targetId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
