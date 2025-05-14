import { ReactNode, useEffect, useState } from 'react';
import { BASE_API_URL, PROJECT_KEY } from '~constants/constants.ts';
import { AuthContext } from '~/contexts/authContext.tsx';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  const logout = () => {
    localStorage.removeItem('accessToken');
    setAuthenticated(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token === null) {
      setChecking(false);
      return;
    }

    void (async () => {
      try {
        const response = await fetch(
          `${BASE_API_URL}/${PROJECT_KEY}/customers/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!response.ok) throw new Error('Not authenticated');
        setAuthenticated(true);
      } catch {
        logout();
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  if (checking) return null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout, checking }}>
      {children}
    </AuthContext.Provider>
  );
}
