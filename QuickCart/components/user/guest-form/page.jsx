import { useCreateOrder } from '@/hooks/server/useOrders';

export default function GuestCheckoutPage() {
  const createOrder = useCreateOrder();
  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    ciudad: '',
    direccion: '',
    email: '',
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    // generar un sessionToken para el invitado
    const sessionToken = localStorage.getItem('sessionToken') || generateAndStoreToken();
    const orderData = {
      ...form,
      sessionToken,
      items: []
    };
    try {
      await createOrder.mutateAsync({ orderData });
      alert('¡Pedido realizado!');
    } catch {
      alert('Error al crear el pedido');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Nombre" />
      <input name="telefono" value={form.telefono} onChange={handleChange} required placeholder="Teléfono" />
      <input name="ciudad" value={form.ciudad} onChange={handleChange} required placeholder="Ciudad" />
      <input name="direccion" value={form.direccion} onChange={handleChange} required placeholder="Dirección" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email (opcional)" />
      <button type="submit" disabled={createOrder.isLoading}>Finalizar compra</button>
    </form>
  );
}

// Utilidad para generar y guardar un token de sesión
function generateAndStoreToken() {
  const token = crypto.randomUUID();
  localStorage.setItem('sessionToken', token);
  return token;
}