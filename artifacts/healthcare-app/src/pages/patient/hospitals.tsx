import { useGetHospitals } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Building2, Bed, ActivitySquare, Star } from "lucide-react";

export default function HospitalsList() {
  const { data: hospitals, isLoading } = useGetHospitals();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Hospitals & Clinics</h1>
        <p className="text-muted-foreground mt-1">Find healthcare facilities in our network.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-xl" />)
        ) : hospitals?.length ? (
          hospitals.map((hospital) => (
            <Card key={hospital.id} className="flex flex-col hover-elevate transition-all overflow-hidden border-t-4 border-t-primary">
              <CardHeader className="pb-4 bg-muted/20">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <CardTitle className="text-xl leading-tight mb-1">{hospital.name}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
                      <span className="font-medium text-foreground">{hospital.rating}</span>
                      <span className="mx-2">•</span>
                      <span>{hospital.distance} away</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex gap-2 items-start text-sm">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{hospital.address}</span>
                  </div>
                  <div className="flex gap-2 items-center text-sm">
                    <Phone className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-muted-foreground">{hospital.phone}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                    <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900 flex flex-col">
                      <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 mb-1">
                        <Bed className="h-4 w-4" />
                        <span className="text-xs font-semibold">BEDS</span>
                      </div>
                      <span className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">{hospital.bedsAvailable}</span>
                    </div>
                    <div className="bg-red-50 dark:bg-red-950/30 p-3 rounded-lg border border-red-100 dark:border-red-900 flex flex-col">
                      <div className="flex items-center gap-1.5 text-red-700 dark:text-red-400 mb-1">
                        <ActivitySquare className="h-4 w-4" />
                        <span className="text-xs font-semibold">ICU</span>
                      </div>
                      <span className="text-2xl font-bold text-red-800 dark:text-red-300">{hospital.icuAvailable}</span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Specialties</div>
                    <div className="flex flex-wrap gap-1.5">
                      {hospital.specialties.map(spec => (
                        <Badge key={spec} variant="secondary" className="font-normal bg-secondary hover:bg-secondary">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-6" variant="outline">View Details</Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-16 bg-card rounded-xl border border-dashed text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium text-foreground">No hospitals found</p>
            <p>Could not load hospital network data.</p>
          </div>
        )}
      </div>
    </div>
  );
}
