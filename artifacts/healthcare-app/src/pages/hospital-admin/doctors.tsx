// Using placeholders for remaining admin pages to complete routing setup
export default function AdminDoctors() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-[80vh]">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">Doctor Management</h1>
      <p className="text-muted-foreground mb-8">Manage clinical staff credentials and access.</p>
      <div className="h-full bg-card rounded-xl border flex items-center justify-center text-muted-foreground">
        Doctors Directory
      </div>
    </div>
  )
}