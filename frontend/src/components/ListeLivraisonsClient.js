// frontend/src/components/ListeLivraisonsClient.js
import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { getLivraisonsClient } from "../api"; 
import "../styles/Livraison.css";
import MessageModal from "./MessageModal"; // ✅ import

function ListeLivraisonsClient() {
  const [livraisons, setLivraisons] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statutFilter, setStatutFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    setLoading(true);
    getLivraisonsClient(page, statutFilter) 
      .then((res) => {
        if (Array.isArray(res.data)) {
          setLivraisons(res.data);
          setTotal(res.data.length);
        } else {
          setLivraisons(res.data.results || []);
          setTotal(res.data.count || 0);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setMessage("❌ Impossible de charger vos livraisons.");
        setMessageType("error");
        setLoading(false);
      });
  }, [page, statutFilter]);

  // filtre côté front
  const livraisonsFiltrees = statutFilter
    ? livraisons.filter(l => l.statut === statutFilter)
    : livraisons;


  const totalPages = Math.ceil(total / 10);

  return (
    <Layout>
      <div className="livraison-container">
        <h2>Suivi des livraisons</h2>

        {/* Filtres */}
        <div className="filters">
          <label>Filtrer par statut :</label>
          <select value={statutFilter} onChange={(e) => setStatutFilter(e.target.value)}>
            <option value="">Tous</option>
            <option value="NON_DEMARREE">Non démarrée</option>
            <option value="EN_COURS">En cours</option>
            <option value="LIVREE">Livrée</option>
          </select>
        </div>

        {loading ? (
          <p>Chargement des livraisons...</p>
        ) : (
          <>
            <table className="table-livraison">
              <thead>
                <tr>
                  <th>Commande</th>
                  <th>Statut commande</th>
                  <th>Statut livraison</th>
                  <th>Date prévue</th>
                </tr>
              </thead>
              <tbody>
                {livraisonsFiltrees.length > 0 ? (
                  livraisonsFiltrees.map((liv) => (
                    <tr key={liv.id}>
                      <td>{liv.commande.details[0]?.produit.designation}</td>
                      <td>{liv.commande.statut}</td>
                      <td>
                        {liv.statut === "NON_DEMARREE" && <span className="badge badge-secondary">Non démarrée</span>}
                        {liv.statut === "EN_COURS" && <span className="badge badge-warning">En cours</span>}
                        {liv.statut === "LIVREE" && <span className="badge badge-success">Livrée</span>}
                      </td>
                      <td>
                        {liv.date_prevue?
                          (() => {
                            const parsed = new Date(liv.date_prevue);
                            return isNaN(parsed.getTime())
                              ? liv.date_prevue
                              : parsed.toLocaleDateString("fr-FR", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric"
                                });
                          })()
                          : "Non planifiée"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5">Aucune livraison</td></tr>
                )}
              </tbody>
            </table>

            <div className="pagination">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Précédent</button>
              <span>Page {page} / {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Suivant</button>
            </div>
          </>
        )}
      </div>

      {/* ✅ Message modal */}
      <MessageModal
        message={message}
        type={messageType}
        onClose={() => setMessage("")}
      />
    </Layout>
  );
}

export default ListeLivraisonsClient;
