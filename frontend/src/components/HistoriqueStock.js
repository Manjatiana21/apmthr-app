// frontend/src/components/HistoriqueStock.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getHistoriqueStock } from "../api";
import Layout from "./Layout"; 
import "../styles/Stock.css";
import MessageModal from "./MessageModal"; // ✅ import

function HistoriqueStock() {
  const { id } = useParams();
  const [mouvements, setMouvements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    getHistoriqueStock(id)
      .then((res) => {
        setMouvements(res.data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setMessage("❌ Impossible de charger l’historique du stock.");
        setMessageType("error");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Chargement de l’historique...</p>;

  return (
    <Layout>
      <div className="stock-container">
        <h2>Historique du stock pour produit #{id}</h2>
        <table className="table-stock">
          <thead>
            <tr>
              <th>Type</th>
              <th>Date</th>
              <th>Quantité</th>
            </tr>
          </thead>
          <tbody>
            {mouvements.length > 0 ? (
              mouvements.map((m) => (
                <tr key={m.id}>
                  <td>{m.type_mouvement}</td>
                  <td>{m.date_mouvement}</td>
                  <td>{m.quantite}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="3">Aucun mouvement enregistré</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Message modal */}
      <MessageModal
        message={message}
        type={messageType}
        onClose={() => setMessage("")}
      />
    </Layout>
  );
}

export default HistoriqueStock;
