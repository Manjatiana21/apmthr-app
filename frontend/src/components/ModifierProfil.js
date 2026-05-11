import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ModifierProfil.css";
import { Link } from "react-router-dom";
import Layout from "./Layout"; 
function ModifierProfil() {
  const navigate = useNavigate();

  return (
    <Layout>
    <div className="profil-container">
      <div className="profil-titre">
        <h2>Modifier les Informations personnels</h2>
        <Link to="/espace-client" className="btn btn-outline-danger" id="retour-btn">Retour</Link>
       </div>
      
      <div className="profil-options">
        <div>
        <button onClick={() => navigate("/profil/modifier-nom")}>
          Modifier le nom
        </button>
        </div>
        <div>
        <button onClick={() => navigate("/profil/modifier-email")}>
          Modifier l'email
        </button>
        </div>
        <div>
        <button onClick={() => navigate("/profil/modifier-telephone")}>
          Modifier le téléphone
        </button>
        </div>
        <div>
        <button onClick={() => navigate("/profil/modifier-adresse")}>
          Modifier l'adresse
        </button>
        </div>
        <div>
        <button onClick={() => navigate("/profil/modifier-motdepasse")}>
          Modifier le mot de passe
        </button>
        </div>
      </div>
      
    </div>
    </Layout>

  );
}

export default ModifierProfil;
