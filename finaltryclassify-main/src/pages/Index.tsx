import { useRef } from "react";
import Navbar from "@/components/Navbar";
import ClassifierSection from "@/components/ClassifierSection";
import DevelopersSection from "@/components/DevelopersSection";
import FloatingOrbs from "@/components/FloatingOrbs";

const Index = () => {
  const devRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (section: string) => {
    if (section === "developers" && devRef.current) {
      devRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingOrbs />
      <Navbar onNavigate={handleNavigate} />
      <ClassifierSection />
      <div ref={devRef}>
        <DevelopersSection />
      </div>
      <footer className="text-center py-6 text-sm text-muted-foreground border-t border-border">
        NewSense © 2026 — Built for classification
      </footer>
    </div>
  );
};

export default Index;
