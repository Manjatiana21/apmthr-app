import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCommandesAdmin, validerCommande, annulerCommande } from "../api";
import Layout from "./Layout";
import "../styles/GestionCommandes.css";
import MessageModal from "./MessageModal"; // ✅ import

function GestionCommandes() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [confirmAction, setConfirmAction] = useState(null); // ✅ {id, type}

  useEffect(() => {
    getCommandesAdmin()
      .then((res) => {
        const enAttente = res.data.filter(c => c.statut === "EN_ATTENTE");
        setCommandes(enAttente);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setMessage("❌ Impossible de charger les commandes.");
        setMessageType("error");
        setLoading(false);
      });
  }, []);

  const updateStatut = async (id, action) => {
    try {
      if (action === "valider") {
        await validerCommande(id);
        setCommandes(commandes.filter(c => c.id !== id));
        setMessage(`✅ Commande #${id} validée avec succès`);
        setMessageType("success");
        window.location.href = "/commandes/validees";
      } else if (action === "annuler") {
        await annulerCommande(id);
        setCommandes(commandes.filter(c => c.id !== id));
        setMessage(`✅ Commande #${id} annulée avec succès`);
        setMessageType("success");
        window.location.href = "/commandes/annulees";
      }
    } catch (err) {
      console.error("Erreur mise à jour:", err);
      setMessage("❌ Erreur lors de la mise à jour du statut.");
      setMessageType("error");
    } finally {
      setConfirmAction(null);
    }
  };

  if (loading) return <p>Chargement des commandes...</p>;

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const commandesPage = commandes.slice(startIndex, endIndex);
  const totalPages = Math.ceil(commandes.length / pageSize);

  return (
    <Layout>
      <div className="gestion-commandes">
        <h2>Gestion des commandes (En attente)</h2>

        <div className="navigation-commandes">
          <Link to="/commandes/validees" className="btn btn-outline-danger">Voir les commandes validées</Link>
          <Link to="/commandes/annulees" className="btn btn-outline-danger">Voir les commandes annulées</Link>
        </div>

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
              <th>Actions</th>
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
                  <td>
                    {commande.statut === "EN_ATTENTE" && (
                      <>
                        <button
                          onClick={() => setConfirmAction({ id: commande.id, type: "valider" })}
                          className="btn-valide"
                        >
                          Valider
                        </button>
                        <button
                          onClick={() => setConfirmAction({ id: commande.id, type: "annuler" })}
                          className="btn-annuler"
                        >
                          Annuler
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="8">Aucune commande en attente.</td></tr>
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
      </div>

      {/* ✅ Message modal */}
      <MessageModal
        message={message}
        type={messageType}
        onClose={() => setMessage("")}
      />

      {/* ✅ Confirmation modal */}
      {confirmAction && (
        <MessageModal
          message={`Voulez-vous vraiment ${confirmAction.type} la commande #${confirmAction.id} ?`}
          type="confirm"
          onClose={() => setConfirmAction(null)}
          onConfirm={() => updateStatut(confirmAction.id, confirmAction.type)}
        />
      )}
    </Layout>
  );
}

export default GestionCommandes;
