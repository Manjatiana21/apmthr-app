// src/components/FactureDetailPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFactureDetail, envoyerFacture, downloadFacturePDF } from "../api";
import Layout from "./Layout";
import "../styles/facture.css";
import logoImg from "../assets/Logo.png";
import MessageModal from "./MessageModal"; 

function FactureDetailPage() {
  const { id } = useParams();
  const [facture, setFacture] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [confirmSend, setConfirmSend] = useState(false); 

  useEffect(() => {
    getFactureDetail(id)
      .then((data) => setFacture(data))
      .catch(() => {
        setMessage("❌ Erreur lors du chargement de la facture.");
        setMessageType("error");
      });
  }, [id]);

  if (!facture && !message) return <Layout><p>Chargement de la facture...</p></Layout>;
  if (!facture && message) return (
    <Layout>
      <MessageModal
        message={message}
        type={messageType}
        onClose={() => setMessage("")}
      />
    </Layout>
  );

  const handleSend = async () => {
    try {
      await envoyerFacture(facture.id);
      setFacture({ ...facture, envoyee: true });
      setMessage("✅ Facture envoyée au client !");
      setMessageType("success");
    } catch {
      setMessage("❌ Erreur lors de l’envoi de la facture.");
      setMessageType("error");
    } finally {
      setConfirmSend(false); // ✅ fermer la modale
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
    } catch {
      setMessage("❌ Erreur lors du téléchargement de la facture.");
      setMessageType("error");
    }
  };

  return (
    <Layout>
      <div className="facture-detail">
        <img src={logoImg} alt="Logo" className="logo" />
        <h2 className="title"> Facture N° {facture.numero}</h2>

        <div className="facture-header">
          <div className="client-info">
            <h3>Client</h3>
            <p><strong>Nom :</strong> {facture.client?.username}</p>
            <p><strong>Email :</strong> {facture.client?.email || "Non renseigné"}</p>
            <p><strong>Adresse :</strong> {facture.client?.adresse || "Non renseignée"}</p>
            <p><strong>Téléphone :</strong> {facture.client?.telephone || "Non renseigné"}</p>
          </div>
          <div className="association-info">
            <h2 className="APMTHR">APMTHR</h2>
            <p><strong>Numéro :</strong> 034 09 071 90</p>
            <p>aapmthr@gmail.com</p>
            <p>AK 97 Ankadikely Ilafy, Antananarivo 103</p>
          </div>
        </div>

        {facture.paiement && (
          <div className="paiement-info">
            <h3>Paiement</h3>
            <p><strong>Mode :</strong> {facture.paiement.mode_paiement}</p>
            <p><strong>Date :</strong> {new Date(facture.paiement.date_paiement).toLocaleDateString()}</p>
          </div>
        )}

        <div className="commande-section">
          <table className="table-facture">
            <thead>
              <tr>
                <th>Désignation</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {(facture.commande?.details || []).map((d) => (
                <tr key={d.id}>
                  <td data-label="Produit">{d.produit}</td>
                  <td data-label="Qté">{d.quantite}</td>
                  <td data-label="Prix U">{d.prix_unitaire} Ar</td>
                  <td data-label="Prix Total">{d.quantite * d.prix_unitaire} Ar</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="total-right">
            <h3>Total à payer : {facture.montant_total} Ar</h3>
          </div>
        </div>

        <p>
          <strong>Envoyée :</strong>{" "}
          <span className={`badge ${facture.envoyee ? "badge-success" : "badge-danger"}`}>
            {facture.envoyee ? "Oui" : "Non"}
          </span>
        </p>

        <div className="actions">
          <button className="btn btn-secondary" disabled>
            Facture générée (N° {facture.numero})
          </button>

          {!facture.envoyee && (
            <button className="btn btn-success" onClick={() => setConfirmSend(true)}>
              📧 Envoyer au client
            </button>
          )}

          <button className="btn btn-secondary" onClick={handleDownload}>
            🖨️ Télécharger / Imprimer
          </button>
        </div>
      </div>

      {/* ✅ Message modal */}
      <MessageModal
        message={message}
        type={messageType}
        onClose={() => setMessage("")}
      />

      {/* ✅ Confirmation modal */}
      {confirmSend && (
        <MessageModal
          message="Voulez-vous vraiment envoyer cette facture au client ?"
          type="confirm"
          onClose={() => setConfirmSend(false)}
          onConfirm={handleSend}
        />
      )}
    </Layout>
  );
}

export default FactureDetailPage;
