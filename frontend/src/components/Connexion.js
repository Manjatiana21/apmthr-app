// frontend/src/components/Connexion.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api";
import "../styles/Connexion.css";

function Connexion() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!loading) { // ✅ empêcher modification pendant chargement
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await login(formData);

      if (res.data.access && res.data.refresh) {
        // ✅ Stockage du token et du rôle
        localStorage.setItem("access_token", res.data.access);
        localStorage.setItem("refresh_token", res.data.refresh);
        localStorage.setItem("role", res.data.role);

        // ✅ Redirection selon rôle
        if (res.data.role === "ADMIN") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/espace-client", { replace: true });
        }
      } else {
        setMessage("❌ Identifiants invalides");
      }
    } catch (err) {
      console.error("❌ Erreur connexion:", err.response?.data || err);
      setMessage("❌ Identifiants invalides");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="connexion-container">
      <div className="connexion-box">
        <h2>Connexion</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom d'utilisateur :</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={loading} // ✅ grisé pendant chargement
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe :</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading} // ✅ grisé pendant chargement
              required
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? (
              <span className="loading-dots">Connexion<span>.</span><span>.</span><span>.</span></span>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        {/* ✅ Affichage uniquement pour erreur */}
        {message && <p className="message error">{message}</p>}

        <p className="inscription-text">
          Pas encore de compte ? <Link to="/inscription">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}

export default Connexion;
