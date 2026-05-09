/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import CreateOrderForm from '../components/CreateOrderForm';

export default function OrdersPage({ apiBaseUrl, token, user }: { apiBaseUrl: string; token: string; user: any }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setMessage('');

      const response = await fetch(`${apiBaseUrl}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('No se pudieron cargar las órdenes.');
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
      setMessage('Ocurrió un error cargando las órdenes.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const canCreateOrders = user?.role === 'admin' || user?.role === 'operator';

  return (
    <div>
      <section
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #ddd',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <h2 style={{ marginTop: 0 }}>Órdenes</h2>

        <p style={{ color: '#6b7280' }}>
          En esta sección se muestran las órdenes protegidas por autenticación.
          El backend solo responde si el request contiene un token JWT válido.
        </p>

        {isLoading && <p>Cargando órdenes...</p>}

        {message && (
          <p
            style={{
              color: '#b91c1c',
              backgroundColor: '#fee2e2',
              padding: '0.75rem',
              borderRadius: '8px',
            }}
          >
            {message}
          </p>
        )}

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '1rem',
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Cliente</th>
              <th style={thStyle}>Total</th>
              <th style={thStyle}>Estado</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td style={tdStyle}>{order.id}</td>
                <td style={tdStyle}>{order.customerId}</td>
                <td style={tdStyle}>{order.total}</td>
                <td style={tdStyle}>{order.status}</td>
              </tr>
            ))}

            {!isLoading && orders.length === 0 && (
              <tr>
                <td style={tdStyle} colSpan={4}>
                  No hay órdenes registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {canCreateOrders ? (
        <CreateOrderForm
          apiBaseUrl={apiBaseUrl}
          token={token}
          onOrderCreated={fetchOrders}
        />
      ) : (
        <div
          style={{
            backgroundColor: '#fff7ed',
            border: '1px solid #fed7aa',
            borderRadius: '12px',
            padding: '1rem',
          }}
        >
          Tu rol actual solo permite consultar órdenes.
        </div>
      )}
    </div>
  );
}

const thStyle: CSSProperties = {
  textAlign: 'left',
  borderBottom: '1px solid #ddd',
  padding: '0.75rem',
  backgroundColor: '#f9fafb',
};

const tdStyle: CSSProperties = {
  borderBottom: '1px solid #eee',
  padding: '0.75rem',
};
