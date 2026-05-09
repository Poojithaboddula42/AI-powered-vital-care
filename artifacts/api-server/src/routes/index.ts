import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import vitalsRouter from "./vitals";
import alertsRouter from "./alerts";
import appointmentsRouter from "./appointments";
import analyticsRouter from "./analytics";
import patientsRouter from "./patients";
import hospitalsRouter from "./hospitals";
import aiRouter from "./ai";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(vitalsRouter);
router.use(alertsRouter);
router.use(appointmentsRouter);
router.use(analyticsRouter);
router.use(patientsRouter);
router.use(hospitalsRouter);
router.use(aiRouter);

export default router;
