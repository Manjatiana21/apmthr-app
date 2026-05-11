// frontend/src/components/ProduitDetail.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "./Layout";   // ✅ hériter du Layout
import { getProduitById } from "../api"; // ✅ import API centralisée
import "../styles/ProduitDetail.css";

function ProduitDetail() {
  const { id } = useParams(); // récupère l'id du produit depuis l'URL
  const [produit, setProduit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getProduitById(id) // ✅ appel centralisé
      .then((res) => {
        setProduit(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setMessage("❌ Impossible de charger le produit.");
        setLoading(false);
      });
  }, [id]);

  return (
    <Layout>
      <div className="produit-card">
        {message && <p className="message">{message}</p>}
        {loading ? (
          <p>Chargement du produit...</p>
        ) : (
          <>
            <img
              src={produit.image ? produit.image : "/placeholder.png"}
              alt={produit.designation}
              className="produit-image"
            />
            <div className="produit-info">
              <h2>{produit.designation}</h2>
              <p>{produit.description}</p>
              <p className="prix">Prix : {produit.prix} Ar</p>
              <Link to={`/commande/${produit.id}`} className="btn-commande">
                Passer commande
              </Link>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default ProduitDetail;
