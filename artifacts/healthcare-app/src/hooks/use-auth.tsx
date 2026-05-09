import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useLocation } from "wouter";
import { User, LoginInput, RegisterInput, RegisterInputRole } from "@workspace/api-client-react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("healthcare_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginInput) => {
    // Mock login logic
    let mockUser: User | null = null;
    
    if (data.email === "patient@demo.com") {
      mockUser = { id: 1, name: "Demo Patient", email: data.email, role: "patient", phone: "555-0101" };
    } else if (data.email === "doctor@demo.com") {
      mockUser = { id: 2, name: "Dr. Smith", email: data.email, role: "doctor", phone: "555-0102" };
    } else if (data.email === "admin@demo.com") {
      mockUser = { id: 3, name: "Admin", email: data.email, role: "hospital_admin", phone: "555-0103" };
    } else {
      // Allow any login for testing
      mockUser = { id: Math.floor(Math.random() * 1000), name: data.email.split('@')[0], email: data.email, role: "patient" };
    }

    localStorage.setItem("healthcare_user", JSON.stringify(mockUser));
    setUser(mockUser);
    
    // Redirect based on role
    if (mockUser.role === "patient") setLocation("/patient");
    else if (mockUser.role === "doctor") setLocation("/doctor");
    else if (mockUser.role === "hospital_admin") setLocation("/hospital-admin");
    else setLocation("/");
  };

  const register = async (data: RegisterInput) => {
    const mockUser: User = {
      id: Math.floor(Math.random() * 1000),
      name: data.name,
      email: data.email,
      role: data.role as any,
      phone: data.phone,
      caretakerPhone: data.caretakerPhone,
    };
    localStorage.setItem("healthcare_user", JSON.stringify(mockUser));
    setUser(mockUser);
    
    if (mockUser.role === "patient") setLocation("/patient");
    else if (mockUser.role === "doctor") setLocation("/doctor");
    else if (mockUser.role === "hospital_admin") setLocation("/hospital-admin");
    else setLocation("/");
  };

  const logout = () => {
    localStorage.removeItem("healthcare_user");
    setUser(null);
    setLocation("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
