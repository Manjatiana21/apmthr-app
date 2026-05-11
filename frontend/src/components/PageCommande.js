// frontend/src/components/PageCommande.js
import React, { useState } from "react";
import Layout from "./Layout";
import PasserCommande from "./PasserCommande";
import DetailCommandeClient from "./DetailCommandeClient";
import "../styles/PageCommande.css";

function PageCommande() {
  const [commande, setCommande] = useState(null);

  // Callback appelé quand une commande est passée
  const handleCommandeSuccess = (data) => {
    setCommande(data); // ✅ stocke la commande pour l’afficher à droite
  };

  return (
    <Layout>
      <div className="page-commande">
        <div className="col-gauche">
          {/* ✅ PasserCommande transmet la commande au parent */}
          <PasserCommande onCommandeSuccess={handleCommandeSuccess} />
        </div>
        <div className="col-droite">
          {commande ? (
            <DetailCommandeClient commande={commande} />
          ) : (
            <p className="info">⚡ Passez une commande pour voir les détails ici</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default PageCommande;
