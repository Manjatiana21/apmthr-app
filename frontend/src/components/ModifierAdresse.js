import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { modifierAdresse } from "../api"; // fonction utilitaire ajoutée dans api.js
import "../styles/ModifierAdresse.css";
import { Link } from "react-router-dom";


function ModifierAdresse() {
  const [adresse, setAdresse] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await modifierAdresse(adresse); // ✅ appel direct à l’API utilitaire
      setMessage("Adresse modifiée avec succès !");
      setTimeout(() => navigate("/modifier-profil"), 1500);
    } catch (error) {
      setMessage(error.response?.data?.detail || "Erreur lors de la modification.");
    }
  };

  return (
    <div className="modifier-adresse-container">
      <h2>Changer l'adresse</h2>
      <form onSubmit={handleSubmit} className="Form-input">
        <label>Nouvelle adresse :</label>
        <input
          type="text"
          value={adresse}
          placeholder="Entrez la nouvelle adresse"
          onChange={(e) => setAdresse(e.target.value)}
          required
        />
        <div id="btn-modification-profil">
        <button type="submit" className="Valide-btn">Valider</button>
        <button type="submit" className="annuler-btn">
        <Link to="/modifier-profil" className="btn btn-outline-danger" id="retour-btn">Annuler</Link></button>
        </div> 
      </form>
      {message && <p className="feedback">{message}</p>}
    </div>
  );
}

export default ModifierAdresse;
