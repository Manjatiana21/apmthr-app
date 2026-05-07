import React, { useState } from "react";
import { addMouvement } from "../api"; 
import "../styles/Stock.css";
import Layout from "./Layout";


function AjouterMouvement() {
  const [formData, setFormData] = useState({
    produit: "",
    type_mouvement: "",
    quantite: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // appel via api.js
      const response = await addMouvement(formData);

      setMessage("✅ Mouvement enregistré avec succès !");
      setFormData({ produit: "", type_mouvement: "", quantite: "" }); // reset form
    } catch (error) {
      console.error(error);
      if (error.response) {
        setMessage("❌ Erreur: " + JSON.stringify(error.response.data));
      } else {
        setMessage("❌ Erreur lors de l'enregistrement");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
    <div className="stock-container">
      <h2>Ajouter un mouvement de stock</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="produit"
          placeholder="Produit"
          value={formData.produit}
          onChange={handleChange}
        />
        <select
          name="type_mouvement"
          value={formData.type_mouvement}
          onChange={handleChange}
        >
          <option value="">Choisir type</option>
          <option value="ENTREE">Entrée</option>
          <option value="SORTIE">Sortie</option>
        </select>
        <input
          name="quantite"
          type="number"
          placeholder="Quantité"
          value={formData.quantite}
          onChange={handleChange}
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
    </Layout>
  );
}

export default AjouterMouvement;
