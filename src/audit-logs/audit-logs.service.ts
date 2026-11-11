import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { EntityManager } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity.js';

export type CreateAuditLogInput = Pick<
  AuditLog,
  'actorId' | 'actorRole' | 'action' | 'targetType' | 'targetId'
>;

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogsRepository: Repository<AuditLog>,
  ) {}

  // Use the same transaction manager as the account change.
  // Actor details must come from the authenticated user, not the request body.
  async record(
    input: CreateAuditLogInput,
    manager: EntityManager,
  ): Promise<void> {
    if (!manager.queryRunner?.isTransactionActive) {
      throw new Error('Audit logging requires an active transaction');
    }

    // Explicit fields prevent request data, credentials, IDs, or timestamps
    // from being copied into the log accidentally. insert never updates a log.
    await manager.insert(AuditLog, {
      actorId: input.actorId,
      actorRole: input.actorRole,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
    });
  }

  async findAll(page = 1, limit = 10) {
    if (
      !Number.isSafeInteger(page) ||
      !Number.isSafeInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 100
    ) {
      throw new BadRequestException(
        'Page must be a positive integer; limit must be between 1 and 100',
      );
    }

    const skip = (page - 1) * limit;

    if (!Number.isSafeInteger(skip)) {
      throw new BadRequestException('Page is too large');
    }

    const [logs, total] = await this.auditLogsRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC', id: 'DESC' },
    });

    return {
      data: logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<AuditLog> {
    const log = await this.auditLogsRepository.findOneBy({ id });

    if (!log) {
      throw new NotFoundException('Audit log not found');
    }

    return log;
  }
}
