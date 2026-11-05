import { useEffect, useState } from "react";
import { motion } from "motion/react";

export function TeacherLoadingScreen({ teacherId }: { teacherId?: string }) {
  const [stage, setStage] = useState<number>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 1400);
    const t2 = setTimeout(() => setStage(2), 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const messages = [
    "Preparing your classroom of memories...",
    "Retrieving the lessons and moments...",
    "Loading your teacher's story...",
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-deep px-6 text-center">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_center,#1a1429_0%,#07060d_75%)]" />

      {/* Animated starlight ring */}
      <div className="relative mb-8 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="h-20 w-20 rounded-full border border-gold/30 border-t-gold shadow-[0_0_24px_rgba(238,195,115,0.25)]"
        />
        <motion.div
          animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute h-10 w-10 rounded-full bg-gold/20 backdrop-blur-sm"
        />
        <span className="absolute font-display text-lg text-gold">✦</span>
      </div>

      <motion.p
        key={stage}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.5 }}
        className="font-display text-xl tracking-wide text-chalk sm:text-2xl"
      >
        {messages[stage]}
      </motion.p>

      {teacherId && (
        <p className="mt-3 font-mono text-[11px] tracking-[0.25em] text-chalk-dim uppercase">
          Teacher ID: {teacherId}
        </p>
      )}

      <p className="mt-8 font-display text-xs italic text-chalk-dim/70">
        &ldquo;Some lessons end with the bell. The best ones never do.&rdquo;
      </p>
    </div>
  );
}
