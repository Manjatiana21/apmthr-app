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
  const [page, setPage] = useState(1);
  const pageSize = 5;

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

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const commandesPage = commandes.slice(startIndex, endIndex);
  const totalPages = Math.ceil(commandes.length / pageSize);


  return (
    <Layout>
      <div className="mes-commandes">
        <h2>Mes commandes</h2>

        <div className="actions">
          <Link to="/catalogue" className="btn btn-secondary" id="btn-secondary-commande">← Retour au catalogue</Link>
          <Link to="/commandes-annulees" className="btn btn-outline-danger" id="Voir-mes-commandes-btn">Voir les commandes annulées</Link>
          <Link to="/client-livraisons" className="btn btn-outline-danger" id="Livraison-btn">Livraison(s)</Link>
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
                        <span className={`badge statut-${commande.statut.toLowerCase()}`} id="statut-commande">
                          {commande.statut}
                        </span>
                      </td>
                      <td data-label="Action">
                        <Link to={`/commandes/${commande.id}`} className="btn-link" id="Voir">Voir</Link>
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

          <div className="pagination">
          {page > 1 && (
            <button onClick={() => setPage(page - 1)} className="btn-prev">Précédent</button>
          )}
          <span>Page {page} / {totalPages}</span>
          {page < totalPages && (
            <button onClick={() => setPage(page + 1)} className="btn-next">Suivant</button>
          )}
        </div>
        
          </table>
        )}
      
      </div>
    </Layout>
  );
}

export default MesCommandes;
