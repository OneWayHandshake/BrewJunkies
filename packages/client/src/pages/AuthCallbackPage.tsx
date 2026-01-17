import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const OAUTH_REDIRECT_KEY = 'oauth_redirect_url';

export function getOAuthRedirectUrl(): string {
  return sessionStorage.getItem(OAUTH_REDIRECT_KEY) || '/';
}

export function setOAuthRedirectUrl(url: string): void {
  sessionStorage.setItem(OAUTH_REDIRECT_KEY, url);
}

export function clearOAuthRedirectUrl(): void {
  sessionStorage.removeItem(OAUTH_REDIRECT_KEY);
}

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAccessToken, checkAuth } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');

      if (token) {
        // Store the access token
        setAccessToken(token);

        // Fetch user data
        await checkAuth();

        // Get the redirect URL and clear it
        const redirectUrl = getOAuthRedirectUrl();
        clearOAuthRedirectUrl();

        // Navigate to the original destination
        navigate(redirectUrl, { replace: true });
      } else {
        // No token, redirect to login
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [searchParams, setAccessToken, checkAuth, navigate]);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}
