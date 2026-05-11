// frontend/src/components/MesCommandes.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import { getCommandesClient } from "../api";
import "../styles/MesCommandes.css";
import { formatDate } from "../utils/formatDate";

function MesCommandes() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getCommandesClient()
      .then((res) => {
        setCommandes(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setMessage("❌ Impossible de charger vos commandes.");
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <div className="mes-commandes">
        <h2>Mes commandes</h2>

        <div className="actions">
          <Link to="/catalogue" className="btn btn-secondary">← Retour au catalogue</Link>
          <Link to="/commandes-annulees" className="btn btn-outline-danger">Voir mes commandes annulées</Link>
          <Link to="/client-livraisons" className="btn btn-outline-danger">Livraison(s)</Link>
        </div>

        {message && <p className="message">{message}</p>}
        {loading ? (
          <p>Chargement des commandes...</p>
        ) : (
          <table className="table-commandes">
            <thead>
              <tr>
                <th>Produit(s) Commandé(s)</th>
                <th>Date</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Détails</th>
                <th>Paiement</th>
              </tr>
            </thead>
            <tbody>
              {commandes.length > 0 ? (
                commandes
                  // ✅ filtrer les commandes annulées
                  .filter((commande) => commande.statut.toUpperCase() !== "ANNULEE" && commande.statut.toUpperCase() !== "ANNULÉE")

                  .map((commande) => (
                    <tr key={commande.id}>
                      <td data-label="Produit">
                        {commande.details?.length > 0 ? (
                          commande.details.map((detail) => (
                            <div key={detail.id}>
                              {detail.produit?.designation} (x{detail.quantite})
                            </div>
                          ))
                        ) : (
                          "Aucun produit"
                        )}
                      </td>
                      <td data-label="Date de commande">{formatDate(commande.date_commande)}</td>
                      <td data-label="Total">{commande.total} Ar</td>
                      <td data-label="statut">
                        <span className={`badge statut-${commande.statut.toLowerCase()}`}>
                          {commande.statut}
                        </span>
                      </td>
                      <td data-label="Action">
                        <Link to={`/commandes/${commande.id}`} className="btn-link">Voir</Link>
                      </td>
                      <td data-label="Paiement">
                        {commande.paiements && commande.paiements.length > 0 ? (
                          commande.paiements.map((p) => (
                            <div key={p.id}>
                              {p.mode_paiement}  {p.montant} Ar
                            </div>
                          ))
                        ) : (
                          "Aucun paiement"
                        )}
                      </td>

                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="6">Aucune commande trouvée.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}

export default MesCommandes;
