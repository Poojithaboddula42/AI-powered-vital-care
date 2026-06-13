import type { LatestVitals, VitalRecord } from "@workspace/api-client-react";
import type { AiVitalMeasurement } from "@workspace/api-client-react";

export function mapVitalToAiMeasurement(
  vital: LatestVitals | VitalRecord,
): AiVitalMeasurement {
  return {
    heartRate: vital.heartRate,
    systolicBp: vital.systolicBp,
    diastolicBp: vital.diastolicBp,
    spo2: vital.spo2,
    glucose: vital.glucose,
    temperature: vital.temperature,
    status: "status" in vital ? vital.status : undefined,
    recordedAt:
      "createdAt" in vital && vital.createdAt
        ? new Date(vital.createdAt).toISOString()
        : undefined,
  };
}
