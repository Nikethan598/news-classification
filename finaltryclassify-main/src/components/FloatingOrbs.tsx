import { motion } from "framer-motion";

const orbs = [
  { size: 200, x: "10%", y: "15%", color: "hsl(var(--primary) / 0.15)", duration: 18, delay: 0 },
  { size: 150, x: "80%", y: "25%", color: "hsl(var(--accent) / 0.12)", duration: 22, delay: 2 },
  { size: 120, x: "50%", y: "60%", color: "hsl(var(--primary) / 0.1)", duration: 20, delay: 4 },
  { size: 180, x: "20%", y: "75%", color: "hsl(var(--accent) / 0.1)", duration: 25, delay: 1 },
  { size: 100, x: "70%", y: "80%", color: "hsl(var(--primary) / 0.12)", duration: 16, delay: 3 },
  { size: 90, x: "90%", y: "50%", color: "hsl(var(--accent) / 0.15)", duration: 19, delay: 5 },
];

const FloatingOrbs = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {orbs.map((orb, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full blur-3xl"
        style={{
          width: orb.size,
          height: orb.size,
          left: orb.x,
          top: orb.y,
          background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
        }}
        animate={{
          x: [0, 30, -20, 15, 0],
          y: [0, -25, 15, -10, 0],
          scale: [1, 1.2, 0.9, 1.1, 1],
          opacity: [0.6, 1, 0.7, 0.9, 0.6],
        }}
        transition={{
          duration: orb.duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: orb.delay,
        }}
      />
    ))}
  </div>
);

export default FloatingOrbs;
