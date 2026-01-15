import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { CoffeeListPage } from '@/pages/CoffeeListPage';
import { CoffeeDetailPage } from '@/pages/CoffeeDetailPage';
import { AnalyzePage } from '@/pages/AnalyzePage';
import { EducationPage } from '@/pages/EducationPage';
import { CategoryPage } from '@/pages/CategoryPage';
import { ArticlePage } from '@/pages/ArticlePage';
import { ProfilePage } from '@/pages/ProfilePage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Toaster } from '@/components/ui/Toaster';

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="coffees" element={<CoffeeListPage />} />
          <Route path="coffees/:id" element={<CoffeeDetailPage />} />
          <Route path="analyze" element={<AnalyzePage />} />
          <Route path="learn" element={<EducationPage />} />
          <Route path="learn/category/:category" element={<CategoryPage />} />
          <Route path="learn/:slug" element={<ArticlePage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}
