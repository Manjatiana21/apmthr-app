import React, { useEffect, useState } from "react";
import Layout from "./Layout"; 
import { getPaiementsClient } from "../api"; 
import "../styles/MesPaiements.css";

function MesPaiements() {
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getPaiementsClient() // ✅ appel centralisé
      .then((res) => {
        setPaiements(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setMessage("❌ Impossible de charger vos paiements.");
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <div className="mes-paiements">
        <h2>Mes paiements</h2>
        {message && <p className="message">{message}</p>}

        {loading ? (
          <p>Chargement des paiements...</p>
        ) : (
          <table className="table-paiements">
            <thead>
              <tr>
                <th>Commande</th>
                <th>Montant</th>
                <th>Mode</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {paiements.length > 0 ? (
                paiements.map((paiement) => (
                  <tr key={paiement.id}>
                    <td data-label="Commande">#{paiement.commande?.id}</td>
                    <td data-label="Montant">{paiement.montant} Ar</td>
                    <td data-label="Mode">{paiement.mode_paiement}</td>
                    <td data-label="Statut">
                      {paiement.statut === "EN ATTENTE" && (
                        <span className="badge badge-warning">En attente</span>
                      )}
                      {paiement.statut === "REÇU" && (
                        <span className="badge badge-success">Reçu</span>
                      )}
                      {paiement.statut === "ANNULÉ" && (
                        <span className="badge badge-danger">Annulé</span>
                      )}
                    </td>
                    <td data-label="Date">{paiement.date_paiement}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">Aucun paiement trouvé.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}

export default MesPaiements;
