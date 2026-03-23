import { Newspaper } from "lucide-react";

const Navbar = ({ onNavigate }: { onNavigate: (section: string) => void }) => {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <span className="text-xl font-display font-bold text-foreground">NewSense</span>
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate("developers")}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Developers
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
