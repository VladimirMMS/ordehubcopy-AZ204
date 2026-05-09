/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import OrdersPage from './pages/OrderPage';


function App() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleLogin = (accessToken: string, userData: any) => {
    setToken(accessToken);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  if (!token) {
    return (
      <LoginPage
        apiBaseUrl={apiBaseUrl}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f4f6f8',
        fontFamily: 'Arial',
      }}
    >
      <header
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #ddd',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>OrderHub</h1>
          <p style={{ margin: 0, color: '#6b7280' }}>
            Sesión activa: {user?.email} ({user?.role})
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: '0.6rem 1rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            cursor: 'pointer',
          }}
        >
          Cerrar sesión
        </button>
      </header>

      <main style={{ padding: '2rem' }}>
        <OrdersPage
          apiBaseUrl={apiBaseUrl}
          token={token}
          user={user}
        />
      </main>
    </div>
  );
}

export default App;