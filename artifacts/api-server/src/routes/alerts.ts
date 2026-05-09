import { Router, type IRouter } from "express";
import { db, alertsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../lib/auth";
import {
  SendAlertBody,
  GetAlertsQueryParams,
  MarkAlertReadParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/alerts", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const params = GetAlertsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const { userId, status } = params.data;
  const targetUserId = userId ?? req.user!.id;

  let rows = await db.select().from(alertsTable)
    .where(eq(alertsTable.userId, targetUserId))
    .orderBy(desc(alertsTable.createdAt));

  if (status === "unread") {
    rows = rows.filter(a => !a.isRead);
  } else if (status === "read") {
    rows = rows.filter(a => a.isRead);
  }

  res.json(rows);
});

router.post("/alerts", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const parsed = SendAlertBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [alert] = await db.insert(alertsTable).values({
    userId: parsed.data.userId,
    type: parsed.data.type,
    severity: parsed.data.severity,
    message: parsed.data.message,
    vitals: parsed.data.vitals ?? null,
    isRead: false,
    smsSent: false,
  }).returning();
  res.status(201).json(alert);
});

router.patch("/alerts/:alertId/read", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const raw = Array.isArray(req.params.alertId) ? req.params.alertId[0] : req.params.alertId;
  const alertId = parseInt(raw, 10);
  if (isNaN(alertId)) {
    res.status(400).json({ error: "Invalid alert ID" });
    return;
  }

  const [updated] = await db.update(alertsTable)
    .set({ isRead: true })
    .where(and(eq(alertsTable.id, alertId), eq(alertsTable.userId, req.user!.id)))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Alert not found" });
    return;
  }
  res.json(updated);
});

export default router;
