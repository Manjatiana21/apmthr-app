import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { modifierEmail } from "../api"; // fonction utilitaire ajoutée dans api.js
import "../styles/ModifierEmail.css";
import { Link } from "react-router-dom";


function ModifierEmail() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await modifierEmail(email); // ✅ appel direct à l’API utilitaire
      setMessage("Email modifié avec succès !");
      setTimeout(() => navigate("/modifier-profil"), 1500);
    } catch (error) {
      setMessage(error.response?.data?.detail || "Erreur lors de la modification.");
    }
  };

  return (
    <div className="modifier-email-container">
      <h2>Changer l'email</h2>
      <form onSubmit={handleSubmit} className="Form-input">
        <label>Nouvel email :</label>
        <input
          type="email"
          value={email}
          placeholder="Entrez le nouvel email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div id="btn-modification-profil-email">
          <button type="submit" className="Valide-btn">Valider</button>
          <button type="submit" className="annuler-btn">
          <Link to="/modifier-profil" className="btn btn-outline-danger" id="retour-btn">Annuler</Link></button>
        </div>
      </form>
      {message && <p className="feedback">{message}</p>}
    </div>
  );
}

export default ModifierEmail;
