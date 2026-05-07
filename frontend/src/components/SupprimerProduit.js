// frontend/src/components/SupprimerProduit.js
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "./Layout";   // ✅ hériter du Layout
import { getProduitById, deleteProduit } from "../api"; // ✅ import API centralisée
import "../styles/SupprimerProduit.css";

function SupprimerProduit() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const handleDelete = async () => {
    if (window.confirm("Es-tu sûr de vouloir supprimer ce produit ? Cette action est irréversible.")) {
      try {
        await deleteProduit(id); // ✅ appel centralisé
        alert("✅ Produit supprimé avec succès !");
        navigate("/catalogue-admin");
      } catch (err) {
        console.error("Erreur suppression:", err);
        setMessage("❌ Erreur lors de la suppression du produit.");
      }
    }
  };

  return (
    <Layout>
      <div className="supprimer-produit">
        {message && <p className="message">{message}</p>}
        {loading ? (
          <p>Chargement du produit...</p>
        ) : (
          <>
            <h2>Supprimer le produit : {produit.designation}</h2>
            <p>Es-tu sûr de vouloir supprimer ce produit ? Cette action est irréversible.</p>
            <button className="btn-danger" onClick={handleDelete}>Oui, supprimer</button>
            <Link to="/catalogue-admin" className="btn-secondary">Annuler</Link>
          </>
        )}
      </div>
    </Layout>
  );
}

export default SupprimerProduit;
