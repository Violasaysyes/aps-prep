"use client";

import { motion, AnimatePresence } from "framer-motion";

export interface AchievementData {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  color: string;
}

export const ACHIEVEMENTS: Record<string, AchievementData> = {
  first_course: {
    id: "first_course",
    icon: "01",
    title: "APS韭菜已入场",
    subtitle: "2500块审核费已交，没有退路了",
    color: "from-accent to-sky",
  },
  five_courses: {
    id: "five_courses",
    icon: "05",
    title: "德意志需要你",
    subtitle: "你复习的样子像极了在德国赶ddl",
    color: "from-sky to-lime",
  },
  semester_done: {
    id: "semester_done",
    icon: "S+",
    title: "学期Boss已击败",
    subtitle: "考官翻到这学期会感到一阵空虚",
    color: "from-lime to-warning",
  },
  high_risk_done: {
    id: "high_risk_done",
    icon: "!!",
    title: "红色警报已解除",
    subtitle: "你已从APS食物链底端爬到了中间",
    color: "from-coral to-warning",
  },
  all_done: {
    id: "all_done",
    icon: "GG",
    title: "审核部请注意，我来了",
    subtitle: "建议考官提前准备好通过章",
    color: "from-accent to-coral",
  },
  speed_demon: {
    id: "speed_demon",
    icon: "10+",
    title: "你是不是明天就考",
    subtitle: "临时抱佛脚选手，佛脚已断",
    color: "from-warning to-coral",
  },
  stubborn: {
    id: "stubborn",
    icon: "x3",
    title: "这门课和你八字不合",
    subtitle: "三跳未过，建议先拜孔庙再回来",
    color: "from-muted to-accent",
  },
};

const confettiShapes = ["●", "■", "▲", "◆", "★", "○", "□", "△"];
const confettiColors = ["text-accent", "text-coral", "text-lime", "text-warning", "text-sky", "text-success"];

function ConfettiPiece({ delay, x }: { delay: number; x: number }) {
  const shape = confettiShapes[Math.floor(Math.random() * confettiShapes.length)];
  const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
  return (
    <motion.div
      className={`absolute text-xl pointer-events-none ${color}`}
      initial={{ y: -20, x, opacity: 1, scale: 0 }}
      animate={{
        y: [0, -120, 400],
        x: [x, x + (Math.random() - 0.5) * 200],
        opacity: [0, 1, 0],
        scale: [0, 1.2, 0.6],
        rotate: [0, Math.random() * 360],
      }}
      transition={{ duration: 2, delay, ease: "easeOut" }}
    >
      {shape}
    </motion.div>
  );
}

interface AchievementPopupProps {
  achievement: AchievementData | null;
  onClose: () => void;
}

export function AchievementPopup({ achievement, onClose }: AchievementPopupProps) {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-foreground/60 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Confetti */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 16 }).map((_, i) => (
              <ConfettiPiece
                key={i}
                delay={i * 0.1}
                x={60 + (i * 280 / 16) % 350}
              />
            ))}
          </div>

          {/* Card */}
          <motion.div
            className="relative w-full max-w-sm"
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 30, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
          >
            <div className={`bg-gradient-to-br ${achievement.color} rounded-3xl p-10 text-center text-white shadow-2xl`}>
              {/* Icon */}
              <motion.div
                className="w-24 h-24 mx-auto bg-white/20 rounded-3xl flex items-center justify-center text-3xl font-extrabold mb-6"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.2, damping: 10, stiffness: 150 }}
              >
                {achievement.icon}
              </motion.div>

              {/* Title */}
              <motion.h2
                className="text-3xl font-extrabold mb-3 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {achievement.title}
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                className="text-lg text-white/80 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {achievement.subtitle}
              </motion.p>

              {/* Buttons */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={onClose}
                  className="w-full bg-white text-foreground py-4 rounded-2xl text-[15px] font-bold hover:bg-white/90 transition active:scale-95"
                >
                  继续Slay 💪
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
