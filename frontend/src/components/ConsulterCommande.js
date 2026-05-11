import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getCommande, annulerCommande as apiAnnulerCommande } from "../api";
import "../styles/ConsulterCommande.css";
import Layout from "./Layout";
import MessageModal from "./MessageModal"; // ✅ import

function ConsulterCommande() {
  const { id } = useParams(); 
  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [confirmAnnulation, setConfirmAnnulation] = useState(false); // ✅ pour confirmation
  const navigate = useNavigate();

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

  // Annuler la commande
  const annulerCommande = async () => {
    try {
      const res = await apiAnnulerCommande(id);
      setCommande(res.data);
      setMessage("✅ Commande annulée avec succès !");
      setMessageType("success");
      navigate("/mes-commandes"); // ✅ redirection
    } catch (err) {
      console.error("Erreur annulation:", err);
      setMessage("❌ Erreur lors de l'annulation de la commande.");
      setMessageType("error");
    } finally {
      setConfirmAnnulation(false); // ✅ fermer la modale
    }
  };

  if (loading) return <p>Chargement de la commande...</p>;
  if (!commande) return <p>Aucune commande trouvée.</p>;

  return (
    <Layout>
      <div className="commande-detail">
        <h2>Détails de la commande #{commande.id}</h2>
        <p><strong>Client :</strong> {commande.client?.username}</p>
        <p><strong>Date :</strong> {commande.date_commande}</p>
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
          <Link to="/catalogue" className="btn-retour">← Retour au catalogue</Link>
          {commande.statut !== "VALIDE" && (
            <button className="btn-annuler" onClick={() => setConfirmAnnulation(true)}>
              Annuler la commande
            </button>
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
      {confirmAnnulation && (
        <MessageModal
          message="Voulez-vous vraiment annuler cette commande ?"
          type="confirm"
          onClose={() => setConfirmAnnulation(false)}
          onConfirm={annulerCommande}
        />
      )}
    </Layout>
  );
}

export default ConsulterCommande;
