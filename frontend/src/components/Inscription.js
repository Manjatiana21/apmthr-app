import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api"; 
import "../styles/Inscription.css";

function Inscription() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    adresse: "",
    telephone: "",
    password1: "",
    password2: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // 🔎 Vérification côté frontend
    if (formData.password1 !== formData.password2) {
      setMessage("❌ Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
      // ✅ Payload JSON attendu par ton serializer
      const payload = {
        username: formData.username,
        email: formData.email,
        adresse: formData.adresse,
        telephone: formData.telephone,
        password1: formData.password1,
        password2: formData.password2,
      };

      const res = await register(payload);

      if (res.status === 201) {
        setMessage("✅ Inscription réussie !");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage("❌ Erreur lors de l'inscription");
      }
    } catch (err) {
      console.error("Erreur inscription:", err.response?.data || err);
      // ✅ Affichage des erreurs backend
      setMessage("❌ " + JSON.stringify(err.response?.data));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inscription-container">
      <div className="inscription-box">
        <h2>Créer un compte</h2>
        <form onSubmit={handleSubmit}>
          <div className="Form-box">
            <div className="form-group">
              <input
                type="text"
                name="username"
                placeholder="Nom d'utilisateur"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="telephone"
                placeholder="Téléphone"
                value={formData.telephone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="Form-box">
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="adresse"
                placeholder="Adresse"
                value={formData.adresse}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="Form-box">
            <div className="form-group">
              <input
                type="password"
                name="password1"
                placeholder="Mot de passe"
                value={formData.password1}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="password2"
                placeholder="Confirmer le mot de passe"
                value={formData.password2}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-register" disabled={loading}>
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        {message && <p className="message">{message}</p>}

        <p className="connexion-text">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}

export default Inscription;
