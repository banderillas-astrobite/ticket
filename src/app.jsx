import { useState } from "react";
import "./index.css";
import { createClient } from "@supabase/supabase-js";

// Configura tus variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const productos = {
  Salchicha: [
    { nombre: "Ramen", precio: 45 },
    { nombre: "Cruji", precio: 45 },
    { nombre: "Papa", precio: 50 },
    { nombre: "Cheetos", precio: 55 },
    { nombre: "Flamin Hot", precio: 55 },
  ],
  Combinada: [
    { nombre: "Ramen", precio: 50 },
    { nombre: "Cruji", precio: 50 },
    { nombre: "Papa", precio: 55 },
    { nombre: "Cheetos", precio: 60 },
    { nombre: "Flamin Hot", precio: 60 },
  ],
  Queso: [
    { nombre: "Ramen", precio: 55 },
    { nombre: "Cruji", precio: 55 },
    { nombre: "Papa", precio: 60 },
    { nombre: "Cheetos", precio: 65 },
    { nombre: "Flamin Hot", precio: 65 },
  ],
};

export default function App() {
  const [ticket, setTicket] = useState([]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const agregarProducto = (categoria, producto, conPapas = false) => {
    const precioFinal = conPapas ? producto.precio + 15 : producto.precio;
    setTicket([
      ...ticket,
      { categoria, nombre: producto.nombre, precio: precioFinal, conPapas },
    ]);
  };

  const eliminarProducto = (index) => {
    const nuevoTicket = [...ticket];
    nuevoTicket.splice(index, 1);
    setTicket(nuevoTicket);
  };

  const subtotal = ticket.reduce((acc, item) => acc + item.precio, 0);

  const guardarTicket = async () => {
    if (ticket.length === 0) {
      setMsg("No hay productos para guardar.");
      return;
    }

    const ticketData = {
      ticket_number: `T-${Date.now()}`,
      items: ticket.map((p) => ({
        categoria: p.categoria,
        nombre: p.nombre,
        precio: p.precio,
        conPapas: p.conPapas,
      })),
      subtotal,
      tax: 0,
      total: subtotal,
      note,
    };

    setSaving(true);
    setMsg("");

    try {
      const { data, error } = await supabase.from("tickets").insert([ticketData]).select();
      if (error) throw error;
      setMsg(`Ticket guardado: ${data[0].id}`);
      setTicket([]);
      setNote("");
    } catch (e) {
      setMsg("Error guardando: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app">
      <h1>Astro Bite - Tickets</h1>

      {Object.keys(productos).map((categoria) => (
        <div key={categoria} className="categoria">
          <h2>{categoria}</h2>
          <div className="products">
            {productos[categoria].map((p, i) => (
              <div key={i} className="producto-btn">
                <button onClick={() => agregarProducto(categoria, p, false)}>
                  {p.nombre} <br /> ${p.precio}
                </button>
                <button onClick={() => agregarProducto(categoria, p, true)}>
                  {p.nombre} + Papas <br /> ${p.precio + 15}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="ticket-preview">
        <h2>Ticket</h2>
        {ticket.length === 0 ? (
          <p>No hay productos en el ticket.</p>
        ) : (
          <ul>
            {ticket.map((item, i) => (
              <li key={i}>
                {item.categoria} - {item.nombre} {item.conPapas ? "+ Papas" : ""} - ${item.precio}{" "}
                <button className="eliminar-btn" onClick={() => eliminarProducto(i)}>
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}
        <h3>Total: ${subtotal}</h3>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Nota:</label>
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="(Opcional)" />
      </div>

      <button onClick={guardarTicket} disabled={saving} className="guardar-btn">
        {saving ? "Guardando..." : "Guardar Ticket"}
      </button>

      {msg && <p style={{ marginTop: "1rem" }}>{msg}</p>}
    </div>
  );
}
