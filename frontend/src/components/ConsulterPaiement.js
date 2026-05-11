import React, { useEffect, useState } from "react";
import { getPaiementsClient } from "../api"; 
import "../styles/Paiement.css";
import Layout from "./Layout";
import MessageModal from "./MessageModal"; // ✅ import

function ConsulterPaiement() {
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    getPaiementsClient()
      .then((res) => {
        setPaiements(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setMessage("❌ Impossible de charger les paiements.");
        setMessageType("error");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement des paiements...</p>;

  return (
    <Layout>
      <div className="paiement-container">
        <h2>Historique de mes paiements</h2>

        <table className="table-paiement">
          <thead>
            <tr>
              <th>Commande</th>
              <th>Produits</th>
              <th>Montant</th>
              <th>Mode de paiement</th>
              <th>Statut</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {paiements.length > 0 ? (
              paiements.map((p) => (
                <tr key={p.id}>
                  <td>#{p.commande.id}</td>
                  <td>
                    {p.commande.details.map((d) => (
                      <div key={d.id}>
                        {d.produit.designation} (x{d.quantite})
                      </div>
                    ))}
                  </td>
                  <td>{p.montant} Ar</td>
                  <td>{p.mode_paiement}</td>
                  <td>
                    {p.statut === "EN ATTENTE" && (
                      <span className="badge badge-warning">En attente</span>
                    )}
                    {p.statut === "REÇU" && (
                      <span className="badge badge-success">Reçu</span>
                    )}
                    {p.statut === "ANNULÉ" && (
                      <span className="badge badge-danger">Annulé</span>
                    )}
                  </td>
                  <td>{p.date_paiement}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">Aucun paiement trouvé.</td>
              </tr>
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

export default ConsulterPaiement;
