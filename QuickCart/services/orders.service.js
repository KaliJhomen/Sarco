import endpoints from './api/endpoints';

// Crear un pedido
export async function createOrder(orderData, token) {
  const res = await fetch(endpoints.orders.create, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error('Error al crear el pedido');
  return res.json();
}

// Obtener todos los pedidos (admin o usuario)
export async function getAllOrders(token) {
  const res = await fetch(endpoints.orders.all, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!res.ok) throw new Error('Error al obtener pedidos');
  return res.json();
}

// Obtener pedido por ID
export async function getOrderById(id, token) {
  const res = await fetch(endpoints.orders.byId(id), {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!res.ok) throw new Error('Pedido no encontrado');
  return res.json();
}

// Obtener pedidos por usuario
export async function getOrdersByUser(userId, token) {
  const res = await fetch(endpoints.orders.byUser(userId), {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!res.ok) throw new Error('Error al obtener pedidos del usuario');
  return res.json();
}

// Cancelar pedido
export async function cancelOrder(id, token) {
  const res = await fetch(endpoints.orders.cancel(id), {
    method: 'PATCH',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!res.ok) throw new Error('No se pudo cancelar el pedido');
  return res.json();
}