import { useState } from 'react';

export default function CreateOrderForm({ apiBaseUrl, token, onOrderCreated }: { apiBaseUrl: string; token: string; onOrderCreated: (order: any) => void }) {
  const [customerId, setCustomerId] = useState('');
  const [total, setTotal] = useState('');
  const [status, setStatus] = useState('Pending');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!customerId.trim()) {
      setMessage('Debes escribir el customerId.');
      return;
    }

    if (!total || Number(total) <= 0) {
      setMessage('El total debe ser mayor que cero.');
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage('');

      const response = await fetch(`${apiBaseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerId,
          total: Number(total),
          status,
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo crear la orden.');
      }

      const createdOrder = await response.json();

      setMessage(`Orden creada correctamente. ID: ${createdOrder.id}`);

      setCustomerId('');
      setTotal('');
      setStatus('Pending');

      if (onOrderCreated) {
        onOrderCreated(createdOrder);
      }
    } catch (error) {
      console.error(error);
      setMessage('Ocurrió un error al crear la orden.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        marginTop: '1.5rem',
        padding: '1rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#fafafa',
      }}
    >
      <h3>Crear nueva orden</h3>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="customerId">
            <strong>Cliente</strong>
          </label>
          <input
            id="customerId"
            type="text"
            value={customerId}
            onChange={(event) => setCustomerId(event.target.value)}
            placeholder="Ejemplo: cust-001"
            style={{
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.25rem',
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="total">
            <strong>Total</strong>
          </label>
          <input
            id="total"
            type="number"
            value={total}
            onChange={(event) => setTotal(event.target.value)}
            placeholder="Ejemplo: 1500"
            style={{
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.25rem',
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="status">
            <strong>Estado</strong>
          </label>
          <select
            id="status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.25rem',
            }}
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '0.6rem 1rem',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
          }}
        >
          {isSubmitting ? 'Creando...' : 'Crear orden'}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: '1rem' }}>
          {message}
        </p>
      )}
    </div>
  );
}