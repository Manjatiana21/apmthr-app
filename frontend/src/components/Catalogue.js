// frontend/src/components/Catalogue.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProduits } from "../api";
import "../styles/Catalogue.css";
import Layout from "./Layout";

function Catalogue() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    getProduits()
      .then((response) => {
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.results || response.data.produits || [];
        setProduits(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setError("Impossible de charger les produits.");
        setLoading(false);
      });
  }, []);

  // ✅ Fonction pour ajouter un produit au panier
  const addToCart = (produit) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item.id === produit.id);
    if (existing) {
      existing.quantite += 1;
    } else {
      cart.push({ ...produit, quantite: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // 🔑 Déclenche un event pour que Layout.js mette à jour le badge
    window.dispatchEvent(new Event("storage"));

    // Feedback utilisateur
    setMessage(`${produit.designation} ajouté au panier !`);
    setTimeout(() => setMessage(""), 2000);
  };

  if (loading) return <p>Chargement des produits...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <Layout>
      <div className="catalogue">
        <h2>Nos Produits</h2>
        <div className="catalogue-paragraphe">
          <p className="FAITMAIN">Le fait main, le vrai goût, et l'authentique.</p>
          <p className="CHOISISSEZ">Trouvez, choisissez, profitez -- votre satisfaction commence ici !</p>
        </div>

        {/* Message de feedback */}
        {message && <p className="feedback">{message}</p>}

        <div className="grid-produits">
          {produits.length > 0 ? (
            produits.map((produit) => (
              
              <div key={produit.id} className="carte-produit">
                <img
                  src={produit.image ? produit.image : "/default.png"}
                  alt={produit.designation}
                  className="produit-image"
                />
                <div className="carte-produit1">
                <h3>{produit.designation}</h3>
                <div className="P-Prix">
                  <p className="prix">{produit.prix} Ar</p>
                </div>
                {produit.description && (
                  <p className="description">{produit.description}</p>
                )}
                {produit.type_produit && (
                  <p className="type">Type : {produit.type_produit.libelleTP}</p>
                )}
                {produit.fournisseur && (
                  <p className="fournisseur">Fournisseur : {produit.fournisseur.nom}</p>
                )}
                <div className="Boutton_commande">
                  <button onClick={() => addToCart(produit)} className="btn-panier">
                    Ajouter au panier 🛒
                  </button>
                  
                <Link to={`/passer-commande/${produit.id}`} className="btn-commande">
                  Passer commande
                </Link>

                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Aucun produit disponible</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Catalogue;
