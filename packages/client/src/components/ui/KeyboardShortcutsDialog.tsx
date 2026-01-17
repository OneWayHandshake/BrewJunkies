import { useState, useEffect } from 'react';
import { Keyboard } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './Dialog';
import { getShortcutsList } from '@/hooks/useKeyboardShortcuts';

export function KeyboardShortcutsDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const shortcuts = getShortcutsList();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (event.key === '?' || (event.key === '/' && event.shiftKey)) {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }

      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Quick navigation shortcuts for power users.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-3">
            {shortcuts.map((shortcut, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
              >
                <span className="text-sm text-muted-foreground">
                  {shortcut.description}
                </span>
                <div className="flex gap-1">
                  {shortcut.keys.map((key, keyIdx) => (
                    <kbd
                      key={keyIdx}
                      className="px-2 py-1 text-xs font-mono bg-muted rounded border border-border"
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-center text-muted-foreground">
          Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">?</kbd> to toggle this dialog
        </p>
      </DialogContent>
    </Dialog>
  );
}
