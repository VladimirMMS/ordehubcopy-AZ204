/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

export default function LoginPage({ apiBaseUrl, onLogin }: { apiBaseUrl: string; onLogin: (token: string, user: any) => void }) {
  const [email, setEmail] = useState('admin@orderhub.com');
  const [password, setPassword] = useState('Admin123');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setMessage('Debes escribir el correo.');
      return;
    }

    if (!password.trim()) {
      setMessage('Debes escribir la contraseña.');
      return;
    }

    try {
      setIsLoading(true);
      setMessage('');

      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('Credenciales incorrectas.');
      }

      const data = await response.json();

      /**
       * Esperamos que el backend responda algo parecido a:
       *
       * {
       *   "accessToken": "eyJhbGciOiJIUzI1NiIs...",
       *   "user": {
       *     "id": 1,
       *     "email": "admin@orderhub.com",
       *     "role": "admin"
       *   }
       * }
       */

      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      onLogin(data.accessToken, data.user);
    } catch (error) {
      console.error(error);
      setMessage('No se pudo iniciar sesión. Verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f4f6f8',
        fontFamily: 'Arial',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#ffffff',
          border: '1px solid #ddd',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
        }}
      >
        <h1
          style={{
            margin: 0,
            marginBottom: '0.5rem',
            color: '#1f2937',
          }}
        >
          OrderHub
        </h1>

        <p
          style={{
            marginTop: 0,
            marginBottom: '2rem',
            color: '#6b7280',
          }}
        >
          Inicia sesión para gestionar órdenes, adjuntos y operaciones del sistema.
        </p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                marginBottom: '0.4rem',
                fontWeight: 'bold',
              }}
            >
              Correo electrónico
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@orderhub.com"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                marginBottom: '0.4rem',
                fontWeight: 'bold',
              }}
            >
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="********"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.8rem',
              backgroundColor: isLoading ? '#9ca3af' : '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: '1rem',
              color: '#b91c1c',
              backgroundColor: '#fee2e2',
              padding: '0.75rem',
              borderRadius: '8px',
            }}
          >
            {message}
          </p>
        )}

        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: '#4b5563',
          }}
        >
          <strong>Usuario de prueba:</strong>
          <br />
          Email: admin@orderhub.com
          <br />
          Password: Admin123
        </div>
      </div>
    </div>
  );
}