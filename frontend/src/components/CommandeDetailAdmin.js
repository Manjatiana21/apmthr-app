import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCommandeDetailAdmin } from "../api";
import Layout from "./Layout";

function CommandeDetailAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCommandeDetailAdmin(id)
      .then((res) => {
        setCommande(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Chargement du détail de la commande...</p>;
  if (!commande) return <p>Commande introuvable.</p>;

  return (
    <Layout>
      <div className="commande-detail">
        <h2>Détail de la commande #{commande.id}</h2>
        <p><strong>Client :</strong> {commande.client?.username}</p>
        <p><strong>Date :</strong> {commande.date_commande}</p>
        <p><strong>Total :</strong> {commande.total} Ar</p>
        <p><strong>Statut :</strong> {commande.statut}</p>

        <h3>Produits</h3>
        {commande.details && commande.details.length > 0 ? (
          <ul>
            {commande.details.map((d) => (
              <li key={d.id}>
                {d.produit?.designation} (x{d.quantite}) - {d.prix_unitaire} Ar
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun produit dans cette commande.</p>
        )}

        {/* ✅ Bouton Retour */}
        <div className="btn-retour">
          <button onClick={() => navigate(-1)} className="btn-back">
            ← Retour
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default CommandeDetailAdmin;
