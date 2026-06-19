import React, { useEffect, useState } from "react";
import { getPaiementsAdmin, validerPaiement, annulerPaiement } from "../api"; 
import Layout from "./Layout"; 
import "../styles/Paiement.css";
import MessageModal from "./MessageModal"; // ✅ import

function GestionPaiement() {
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [showRecus, setShowRecus] = useState(false);

  const [pageAttente, setPageAttente] = useState(1);
  const [pageRecus, setPageRecus] = useState(1);
  const paiementsPerPage = 4;

  const [confirmAction, setConfirmAction] = useState(null); // ✅ {id, type}

  useEffect(() => {
    getPaiementsAdmin()
      .then((res) => {
        const paiementsValides = res.filter(p => p.commande?.statut === "VALIDEE");
        setPaiements(paiementsValides);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setMessage("❌ Impossible de charger les paiements.");
        setMessageType("error");
        setLoading(false);
      });
  }, []);

  const updateStatut = async (id, action) => {
    try {
      let res;
      if (action === "valider") {
        res = await validerPaiement(id); 
      } else {
        res = await annulerPaiement(id); 
      }
      setPaiements(paiements.map(p => p.id === id ? res : p));
      setMessage(`✅ Paiement #${id} ${action === "valider" ? "validé" : "annulé"} avec succès`);
      setMessageType("success");
    } catch (err) {
      console.error("Erreur mise à jour:", err);
      setMessage("❌ Erreur lors de la mise à jour du paiement.");
      setMessageType("error");
    } finally {
      setConfirmAction(null);
    }
  };

  if (loading) return <p>Chargement des paiements...</p>;

  const paiementsAttente = paiements.filter(p => p.statut === "EN_ATTENTE");
  const paiementsRecus = paiements.filter(p => p.statut === "RECU");

  const totalPagesAttente = Math.ceil(paiementsAttente.length / paiementsPerPage);
  const paiementsPageAttente = paiementsAttente.slice((pageAttente - 1) * paiementsPerPage, pageAttente * paiementsPerPage);

  const totalPagesRecus = Math.ceil(paiementsRecus.length / paiementsPerPage);
  const paiementsPageRecus = paiementsRecus.slice((pageRecus - 1) * paiementsPerPage, pageRecus * paiementsPerPage);

  return (
    <Layout>
      <div className="paiement-container">
        <h2>Gestion des paiements</h2>

        <div className="toggle-links">
          <button 
            className={`btn ${!showRecus ? "btn-primary" : "btn-secondary"}`} 
            onClick={() => setShowRecus(false)}
          >
            Paiements en attente
          </button>
          <button 
            className={`btn ${showRecus ? "btn-primary" : "btn-secondary"}`} 
            onClick={() => setShowRecus(true)}
          >
            Paiements reçus
          </button>
        </div>

        <table className="table-paiement">
          <thead>
            <tr>
              <th>Client</th>
              <th>Produits commandés</th>
              <th>Montant</th>
              <th>Mode</th>
              <th>Statut</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(showRecus ? paiementsPageRecus : paiementsPageAttente).length > 0 ? (
              (showRecus ? paiementsPageRecus : paiementsPageAttente).map((paiement) => (
                <tr key={paiement.id}>
                  <td>{paiement.client.username}</td>
                  <td>
                    {paiement.commande?.details.map((d) => (
                      <div key={d.id}>
                        {d.produit} (x{d.quantite}) - {d.prix_unitaire} Ar
                      </div>
                    ))}
                  </td>
                  <td>{paiement.montant} Ar</td>
                  <td>{paiement.mode_paiement}</td>
                  <td>
                    <span className={`badge statut-${paiement.statut.toLowerCase()}`}>
                      {paiement.statut}
                    </span>
                  </td>
                  <td>{paiement.date_paiement}</td>
                  <td>
                    {paiement.statut === "EN_ATTENTE" && (
                      <>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => setConfirmAction({ id: paiement.id, type: "valider" })}
                        >
                          Valider
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setConfirmAction({ id: paiement.id, type: "annuler" })}
                        >
                          Annuler
                        </button>
                      </>
                    )}
                    {paiement.statut === "RECU" && (
                      paiement.facture ? (
                        <button className="btn btn-secondary btn-sm" disabled>
                          Facture générée
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => window.location.href = `/paiements/${paiement.id}/facture`}
                        >
                          Générer facture
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7">Aucun paiement trouvé.</td></tr>
            )}
          </tbody>
        </table>

        {!showRecus ? (
          <div className="pagination">
            <button onClick={() => setPageAttente(pageAttente - 1)} disabled={pageAttente === 1}>
              ◀ Précédent
            </button>
            <span>Page {pageAttente} / {totalPagesAttente}</span>
            <button onClick={() => setPageAttente(pageAttente + 1)} disabled={pageAttente === totalPagesAttente}>
              Suivant ▶
            </button>
          </div>
        ) : (
          <div className="pagination">
            <button onClick={() => setPageRecus(pageRecus - 1)} disabled={pageRecus === 1}>
              ◀ Précédent
            </button>
            <span>Page {pageRecus} / {totalPagesRecus}</span>
            <button onClick={() => setPageRecus(pageRecus + 1)} disabled={pageRecus === totalPagesRecus}>
              Suivant ▶
            </button>
          </div>
        )}
      </div>

      {/* ✅ Message modal */}
      <MessageModal
        message={message}
        type={messageType}
        onClose={() => setMessage("")}
      />

      {/* ✅ Confirmation modal */}
      {confirmAction && (
        <MessageModal
          message={`Voulez-vous vraiment ${confirmAction.type} le paiement #${confirmAction.id} ?`}
          type="confirm"
          onClose={() => setConfirmAction(null)}
          onConfirm={() => updateStatut(confirmAction.id, confirmAction.type)}
        />
      )}
    </Layout>
  );
}

export default GestionPaiement;
