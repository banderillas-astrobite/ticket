import React, { useState } from "react";
import "./index.css";
import { createClient } from "@supabase/supabase-js";


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Productos agrupados
const categorias = {
  Salchicha: [
    { nombre: "Salchicha Ramen", precio: 45 },
    { nombre: "Salchicha Cruji", precio: 45 },
    { nombre: "Salchicha Papa", precio: 50 },
    { nombre: "Salchicha Cheetos", precio: 55 },
    { nombre: "Salchicha Flamin Hot", precio: 55 },
  ],
  Queso: [
    { nombre: "Queso Ramen", precio: 55 },
    { nombre: "Queso Cruji", precio: 55 },
    { nombre: "Queso Papa", precio: 60 },
    { nombre: "Queso Cheetos", precio: 65 },
    { nombre: "Queso Flamin Hot", precio: 65 },
  ],
  Combinada: [
    { nombre: "Combinada Ramen", precio: 50 },
    { nombre: "Combinada Cruji", precio: 50 },
    { nombre: "Combinada Papa", precio: 55 },
    { nombre: "Combinada Cheetos", precio: 60 },
    { nombre: "Combinada Flamin Hot", precio: 60 },
  ],
  Extras: [
    { nombre: "Orden de Papas", precio: 40 },
    { nombre: "Salchipulpos", precio: 35 },
  ],
};

export default function App() {
  const [ticket, setTicket] = useState([]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const agregarProducto = (producto) => {
    // Pregunta si lleva papas extra
    if (producto.nombre.includes("Salchicha") || producto.nombre.includes("Queso") || producto.nombre.includes("Combinada")) {
      const conPapas = confirm(`¿Quieres agregar papas a ${producto.nombre} por +$15?`);
      if (conPapas) {
        setTicket([...ticket, { ...producto, nombre: producto.nombre + " + Papas", precio: producto.precio + 15 }]);
        return;
      }
    }
    setTicket([...ticket, producto]);
  };

  const eliminarProducto = (index) => {
    const nuevo = [...ticket];
    nuevo.splice(index, 1);
    setTicket(nuevo);
  };

  const total = ticket.reduce((acc, item) => acc + item.precio, 0);

  const guardarTicket = async () => {
    if (ticket.length === 0) return setMsg("No hay productos para guardar.");
    setSaving(true);
    setMsg("");

    const ticketData = {
      ticket_number: `T-${Date.now()}`,
      items: ticket.map((p) => ({ nombre: p.nombre, precio: p.precio })),
      total,
      note,
    };

    try {
      const { data, error } = await supabase.from("tickets").insert([ticketData]).select();
      if (error) throw error;
      setMsg(`✅ Ticket guardado: ${data[0].id}`);
      setTicket([]);
      setNote("");
    } catch (e) {
      setMsg("❌ Error guardando: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app">
      <h1>Astro Bite - Tickets</h1>

      {Object.keys(categorias).map((cat) => (
        <div key={cat} className="categoria">
          <h2>{cat}</h2>
          <div className="products">
            {categorias[cat].map((p, i) => (
              <button key={i} onClick={() => agregarProducto(p)}>
                {p.nombre} <br /> ${p.precio}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div style={{ marginTop: "1rem" }}>
        <label>Nota:</label>
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="(Opcional)" />
      </div>

      <div className="ticket-preview">
        <h2>Ticket</h2>
        {ticket.length === 0 ? (
          <p>No hay productos en el ticket.</p>
        ) : (
          <ul>
            {ticket.map((item, i) => (
              <li key={i}>
                {item.nombre} - ${item.precio}{" "}
                <button onClick={() => eliminarProducto(i)} style={{ marginLeft: "10px", color: "red" }}>
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}
        <h3>Total: ${total}</h3>
      </div>

      <button onClick={guardarTicket} disabled={saving}>
        {saving ? "Guardando..." : "Guardar Ticket"}
      </button>

      {msg && <p style={{ marginTop: "1rem" }}>{msg}</p>}
    </div>
  );
}
