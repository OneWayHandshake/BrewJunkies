import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { AuthCallbackPage } from '@/pages/AuthCallbackPage';
import { CoffeeListPage } from '@/pages/CoffeeListPage';
import { CoffeeDetailPage } from '@/pages/CoffeeDetailPage';
import { CoffeeCreatePage } from '@/pages/CoffeeCreatePage';
import { AnalyzePage } from '@/pages/AnalyzePage';
import { EducationPage } from '@/pages/EducationPage';
import { CategoryPage } from '@/pages/CategoryPage';
import { ArticlePage } from '@/pages/ArticlePage';
import { ProfilePage } from '@/pages/ProfilePage';
import { PassportPage } from '@/pages/PassportPage';
import { BrewPage } from '@/pages/brew/BrewPage';
import { BrewTimerPage } from '@/pages/brew/BrewTimerPage';
import { BrewJournalPage } from '@/pages/journal/BrewJournalPage';
import { BrewLogCreatePage } from '@/pages/journal/BrewLogCreatePage';
import { BrewLogEditPage } from '@/pages/journal/BrewLogEditPage';
import { StatsPage } from '@/pages/StatsPage';
import { GrindersPage } from '@/pages/GrindersPage';
import { CommunityRecipesPage } from '@/pages/CommunityRecipesPage';
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
          <Route path="auth/callback" element={<AuthCallbackPage />} />
          <Route path="learn" element={<EducationPage />} />
          <Route path="learn/category/:category" element={<CategoryPage />} />
          <Route path="learn/:slug" element={<ArticlePage />} />
          <Route path="brew" element={<BrewPage />} />
          <Route path="recipes/community" element={<CommunityRecipesPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="analyze" element={<AnalyzePage />} />
            <Route path="coffees" element={<CoffeeListPage />} />
            <Route path="coffees/new" element={<CoffeeCreatePage />} />
            <Route path="coffees/:id" element={<CoffeeDetailPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="passport" element={<PassportPage />} />
            <Route path="brew/timer" element={<BrewTimerPage />} />
            <Route path="journal" element={<BrewJournalPage />} />
            <Route path="journal/new" element={<BrewLogCreatePage />} />
            <Route path="journal/:id/edit" element={<BrewLogEditPage />} />
            <Route path="stats" element={<StatsPage />} />
            <Route path="grinders" element={<GrindersPage />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}
