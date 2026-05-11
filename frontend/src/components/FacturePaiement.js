import React, { useEffect, useState } from "react";
import { getPaiementDetail, genererFacture, envoyerFacture } from "../api";
import { useParams } from "react-router-dom";
import Layout from "./Layout";

function FacturePage() {
  const { id } = useParams(); // paiement_id
  const [paiement, setPaiement] = useState(null);
  const [facture, setFacture] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getPaiementDetail(id).then((data) => setPaiement(data));
  }, [id]);

  const handleGenerate = async () => {
    try {
      const res = await genererFacture(id);
      setFacture(res);
      setMessage("✅ Facture générée avec succès !");
    } catch (err) {
      setMessage("❌ Erreur lors de la génération de la facture.");
    }
  };

  const handleSend = async () => {
    try {
      await envoyerFacture(facture.id);
      setMessage("✅ Facture envoyée au client !");
    } catch (err) {
      setMessage("❌ Erreur lors de l’envoi de la facture.");
    }
  };

  if (!paiement) return <p>Chargement...</p>;

  return (
    <Layout>
      <div className="facture-container">
        <img src="/logo.png" alt="Logo" className="logo" />
        <h2>Préparation de la facture</h2>
        <p>Client: {paiement.client}</p>
        <p>Montant: {paiement.montant} Ar</p>

        <h3>Produits</h3>
        <table>
          <thead>
            <tr>
              <th>Désignation</th>
              <th>Quantité</th>
              <th>Prix unitaire</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {paiement.commande.details.map((d) => (
              <tr key={d.id}>
                <td>{d.produit}</td>
                <td>{d.quantite}</td>
                <td>{d.prix_unitaire} Ar</td>
                <td>{d.quantite * d.prix_unitaire} Ar</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Total à payer : {paiement.montant} Ar</h3>

        <div className="actions">
          {!facture && (
            <button className="btn btn-primary" onClick={handleGenerate}>
              Générer la facture
            </button>
          )}
          {facture && (
            <button className="btn btn-success" onClick={handleSend}>
              Envoyer au client
            </button>
          )}
        </div>

        {message && <p>{message}</p>}
      </div>
    </Layout>
  );
}

export default FacturePage;
