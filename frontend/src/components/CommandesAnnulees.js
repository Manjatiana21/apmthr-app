import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/CommandesAnnulees.css";
import Layout from "./Layout";
import { formatDate } from "../utils/formatDate";
import { getCommandesAnnulees, deleteCommandesSelection } from "../api";
import MessageModal from "./MessageModal"; // ✅ import

function CommandesAnnulees() {
  const [commandes, setCommandes] = useState([]);
  const [selection, setSelection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [confirmDelete, setConfirmDelete] = useState(false); // ✅ pour confirmation

  useEffect(() => {
    getCommandesAnnulees()
      .then((res) => {
        if (Array.isArray(res.data)) {
          // ✅ liste simple
          setCommandes(res.data);
        } else {
          // ✅ objet paginé
          setCommandes(res.data.results || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setMessage("❌ Impossible de charger les commandes annulées.");
        setMessageType("error");
        setLoading(false);
      });
  }, []);



  const toggleSelection = (id) => {
    setSelection((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selection.length === commandes.length) {
      setSelection([]);
    } else {
      setSelection(commandes.map((c) => c.id));
    }
  };

  const effacerSelection = async () => {
    if (selection.length === 0) {
      setMessage("❌ Veuillez sélectionner au moins une commande.");
      setMessageType("error");
      return;
    }
    setConfirmDelete(true); // ✅ ouvrir la modale de confirmation
  };

  const confirmDeleteAction = async () => {
    try {
      await deleteCommandesSelection(selection);
      setCommandes(commandes.filter((c) => !selection.includes(c.id)));
      setSelection([]);
      setMessage("✅ Commandes sélectionnées supprimées !");
      setMessageType("success");
    } catch (err) {
      console.error("Erreur suppression:", err);
      setMessage("❌ Erreur lors de la suppression des commandes.");
      setMessageType("error");
    } finally {
      setConfirmDelete(false); // ✅ fermer la modale
    }
  };

  if (loading) return <p>Chargement des commandes annulées...</p>;

  return (
    <Layout>
      <div className="commandes-annulees">
        <div className="header-CA">
          <h2>Commandes annulées</h2>
          <div className="actions">
            <button className="btn-select" onClick={selectAll}>
              {selection.length === commandes.length ? "Désélectionner tout" : "Sélectionner tout"}
            </button>
            <button className="btn-effacer" onClick={effacerSelection}>
              🗑️ Effacer sélection
            </button>
          </div>
        </div>

        <table className="table-annulees">
          <thead>
            <tr>
              <th></th>
              <th>Désignation</th>
              <th>Quantité</th>
              <th>Date</th>
              <th>Total</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {commandes.length > 0 ? (
              commandes.map((commande) =>
                commande.details && commande.details.length > 0 ? (
                  commande.details.map((detail) => (
                    <tr key={detail.id}>
                      <td data-label="Sélectionner">
                        <input
                          type="checkbox"
                          checked={selection.includes(commande.id)}
                          onChange={() => toggleSelection(commande.id)}
                        />
                      </td>
                      <td data-label="Produit">{detail.produit?.designation}</td>
                      <td data-label="Qté">{detail.quantite}</td>
                      <td data-label="Date">{formatDate(commande.date_commande)}</td>
                      <td data-label="Total">{commande.total} Ar</td>
                      <td>
                        <span className="badge badge-annulee">{commande.statut}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr key={commande.id}>
                    <td colSpan="6">Aucun produit trouvé pour cette commande</td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan="6">Aucune commande annulée</td>
              </tr>
            )}
          </tbody>
        </table>

        <Link to="/client-commandes" className="btn btn-outline-danger">Retour à mes commandes</Link>
      </div>

      {/* ✅ Message modal */}
      <MessageModal
        message={message}
        type={messageType}
        onClose={() => setMessage("")}
      />

      {/* ✅ Confirmation modal */}
      {confirmDelete && (
        <MessageModal
          message="Voulez-vous vraiment supprimer les commandes sélectionnées ?"
          type="confirm"
          onClose={() => setConfirmDelete(false)}
          onConfirm={confirmDeleteAction}
        />
      )}
    </Layout>
  );
}

export default CommandesAnnulees;
