import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCommandesAdmin, deleteCommande } from "../api";
import Layout from "./Layout";
import "../styles/GestionCommandes.css";
import MessageModal from "./MessageModal"; // ✅ import

function CommandesAnnuleesAdmin() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [commandeASupprimer, setCommandeASupprimer] = useState(null);

  useEffect(() => {
    getCommandesAdmin()
      .then((res) => {
        const annulees = res.data.filter(c => c.statut === "ANNULEE");
        setCommandes(annulees);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setMessage("❌ Impossible de charger les commandes annulées.");
        setMessageType("error");
        setLoading(false);
      });
  }, []);

  const supprimerCommande = async (id) => {
    try {
      await deleteCommande(id);
      setCommandes(commandes.filter(c => c.id !== id));
      setMessage(`✅ Commande #${id} supprimée avec succès`);
      setMessageType("success");
    } catch (err) {
      console.error("Erreur suppression:", err);
      setMessage("❌ Erreur lors de la suppression de la commande.");
      setMessageType("error");
    } finally {
      setCommandeASupprimer(null); // ✅ fermer la modale
    }
  };

  if (loading) return <p>Chargement des commandes annulées...</p>;

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const commandesPage = commandes.slice(startIndex, endIndex);
  const totalPages = Math.ceil(commandes.length / pageSize);

  return (
    <Layout>
      <div className="gestion-commandes">
        <div className="gestion-titre">
          <h2>Commandes annulées</h2>
          <Link to="/espace-client" className="btn btn-outline-danger" >Commandes en attente</Link>
          
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
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => setCommandeASupprimer(commande.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="8">Aucune commande annulée.</td></tr>
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

        {/* ✅ Confirmation modal */}
        {commandeASupprimer && (
          <MessageModal
            message={`Voulez-vous vraiment supprimer la commande #${commandeASupprimer} ?`}
            type="confirm"
            onClose={() => setCommandeASupprimer(null)}
            onConfirm={() => supprimerCommande(commandeASupprimer)}
          />
        )}
      </div>
    </Layout>
  );
}

export default CommandesAnnuleesAdmin;
