import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { modifierTelephone } from "../api"; // fonction utilitaire
import "../styles/ModifierTelephone.css";
import { Link } from "react-router-dom";


function ModifierTelephone() {
  const [telephone, setTelephone] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await modifierTelephone(telephone);
      setMessage("Téléphone modifié avec succès !");
      setTimeout(() => navigate("/modifier-profil"), 1500);
    } catch (error) {
      setMessage(error.response?.data?.detail || "Erreur lors de la modification.");
    }
  };

  return (
    <div className="modifier-telephone-container">
      <h2>Changer le téléphone</h2>
      <form onSubmit={handleSubmit} className="Form-input">
        <label>Nouveau numéro :</label>
        <input
          type="telephone"
          value={telephone}
          placeholder="Entrez le nouveau numéro"
          onChange={(e) => setTelephone(e.target.value)}
          required
        />
        <button type="submit" className="Valide-btn">Valider</button>
        <button type="submit" className="annuler-btn">
        <Link to="/modifier-profil" className="btn btn-outline-danger" id="retour-btn">Annuler</Link></button>
      </form>
      {message && <p className="feedback">{message}</p>}
    </div>
  );
}

export default ModifierTelephone;
