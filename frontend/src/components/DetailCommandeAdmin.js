import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCommande, validerCommande, annulerCommande } from "../api";
import "../styles/DetailCommandeAdmin.css";
import MessageModal from "./MessageModal"; // ✅ import

function DetailCommandeAdmin() {
  const { id } = useParams();
  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [confirmAction, setConfirmAction] = useState(null); // ✅ pour confirmation

  // Charger la commande
  useEffect(() => {
    getCommande(id)
      .then((res) => {
        setCommande(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setMessage("❌ Impossible de charger la commande.");
        setMessageType("error");
        setLoading(false);
      });
  }, [id]);

  // Mettre à jour le statut
  const updateStatut = async (nouveauStatut) => {
    try {
      let res;
      if (nouveauStatut === "VALIDE") {
        res = await validerCommande(id);
      } else if (nouveauStatut === "ANNULEE") {
        res = await annulerCommande(id);
      } else {
        // ⚠️ Exemple pour "EN COURS"
        res = await validerCommande(id);
      }

      setCommande(res.data);
      setMessage(`✅ Statut mis à jour : ${nouveauStatut}`);
      setMessageType("success");
    } catch (err) {
      console.error("Erreur mise à jour:", err);
      setMessage("❌ Erreur lors de la mise à jour du statut.");
      setMessageType("error");
    } finally {
      setConfirmAction(null); // ✅ fermer la modale
    }
  };

  if (loading) return <p>Chargement de la commande...</p>;
  if (!commande) return <p>Aucune commande trouvée.</p>;

  return (
    <div className="commande-admin-detail">
      <h2>Détails de la commande</h2>
      <p><strong>Client :</strong> {commande.client?.username}</p>
      <p><strong>Date :</strong> {new Date(commande.date_commande).toLocaleDateString("fr-FR")}</p>
      <p><strong>Statut :</strong> 
        <span className={`badge statut-${commande.statut.toLowerCase()}`}>
          {commande.statut}
        </span>
      </p>
      <p><strong>Total :</strong> {commande.total} Ar</p>

      <h3>Produits commandés :</h3>
      <table className="table-produits">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Quantité</th>
            <th>Prix unitaire</th>
            <th>Sous-total</th>
          </tr>
        </thead>
        <tbody>
          {commande.details?.length > 0 ? (
            commande.details.map((detail) => (
              <tr key={detail.id}>
                <td>{detail.produit.designation}</td>
                <td>{detail.quantite}</td>
                <td>{detail.prix_unitaire} Ar</td>
                <td>{detail.sous_total} Ar</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Aucun produit dans cette commande.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="actions">
        <Link to="/admin/commandes" className="btn-retour">← Retour à la gestion des commandes</Link>
        <div className="btn-group">
          <button onClick={() => setConfirmAction("VALIDE")} className="btn-valide">Valider</button>
          <button onClick={() => setConfirmAction("EN COURS")} className="btn-encours">Mettre en cours</button>
          <button onClick={() => setConfirmAction("ANNULEE")} className="btn-annuler">Annuler</button>
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
          message={`Voulez-vous vraiment mettre la commande en statut "${confirmAction}" ?`}
          type="confirm"
          onClose={() => setConfirmAction(null)}
          onConfirm={() => updateStatut(confirmAction)}
        />
      )}
    </div>
  );
}

export default DetailCommandeAdmin;
