import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Phone, ExternalLink } from "lucide-react";
import nikethanImg from "@/assets/nikethan.jpeg";
import ankithaImg from "@/assets/ankitha.jpeg";
import akhilImg from "@/assets/akhil.jpeg";

interface Developer {
  name: string;
  image: string;
  linkedin: string;
  github: string;
  email: string;
  phone: string;
}

const developers: Developer[] = [
  {
    name: "Ketana Sai Nikethan",
    image: nikethanImg,
    linkedin: "https://www.linkedin.com/in/nikethan-ketana-050522321",
    github: "https://github.com/Nikethan598",
    email: "ketananikethan@gmail.com",
    phone: "8977000339",
  },
  {
    name: "Manapadu Ankitha",
    image: ankithaImg,
    linkedin: "https://www.linkedin.com/in/manapadu-ankitha-31831b290",
    github: "https://github.com/ankitha587",
    email: "ankithamanapadu@gmail.com",
    phone: "8019759581",
  },
  {
    name: "Mudam Akhil",
    image: akhilImg,
    linkedin: "https://www.linkedin.com/in/akhil-mudam-aa2ab02b9?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    github: "https://github.com/akhilmudam333",
    email: "akhilmudam88@gmail.com",
    phone: "8317530360",
  },
];

const DeveloperCard = ({ dev, index }: { dev: Developer; index: number }) => {
  const [flipped, setFlipped] = useState(false);
  const [hoverRotate, setHoverRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (flipped) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientY - rect.top - rect.height / 2) / 12;
    const y = -(e.clientX - rect.left - rect.width / 2) / 12;
    setHoverRotate({ x, y });
  };

  const handleMouseLeave = () => setHoverRotate({ x: 0, y: 0 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: 15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.7, delay: index * 0.2, type: "spring", stiffness: 80 }}
      viewport={{ once: true }}
      className="flashcard-container w-full max-w-xs mx-auto cursor-pointer group"
      style={{ perspective: 1200 }}
      onClick={() => setFlipped(!flipped)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative w-full h-[420px]"
        style={{ transformStyle: "preserve-3d" }}
        animate={{
          rotateY: flipped ? 180 : hoverRotate.y,
          rotateX: flipped ? 0 : hoverRotate.x,
        }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 15 }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-6 border border-border/50"
          style={{
            backfaceVisibility: "hidden",
            background: "var(--gradient-card)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {/* Glow ring behind avatar */}
          <motion.div
            className="absolute w-40 h-40 rounded-full blur-2xl top-1/4 -translate-y-1/2"
            style={{ background: "hsl(var(--primary) / 0.15)" }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/30 mb-4 shadow-lg z-10">
            <img src={dev.image} alt={dev.name} className="w-full h-full object-cover" />
          </div>
          <h3 className="text-lg font-display font-bold text-foreground text-center z-10">{dev.name}</h3>
          <p className="text-sm text-muted-foreground mt-1 z-10">Full Stack Developer</p>
          <motion.p
            className="text-xs text-primary mt-4 font-medium z-10"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Tap to reveal contact ↻
          </motion.p>

          {/* Floating sparkles */}
          {[0, 1, 2].map((s) => (
            <motion.div
              key={s}
              className="absolute w-1.5 h-1.5 rounded-full bg-primary/40"
              style={{ left: `${25 + s * 25}%`, top: `${70 + s * 8}%` }}
              animate={{ y: [0, -15, 0], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: s * 0.6 }}
            />
          ))}
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-6 gap-3 border border-border/50"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "var(--gradient-card)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <h3 className="text-lg font-display font-bold text-foreground mb-2">{dev.name}</h3>

          {[
            { href: dev.linkedin, icon: Linkedin, label: "LinkedIn", external: true },
            { href: dev.github, icon: Github, label: "GitHub", external: true },
            { href: `mailto:${dev.email}`, icon: Mail, label: dev.email, external: false },
            { href: `tel:${dev.phone}`, icon: Phone, label: dev.phone, external: false },
          ].map((item, i) => (
            <motion.a
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, x: -20 }}
              animate={flipped ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.3 }}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-full justify-center"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.external && <ExternalLink className="h-3 w-3" />}
            </motion.a>
          ))}

          <motion.p
            className="text-xs text-primary mt-2 font-medium"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Tap to flip back ↻
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const DevelopersSection = () => {
  return (
    <section className="py-20 px-6 relative">
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-display font-bold text-foreground">Meet the Developers</h2>
          <p className="text-muted-foreground mt-2">The team behind NewSense</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {developers.map((dev, i) => (
            <DeveloperCard key={dev.name} dev={dev} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DevelopersSection;
