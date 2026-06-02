import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { modifierNom } from "../api"; 
import "../styles/ModifierNom.css";
import { Link } from "react-router-dom";



function ModifierNom() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await modifierNom(username); // ✅ appel utilitaire
      setMessage("Nom modifié avec succès !");
      setTimeout(() => navigate("/modifier-profil"), 1500);
    } catch (error) {
      setMessage(error.response?.data?.detail || "Erreur lors de la modification.");
    }
  };

  return (
    <div className="modifier-nom-container">
      <h2>Changer le nom</h2>
      <form onSubmit={handleSubmit} className="Form-input" id="Input-Form-Nom">
        <label>Nouveau nom :</label>
        <input
          type="text"
          value={username}
          placeholder="Entrez le nouveau nom"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <div className="btn-nom-modification" id="btn-modification-profil-nom" >
          <button type="submit" className="Valide-btn">Valider</button>
          <button type="submit" className="annuler-btn">
          <Link to="/modifier-profil" className="btn btn-outline-danger" id="retour-btn">Annuler</Link></button>
        </div>
      </form>
      {message && <p className="feedback">{message}</p>}
    </div>
  );
}

export default ModifierNom;
