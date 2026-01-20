import { db } from "@/lib/db";

export type AuditAction =
  | "USER_CREATED"
  | "USER_UPDATED"
  | "USER_DELETED"
  | "ROLE_ASSIGNED"
  | "ROLE_REMOVED"
  | "APPLICATION_STATUS_CHANGED"
  | "ENROLLMENT_CREATED"
  | "ENROLLMENT_ACTIVATED"
  | "ENROLLMENT_STATUS_CHANGED"
  | "CLASS_CREATED"
  | "CLASS_UPDATED"
  | "STAFF_CREATED";

export type AuditEntityType =
  | "USER"
  | "USER_ROLE"
  | "APPLICATION"
  | "ENROLLMENT"
  | "CLASS"
  | "PARENT_PROFILE"
  | "TEACHER_PROFILE";

/**
 * Create an audit log entry
 * @param params - Audit log parameters
 */
export async function createAuditLog(params: {
  actorUserId: string;
  actionType: AuditAction;
  entityType: AuditEntityType;
  entityId?: string;
  before?: any;
  after?: any;
}) {
  const { actorUserId, actionType, entityType, entityId, before, after } = params;

  return db.auditLog.create({
    data: {
      actorUserId,
      actionType,
      entityType,
      entityId,
      beforeJson: before ? JSON.stringify(before) : null,
      afterJson: after ? JSON.stringify(after) : null,
    },
  });
}

/**
 * Get audit logs for a specific entity
 */
export async function getAuditLogsForEntity(entityType: AuditEntityType, entityId: string) {
  return db.auditLog.findMany({
    where: {
      entityType,
      entityId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      actor: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });
}

/**
 * Get audit logs by action type
 */
export async function getAuditLogsByAction(actionType: AuditAction, limit = 100) {
  return db.auditLog.findMany({
    where: {
      actionType,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    include: {
      actor: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });
}

/**
 * Get recent audit logs
 */
export async function getRecentAuditLogs(limit = 50) {
  return db.auditLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    include: {
      actor: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });
}
