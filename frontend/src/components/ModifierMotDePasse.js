import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { modifierMotdepasse } from "../api"; // fonction utilitaire
import "../styles/ModifierMDP.css";
import { Link } from "react-router-dom";


function ModifierMotDePasse() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await modifierMotdepasse(oldPassword, newPassword); // ✅ appel utilitaire
      setMessage("Mot de passe modifié avec succès !");
      setTimeout(() => navigate("/modifier-profil"), 1500);
    } catch (error) {
      setMessage(error.response?.data?.detail || "Erreur lors de la modification.");
    }
  };

  return (
    <div className="modifier-mdp-container">
      <h2>Changer le mot de passe</h2>
      <form onSubmit={handleSubmit} className="Form-input-MDP">
        <label>Ancien mot de passe :</label>
        <input
          type="password"
          value={oldPassword}
          placeholder="Entrez l'ancien mot de passe"
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />

        <label>Nouveau mot de passe :</label>
        <input
          type="password"
          value={newPassword}
          placeholder="Entrez le nouveau mot de passe"
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <div id="btn-modification-MDP">
        <button type="submit" className="Valide-btn">Valider</button>
        <button type="submit" className="annuler-btn">
        <Link to="/modifier-profil" className="btn btn-outline-danger" id="retour-btn">Annuler</Link></button>
        </div>
      </form>
      {message && <p className="feedback">{message}</p>}
    </div>
  );
}

export default ModifierMotDePasse;
