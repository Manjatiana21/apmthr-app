import React, { useEffect, useState } from "react";
import { getPaiementDetail, genererFacture, envoyerFacture, downloadFacturePDF } from "../api";
import { useParams } from "react-router-dom";
import Layout from "./Layout";
import "../styles/facture.css";
import logoImg from "../assets/Logo.png";
import MessageModal from "./MessageModal"; 

function FacturePage() {
  const { id } = useParams(); // paiement_id
  const [paiement, setPaiement] = useState(null);
  const [facture, setFacture] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [confirmAction, setConfirmAction] = useState(null); // pour confirmation

  useEffect(() => {
    getPaiementDetail(id)
      .then((data) => {
        setPaiement(data);
        if (data.commande?.facture) {
          setFacture(data.commande.facture);
          setMessage(`✅ Facture déjà générée (N° ${data.commande.facture.numero})`);
          setMessageType("success");
        }
      })
      .catch(() => {
        setMessage("❌ Erreur lors du chargement du paiement.");
        setMessageType("error");
      });
  }, [id]);

  const handleGenerate = async () => {
    try {
      const res = await genererFacture(id);
      setFacture(res);
      setMessage(`✅ Facture générée avec succès (N° ${res.numero})`);
      setMessageType("success");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "❌ Erreur lors de la génération de la facture.";
      setMessage(errorMsg);
      setMessageType("error");
    } finally {
      setConfirmAction(null);
    }
  };

  const handleSend = async () => {
    try {
      await envoyerFacture(facture.id);
      setFacture({ ...facture, envoyee: true });
      setMessage("✅ Facture envoyée au client !");
      setMessageType("success");
    } catch (err) {
      setMessage("❌ Erreur lors de l’envoi de la facture.");
      setMessageType("error");
    } finally {
      setConfirmAction(null);
    }
  };

  const handleDownload = async () => {
    try {
      const pdf = await downloadFacturePDF(facture.id);
      const url = window.URL.createObjectURL(new Blob([pdf]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `facture_${facture.numero}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      setMessage("❌ Erreur lors du téléchargement de la facture.");
      setMessageType("error");
    }
  };

  if (!paiement && !facture) return <p>Chargement...</p>;

  const data = facture || paiement;

  return (
    <Layout>
      <div className="facture-container">
        <img src={logoImg} alt="Logo" className="logo" />
        <h2>{facture ? "Facture générée" : "Préparation de la facture"}</h2>

        <div className="facture-header">
          <div className="client-info">
            {facture?.client ? (
              <>
                <p><strong>Client :</strong> {facture.client.username}</p>
                <p><strong>Email :</strong> {facture.client.email || "Non renseigné"}</p>
                <p><strong>Adresse :</strong> {facture.client.adresse || "Non renseignée"}</p>
                <p><strong>Téléphone :</strong> {facture.client.telephone || "Non renseigné"}</p>
              </>
            ) : (
              <p>Chargement des informations du client...</p>
            )}
          </div>
          <div className="association-info">
            <h2 className="APMTHR">APMTHR</h2>
            <p><strong>Numéro :</strong> 034 09 071 90</p>
            <p>aapmthr@gmail.com</p>
            <p>AK 97 Ankadikely Ilafy, Antananarivo 103</p>
          </div>
        </div>

        {facture?.paiement && (
          <>
            <p><strong>Mode de paiement :</strong> {facture.paiement.mode_paiement}</p>
            <p><strong>Date de paiement :</strong> {facture.paiement.date_paiement}</p>
          </>
        )}

        <p><strong>Montant :</strong> {data.montant_total || data.montant} Ar</p>

        <h3>Détails de la commande</h3>
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
            {(data.commande?.details || []).map((d) => (
              <tr key={d.id}>
                <td>{d.produit}</td>
                <td>{d.quantite}</td>
                <td>{d.prix_unitaire} Ar</td>
                <td>{d.quantite * d.prix_unitaire} Ar</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Total à payer : {data.montant_total || data.montant} Ar</h3>

        <div className="actions">
          {!facture && (
            <button className="btn btn-primary" onClick={() => setConfirmAction("GENERER")}>
              Générer la facture
            </button>
          )}

          {facture && (
            <button className="btn btn-secondary" disabled>
              Facture générée (N° {facture.numero})
            </button>
          )}

          {facture && !facture.envoyee && (
            <button className="btn btn-success" onClick={() => setConfirmAction("ENVOYER")}>
              Envoyer au client
            </button>
          )}

          {facture && (
            <button className="btn btn-secondary" onClick={handleDownload}>
              Télécharger / Imprimer
            </button>
          )}
        </div>
      </div>

      {/* ✅ Message modal */}
      <MessageModal
        message={message}
        type={messageType}
        onClose={() => setMessage("")}
      />

      {/* ✅ Confirmation modal */}
      {confirmAction === "GENERER" && (
        <MessageModal
          message="Voulez-vous vraiment générer cette facture ?"
          type="confirm"
          onClose={() => setConfirmAction(null)}
          onConfirm={handleGenerate}
        />
      )}
      {confirmAction === "ENVOYER" && (
        <MessageModal
          message="Voulez-vous vraiment envoyer cette facture au client ?"
          type="confirm"
          onClose={() => setConfirmAction(null)}
          onConfirm={handleSend}
        />
      )}
    </Layout>
  );
}

export default FacturePage;
