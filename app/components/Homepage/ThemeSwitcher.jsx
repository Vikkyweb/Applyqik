'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';

const options = [
    { value: 'system', icon: Monitor, label: 'System' },
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — next-themes only knows the real theme client-side
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-[104px] h-9" aria-hidden="true" />;
  }

  const activeIndex = Math.max(
    0,
    options.findIndex((o) => o.value === theme)
  );

  return (
    <div className="relative inline-flex items-center bg-background border border-border rounded-xl px-1">
      {/* Sliding indicator */}
      <div
        className="absolute left-1 top-1 bottom-1 w-8 rounded-full bg-white dark:bg-gray-700 shadow-sm transition-transform duration-200 ease-out"
        style={{ transform: `translateX(${activeIndex * 32}px)` }}
      />

      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          aria-label={label}
          aria-pressed={theme === value}
          className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
            theme === value
              ? 'text-gray-900 dark:text-white'
              : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
          }`}
        >
          <Icon size={15} strokeWidth={2} />
        </button>
      ))}
    </div>
  );
}