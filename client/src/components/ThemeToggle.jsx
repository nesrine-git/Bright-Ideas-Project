import { useTheme } from '../context/ThemeProvider';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const iconVariants = {
  initialDark: { rotate: -90, opacity: 0 },
  animateDark: { rotate: 0, opacity: 1 },
  exitDark: { rotate: 90, opacity: 0 },
  initialLight: { rotate: 90, opacity: 0 },
  animateLight: { rotate: 0, opacity: 1 },
  exitLight: { rotate: -90, opacity: 0 },
};

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme.mode === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      className={`flex items-center justify-center p-2 rounded-full transition-colors duration-500 ${
        isDark ? 'bg-gray-700 text-yellow-400' : 'bg-orange-200 text-orange-700'
      }`}
      aria-label="Toggle Theme"
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={iconVariants.initialDark}
            animate={iconVariants.animateDark}
            exit={iconVariants.exitDark}
            transition={{ duration: 0.3 }}
          >
            <Moon className="w-5 h-5" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={iconVariants.initialLight}
            animate={iconVariants.animateLight}
            exit={iconVariants.exitLight}
            transition={{ duration: 0.3 }}
          >
            <Sun className="w-5 h-5" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default ThemeToggle;
