import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

const HomePage = () => {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Welcome to the Home Page</h1>
    </div>
  );
};

export default HomePage;
