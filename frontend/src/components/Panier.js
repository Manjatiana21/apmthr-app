import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validerPanier, getModesPaiement } from "../api";
import "../styles/Panier.css";
import Layout from "./Layout";

function Panier() {
  const [cart, setCart] = useState([]);
  const [modes, setModes] = useState([]);
  const [formData, setFormData] = useState({
    adresse_livraison: "",
    mode_paiement: "",
  });
  const [numeroAdmin, setNumeroAdmin] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Charger panier uniquement depuis localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // Charger modes de paiement
  useEffect(() => {
    getModesPaiement()
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.results || res.data.modes || [];
        setModes(data);
      })
      .catch((err) => {
        console.error("Erreur API modes:", err);
        setModes([]);
      });
  }, []);

  // Gestion formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "mode_paiement") {
      const mode = modes.find((m) => m.id === parseInt(value));
      setNumeroAdmin(mode ? mode.numero_admin : "");
    }
  };

  // Modifier quantité
  const updateQuantity = (id, quantite) => {
    const newCart = cart.map((item) =>
      item.id === id ? { ...item, quantite: parseInt(quantite) } : item
    );
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // Supprimer produit
  const removeFromCart = (id) => {
    const newCart = cart.filter((item) => item.id !== id);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // Vider panier
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
    setMessage("Panier vidé !");
  };

  // Valider commande
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validerPanier(
        cart.map((item) => ({
          produit_id: item.produit_id || item.id, // ✅ fallback si produit_id existe
          quantite: item.quantite,
        })),
        formData.adresse_livraison,
        formData.mode_paiement
      );

      // ✅ Réinitialiser le panier côté frontend
      setMessage("Commande validée avec succès !");
      setCart([]);
      localStorage.removeItem("cart"); // supprimer le panier stocké
      // si tu as un badge global, pense à le remettre à zéro ici
      // ex: setBadgeCount(0);

      // ✅ Redirection après un petit délai
      setTimeout(() => navigate("/client-commandes"), 1500);
    } catch (error) {
      console.error("Erreur réseau :", error);
      setMessage("Erreur lors de la commande.");
    }
  };

  return (
    <Layout>
    <div className="panier-container">
      <h2>Mon Panier</h2>
      {cart.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <>
          <table className="panier-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Prix</th>
                <th>Quantité</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.designation}</td>
                  <td>{item.prix} Ar</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantite}
                      onChange={(e) => updateQuantity(item.id, e.target.value)}
                    />
                  </td>
                  <td>{item.prix * item.quantite} Ar</td>
                  <td>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="btn-supprimer"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Formulaire livraison + paiement */}
          <form onSubmit={handleSubmit} className="panier-form">
            <label className="Adresse-input">
              Adresse de livraison :
              <input 
                type="text"
                name="adresse_livraison"
                value={formData.adresse_livraison}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Mode de paiement :
              <select
                name="mode_paiement"
                value={formData.mode_paiement}
                className="MPaiement-input"
                onChange={handleChange}
                required
              >
                <option value="">Choisir un mode de paiement</option>
                {Array.isArray(modes) && modes.length > 0 ? (
                  modes.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.mode_paiement}
                    </option>
                  ))
                ) : (
                  <option disabled>Aucun mode disponible</option>
                )}
              </select>
            </label>

            {numeroAdmin && (
              <div className="numero-admin">
                <label>Numéro pour envoyer le paiement :</label>
                <input type="text" value={numeroAdmin} readOnly className="Numero-input"/>
              </div>
            )}

            <div className="panier-actions">
              <button type="submit" className="btn-valider">
                Valider la commande
              </button>
              <button type="button" onClick={clearCart} className="btn-vider">
                Vider le panier
              </button>
            </div>
          </form>
        </>
      )}
      {message && <p className="feedback">{message}</p>}
    </div>
    </Layout>
  );
}

export default Panier;
