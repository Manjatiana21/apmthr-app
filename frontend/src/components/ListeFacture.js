// frontend/src/components/ListeFactures.js
import React, { useEffect, useState } from "react";
import { getAllFactures } from "../api"; 
import Layout from "./Layout";
import "../styles/facture.css";
import MessageModal from "./MessageModal"; // ✅ import

function ListeFactures() {
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    getAllFactures()
      .then((data) => {
        setFactures(data);
        setLoading(false);
      })
      .catch(() => {
        setMessage("❌ Erreur lors du chargement des factures.");
        setMessageType("error");
        setLoading(false);
      });
  }, []);

  if (loading) return <Layout><p>Chargement des factures...</p></Layout>;

  return (
    <Layout>
      <div className="facture-containerliste">
        <h2>📑 Liste des factures générées</h2>

        <table className="table-factureliste">
          <thead>
            <tr>
              <th>Numéro</th>
              <th>Client</th>
              <th>Montant</th>
              <th>Date émission</th>
              <th>Envoyée</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {factures.length > 0 ? (
              factures.map((f) => (
                <tr key={f.id}>
                  <td data-label="Facture N°">{f.numero}</td>
                  <td data-label="Client">{f.client?.username || "—"}</td>
                  <td data-label="Montant Total">{f.montant_total} Ar</td>
                  <td data-label="Date d'émission">{new Date(f.date_emission).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${f.envoyee ? "badge-success" : "badge-danger"}`}>
                      {f.envoyee ? "Oui" : "Non"}
                    </span>
                  </td>
                  <td data-label="Action">
                    <a
                      href={`/factures/${f.id}`}
                      className="btnliste btn-sm btn-primary"
                    >
                      Voir
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">Aucune facture générée.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

     
      <MessageModal
        message={message}
        type={messageType}
        onClose={() => setMessage("")}
      />
    </Layout>
  );
}

export default ListeFactures;
