import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCommandesValideesAdmin } from "../api";
import Layout from "./Layout";
import "../styles/GestionCommandes.css";
import MessageModal from "./MessageModal"; 

function CommandesValideesAdmin() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    getCommandesValideesAdmin()
      .then((res) => {
        const validees = res.data.filter(c => c.statut === "VALIDEE");
        setCommandes(validees);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setMessage("❌ Impossible de charger les commandes validées.");
        setMessageType("error");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement des commandes validées...</p>;

  // ✅ Pagination côté front
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const commandesPage = commandes.slice(startIndex, endIndex);
  const totalPages = Math.ceil(commandes.length / pageSize);

  return (
    <Layout>
      <div className="gestion-commandes">
        <div className="actionsCV">
              <Link to="/admin/commandes" className="btn-retour">← Retour</Link>
      </div>
        <h2>Commandes validées</h2>

      
        <table className="table-commandes">
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Date</th>
              <th>Produits</th>
              <th>Total</th>
              <th>Statut</th>
              <th>Détails</th>
            </tr>
          </thead>
          <tbody>
            {commandesPage.length > 0 ? (
              commandesPage.map((commande) => (
                <tr key={commande.id}>
                  <td>#{commande.id}</td>
                  <td>{commande.client?.username}</td>
                  <td>{commande.date_commande}</td>
                  <td>
                    {commande.details && commande.details.length > 0 ? (
                      commande.details.map((d) => (
                        <div key={d.id}>
                          {d.produit?.designation} (x{d.quantite}) - {d.prix_unitaire} Ar
                        </div>
                      ))
                    ) : (
                      <span>Aucun produit</span>
                    )}
                  </td>
                  <td>{commande.total} Ar</td>
                  <td>
                    <span className={`badge statut-${commande.statut.toLowerCase()}`}>
                      {commande.statut}
                    </span>
                  </td>
                  <td>
                    <Link to={`/commandes/${commande.id}/detail`} className="btn-detail">
                      Voir détails
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7">Aucune commande validée.</td></tr>
            )}
          </tbody>
        </table>

        {/* ✅ Pagination */}
        <div className="pagination">
          {page > 1 && (
            <button onClick={() => setPage(page - 1)} className="btn-prev">Précédent</button>
          )}
          <span>Page {page} / {totalPages}</span>
          {page < totalPages && (
            <button onClick={() => setPage(page + 1)} className="btn-next">Suivant</button>
          )}
        </div>

        {/* ✅ Message modal */}
        <MessageModal
          message={message}
          type={messageType}
          onClose={() => setMessage("")}
        />
      </div>
    </Layout>
  );
}

export default CommandesValideesAdmin;
