import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "te" | "hi";

export const translations = {
  en: {
    dashboard: "Dashboard",
    recordVitals: "Record Vitals",
    history: "History",
    analytics: "Analytics",
    aiInsights: "AI Insights",
    aiAssistant: "AI Assistant",
    alerts: "Alerts",
    appointments: "Appointments",
    hospitals: "Hospitals",
    ambulance: "Ambulance",
    bloodDonation: "Blood Donation",
    govtSchemes: "Govt Schemes",
    settings: "Settings",
    signOut: "Sign out",
    patients: "Patients",
    doctors: "Doctors",
    bedManagement: "Bed Management",
    welcomeBack: "Welcome back",
    healthSummary: "Here is your health summary for today.",
    overallStatus: "Overall Status",
    heartRate: "Heart Rate",
    bloodPressure: "Blood Pressure",
    temperature: "Temperature",
    recentActivity: "Recent Activity",
    recentAlerts: "Recent Alerts",
    getReport: "Get Report",
    bookAppointment: "Book Appointment",
    nearbyDoctors: "Nearby Doctors",
    emergency: "Emergency",
    emergencyAlert: "Emergency Alert",
    emergencyAlertSent: "Emergency alert sent to emergency contact number.",
    hospitalsNotified: "Nearby hospitals have been notified.",
    language: "Language",
    english: "English",
    telugu: "తెలుగు",
    hindi: "हिंदी",
  },
  te: {
    dashboard: "డాష్‌బోర్డ్",
    recordVitals: "వైటల్స్ నమోదు",
    history: "చరిత్ర",
    analytics: "విశ్లేషణలు",
    aiInsights: "AI అంతర్దృష్టులు",
    aiAssistant: "AI సహాయకుడు",
    alerts: "హెచ్చరికలు",
    appointments: "అపాయింట్‌మెంట్లు",
    hospitals: "ఆసుపత్రులు",
    ambulance: "అంబులెన్స్",
    bloodDonation: "రక్తదానం",
    govtSchemes: "ప్రభుత్వ పథకాలు",
    settings: "సెట్టింగులు",
    signOut: "సైన్ అవుట్",
    patients: "రోగులు",
    doctors: "వైద్యులు",
    bedManagement: "బెడ్ నిర్వహణ",
    welcomeBack: "స్వాగతం",
    healthSummary: "ఈరోజు మీ ఆరోగ్య సారాంశం ఇక్కడ ఉంది.",
    overallStatus: "మొత్తం స్థితి",
    heartRate: "హృదయ స్పందన రేటు",
    bloodPressure: "రక్తపోటు",
    temperature: "శరీర ఉష్ణోగ్రత",
    recentActivity: "ఇటీవలి కార్యకలాపాలు",
    recentAlerts: "ఇటీవలి హెచ్చరికలు",
    getReport: "నివేదిక పొందండి",
    bookAppointment: "అపాయింట్‌మెంట్ బుక్ చేయండి",
    nearbyDoctors: "సమీప వైద్యులు",
    emergency: "అత్యవసర",
    emergencyAlert: "అత్యవసర హెచ్చరిక",
    emergencyAlertSent: "అత్యవసర సంప్రదింపు నంబర్‌కు హెచ్చరిక పంపబడింది.",
    hospitalsNotified: "సమీప ఆసుపత్రులకు తెలియజేయబడింది.",
    language: "భాష",
    english: "English",
    telugu: "తెలుగు",
    hindi: "हिंदी",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    recordVitals: "वाइटल्स दर्ज करें",
    history: "इतिहास",
    analytics: "विश्लेषण",
    aiInsights: "AI अंतर्दृष्टि",
    aiAssistant: "AI सहायक",
    alerts: "अलर्ट",
    appointments: "अपॉइंटमेंट",
    hospitals: "अस्पताल",
    ambulance: "एम्बुलेंस",
    bloodDonation: "रक्तदान",
    govtSchemes: "सरकारी योजनाएं",
    settings: "सेटिंग्स",
    signOut: "साइन आउट",
    patients: "मरीज़",
    doctors: "डॉक्टर",
    bedManagement: "बेड प्रबंधन",
    welcomeBack: "वापसी पर स्वागत है",
    healthSummary: "आज का आपका स्वास्थ्य सारांश यहां है।",
    overallStatus: "समग्र स्थिति",
    heartRate: "हृदय गति",
    bloodPressure: "रक्तचाप",
    temperature: "तापमान",
    recentActivity: "हाल की गतिविधि",
    recentAlerts: "हाल के अलर्ट",
    getReport: "रिपोर्ट प्राप्त करें",
    bookAppointment: "अपॉइंटमेंट बुक करें",
    nearbyDoctors: "पास के डॉक्टर",
    emergency: "आपातकाल",
    emergencyAlert: "आपातकालीन अलर्ट",
    emergencyAlertSent: "आपातकालीन संपर्क नंबर पर अलर्ट भेजा गया।",
    hospitalsNotified: "पास के अस्पतालों को सूचित किया गया।",
    language: "भाषा",
    english: "English",
    telugu: "తెలుగు",
    hindi: "हिंदी",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem("vitalcare_language") as Language) || "en";
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("vitalcare_language", lang);
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] as string;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
