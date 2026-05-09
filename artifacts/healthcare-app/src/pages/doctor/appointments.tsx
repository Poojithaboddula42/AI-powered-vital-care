import { Placeholder } from "@/App";

// Utilizing a unified placeholder for minor pages to save space and demonstrate layout completeness
// In a real hackathon, you would duplicate the patient logic adapted for doctors.
export default function DoctorAppointments() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-[80vh]">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">Schedule</h1>
      <p className="text-muted-foreground mb-8">Manage your clinical schedule.</p>
      <div className="h-full bg-card rounded-xl border flex items-center justify-center text-muted-foreground">
        Appointment Management Interface
      </div>
    </div>
  )
}
