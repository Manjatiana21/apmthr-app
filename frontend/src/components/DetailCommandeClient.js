// frontend/src/components/DetailCommandeClient.js
import React, { useState } from "react";
import "../styles/DetailCommandeClient.css";
import { formatDate } from "../utils/formatDate";
import { annulerCommandeClient } from "../api";
import MessageModal from "./MessageModal"; // ✅ import

function DetailCommandeClient({ commande: initialCommande }) {
  const [commande, setCommande] = useState(initialCommande);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [confirmAnnulation, setConfirmAnnulation] = useState(false); // ✅ pour confirmation

  // Annuler la commande
  const handleAnnuler = async () => {
    try {
      const res = await annulerCommandeClient(commande.id);
      setMessage("✅ Votre commande a été annulée.");
      setMessageType("success");
      setCommande(res.data); // ✅ mettre à jour l'état local
    } catch (err) {
      console.error("Erreur annulation:", err);
      setMessage("❌ Erreur lors de l'annulation de la commande.");
      setMessageType("error");
    } finally {
      setConfirmAnnulation(false); // ✅ fermer la modale
    }
  };

  if (!commande) return null;

  return (
    <div className="commande-client-detail">
      <h2>📦 Détails de la commande</h2>

      <div className="commande-info">
        <p><strong>Client :</strong> {commande.client?.username}</p>
        <p><strong>Date :</strong> {formatDate(commande.date_commande)}</p>
        <p><strong>Statut :</strong> {commande.statut}</p>
        <p><strong>Total :</strong> {commande.total} Ar</p>
      </div>

      <h4>Produits commandés :</h4>
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
          {commande.details && commande.details.length > 0 ? (
            commande.details.map((detail) => (
              <tr key={detail.id}>
                <td data-label="Désignation">{detail.produit?.designation}</td>
                <td data-label="Qté">{detail.quantite}</td>
                <td data-label="Prix.U">{detail.prix_unitaire} Ar</td>
                <td data-label="Prix Total">{detail.sous_total} Ar</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Aucun produit trouvé.</td>
            </tr>
          )}
        </tbody>
      </table>

      <h4>Paiement :</h4>
      <div className="paiement">
        {commande.paiements && commande.paiements.length > 0 ? (
          commande.paiements.map((p) => (
            <p key={p.id}>
              {p.mode_paiement} {p.montant} Ar ({formatDate(p.date_paiement)})
            </p>
          ))
        ) : (
          <p>Aucun paiement enregistré.</p>
        )}
      </div>

      <div className="actions" id="annulee_la_commande">
        {commande.statut !== "VALIDEE" && commande.statut !== "ANNULEE" ? (
          <button onClick={() => setConfirmAnnulation(true)} className="btn-annuler">
            ❌ Annuler la commande
          </button>
        ) : null}
      </div>

      {/* ✅ Message modal */}
      <MessageModal
        message={message}
        type={messageType}
        onClose={() => setMessage("")}
      />

      {/* ✅ Confirmation modal */}
      {confirmAnnulation && (
        <MessageModal
          message="Voulez-vous vraiment annuler cette commande ?"
          type="confirm"
          onClose={() => setConfirmAnnulation(false)}
          onConfirm={handleAnnuler}
        />
      )}
    </div>
  );
}

export default DetailCommandeClient;
