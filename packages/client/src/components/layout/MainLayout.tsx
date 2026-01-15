import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Coffee Education. Learn. Brew. Enjoy.</p>
      </footer>
    </div>
  );
}
