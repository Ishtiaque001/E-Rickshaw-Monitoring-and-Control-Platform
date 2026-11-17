
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id?: number;
    userId?: number;
    sub?: number;
    role?: string;
  };
}

export function getAuthenticatedUserId(
  request: AuthenticatedRequest,
): number {
  const rawId =
    request.user?.id ??
    request.user?.userId ??
    request.user?.sub;

  const userId = Number(rawId);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error('Authenticated user ID is missing');
  }

  return userId;
}
