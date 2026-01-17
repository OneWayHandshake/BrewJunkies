import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store/themeStore';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  description: string;
  action: () => void;
}

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const { theme, setTheme } = useThemeStore();

  const shortcuts: ShortcutConfig[] = [
    {
      key: 'h',
      ctrl: true,
      description: 'Go to Home',
      action: () => navigate('/'),
    },
    {
      key: 'b',
      ctrl: true,
      description: 'Go to Brew Timer',
      action: () => navigate('/brew'),
    },
    {
      key: 'j',
      ctrl: true,
      description: 'Go to Journal',
      action: () => navigate('/journal'),
    },
    {
      key: 'k',
      ctrl: true,
      description: 'Go to Coffees',
      action: () => navigate('/coffees'),
    },
    {
      key: 's',
      ctrl: true,
      shift: true,
      description: 'Go to Stats',
      action: () => navigate('/stats'),
    },
    {
      key: 'n',
      ctrl: true,
      description: 'New Brew Log',
      action: () => navigate('/journal/new'),
    },
    {
      key: 'd',
      ctrl: true,
      shift: true,
      description: 'Toggle Dark Mode',
      action: () => {
        const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
      },
    },
  ];

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : true;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && shiftMatch && keyMatch && (shortcut.ctrl || shortcut.meta)) {
          event.preventDefault();
          shortcut.action();
          return;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return shortcuts;
}

// Get shortcuts for display (without actions)
export function getShortcutsList() {
  return [
    { keys: ['Ctrl', 'H'], description: 'Go to Home' },
    { keys: ['Ctrl', 'B'], description: 'Go to Brew Timer' },
    { keys: ['Ctrl', 'J'], description: 'Go to Journal' },
    { keys: ['Ctrl', 'K'], description: 'Go to Coffees' },
    { keys: ['Ctrl', 'Shift', 'S'], description: 'Go to Stats' },
    { keys: ['Ctrl', 'N'], description: 'New Brew Log' },
    { keys: ['Ctrl', 'Shift', 'D'], description: 'Toggle Dark Mode' },
    { keys: ['?'], description: 'Show Shortcuts' },
  ];
}
