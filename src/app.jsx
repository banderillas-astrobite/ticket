import React, { useState } from "react";
import "./index.css";
import { createClient } from "@supabase/supabase-js";

// Configura tus variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Productos por categoría
const categorias = {
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

// Extras como productos independientes
const extras = [
  { nombre: "Orden de Papas", precio: 40 },
  { nombre: "Salchipulps", precio: 35 },
];

export default function App() {
  const [ticket, setTicket] = useState([]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const agregarProducto = (categoria, producto) => {
    setTicket([
      ...ticket,
      { categoria, nombre: producto.nombre, precio: producto.precio, papas: false, extras: [] },
    ]);
  };

  const agregarExtra = (extra) => {
    setTicket([
      ...ticket,
      { categoria: "Extras", nombre: extra.nombre, precio: extra.precio, papas: false, extras: [] },
    ]);
  };

  const togglePapas = (index) => {
    const newTicket = [...ticket];
    newTicket[index].papas = !newTicket[index].papas;
    newTicket[index].precio += newTicket[index].papas ? 15 : -15;
    setTicket(newTicket);
  };

  const eliminarProducto = (index) => {
    const newTicket = [...ticket];
    if (newTicket[index].papas) newTicket[index].precio -= 15;
    newTicket.splice(index, 1);
    setTicket(newTicket);
  };

  const total = ticket.reduce((acc, item) => acc + item.precio, 0);

  const guardarTicket = async () => {
    if (ticket.length === 0) return setMsg("No hay productos para guardar.");
    setSaving(true);
    setMsg("");

    const ticketData = {
      ticket_number: `T-${Date.now()}`,
      items: ticket.map((p) => ({
        nombre: p.nombre,
        categoria: p.categoria,
        papas: p.papas,
        extras: p.extras,
        precio: p.precio,
      })),
      subtotal: total,
      tax: 0,
      total: total,
      note,
    };

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

      {Object.keys(categorias).map((cat) => (
        <div key={cat} className="categoria">
          <h2>{cat}</h2>
          <div className="products">
            {categorias[cat].map((prod, i) => (
              <button key={i} onClick={() => agregarProducto(cat, prod)}>
                {prod.nombre} <br /> ${prod.precio}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Sección de extras independientes */}
      <div className="categoria">
        <h2>Extras</h2>
        <div className="products">
          {extras.map((ext, i) => (
            <button key={i} onClick={() => agregarExtra(ext)}>
              {ext.nombre} <br /> ${ext.precio}
            </button>
          ))}
        </div>
      </div>

      <div className="ticket-preview">
        <h2>Ticket</h2>
        {ticket.length === 0 ? (
          <p>No hay productos en el ticket.</p>
        ) : (
          <ul>
            {ticket.map((item, i) => (
              <li key={i}>
                {item.categoria} - {item.nombre} - ${item.precio}{" "}
                {item.categoria !== "Extras" && (
                  <button className="papas-btn" onClick={() => togglePapas(i)}>
                    {item.papas ? "Quitar papas" : "+ Papas $15"}
                  </button>
                )}
                <button className="remove-btn" onClick={() => eliminarProducto(i)}>
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}
        <h3>Total: ${total}</h3>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Nota:</label>
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="(Opcional)" />
      </div>

      <button onClick={guardarTicket} disabled={saving}>
        {saving ? "Guardando..." : "Guardar Ticket"}
      </button>

      {msg && <p style={{ marginTop: "1rem" }}>{msg}</p>}
    </div>
  );
}
