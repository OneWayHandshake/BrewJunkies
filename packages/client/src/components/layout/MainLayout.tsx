import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { KeyboardShortcutsDialog } from '@/components/ui/KeyboardShortcutsDialog';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export function MainLayout() {
  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} BrewJunkies. Learn. Brew. Enjoy.</p>
      </footer>
      <KeyboardShortcutsDialog />
    </div>
  );
}
