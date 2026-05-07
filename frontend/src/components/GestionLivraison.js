import React, { useEffect, useState } from "react";
import { getLivraisonsAdmin, updateLivraisonStatut, planifierLivraison } from "../api"; 
import "../styles/Livraison.css";
import Layout from "./Layout";


function GestionLivraison() {
  const [livraisons, setLivraisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [statutFilter, setStatutFilter] = useState(""); 
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    getLivraisonsAdmin()
      .then((res) => {
        setLivraisons(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setMessage("❌ Impossible de charger les livraisons.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement des livraisons...</p>;

  // filtre
  const livraisonsFiltrees = statutFilter
    ? livraisons.filter(l => l.statut === statutFilter)
    : livraisons;

  //  Pagination 
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const livraisonsPage = livraisonsFiltrees.slice(startIndex, endIndex);
  const totalPages = Math.ceil(livraisonsFiltrees.length / pageSize);

  return (
    <Layout>
    <div className="livraison-container">
      <h2>Livraisons</h2>
      {message && <p className="message">{message}</p>}

      <div className="filters">
        <label>Filtrer par statut :</label>
        <select value={statutFilter} onChange={(e) => {
          setStatutFilter(e.target.value);
          setPage(1);
        }}>
          <option value="">Tous</option>
          <option value="NON_DEMARREE">Non démarrée</option>
          <option value="EN_COURS">En cours</option>
          <option value="LIVREE">Livrée</option>
        </select>
      </div>

      <table className="table-livraison">
        <thead>
          <tr>
            <th>ID</th>
            <th>Commande</th>
            <th>Client</th>
            <th>Adresse</th>
            <th>Date prévue</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {livraisonsPage.length > 0 ? (
          livraisonsPage
            .filter(liv => liv.commande.statut === "VALIDEE")
            .map((liv) => (
              <tr key={liv.id}>
                <td>{liv.id}</td>
                <td>
                  {liv.commande.details && liv.commande.details.length > 0 ? (
                    liv.commande.details.map((d, idx) => (
                      <div key={idx}>
                        {d.produit.designation} (x{d.quantite}) - {d.produit.prix} Ar
                      </div>
                    ))
                  ) : (
                    "—"
                  )}
                </td>
                <td>{liv.client}</td>
                <td>{liv.adresse}</td>
                <td>
                  {liv.date_prevue
                    ? (() => {
                        const parsed = new Date(liv.date_prevue);
                        return isNaN(parsed.getTime())
                          ? liv.date_prevue
                          : parsed.toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric"
                            });
                      })()
                    : "—"}
                </td>

                <td>
                  <span className={`badge statut-${liv.statut.toLowerCase()}`}>
                    {liv.statut}
                  </span>
                </td>
                <td>
                  {liv.statut === "NON_DEMARREE" ? (
                    <button
                      onClick={() => {
                        planifierLivraison(liv.commande.id)
                          .then(res => {
                            setLivraisons(livraisons.map(l => l.id === liv.id ? res.data : l));
                            setMessage(`✅ Livraison #${liv.id} planifiée pour ${res.data.date_prevue}`);
                          })
                          .catch(err => {
                            console.error("Erreur planification:", err);
                            setMessage("❌ Erreur lors de la planification.");
                          });
                      }}
                      className="btn btn-info"
                    >
                      Planifier
                    </button>
                  ) : liv.statut === "EN_COURS" ? (
                    <button
                      onClick={() => {
                        updateLivraisonStatut(liv.id, "LIVREE")
                          .then(res => {
                            setLivraisons(livraisons.map(l => l.id === liv.id ? res.data : l));
                            setMessage(`✅ Livraison #${liv.id} marquée comme livrée`);
                          })
                          .catch(err => {
                            console.error("Erreur mise à jour:", err);
                            setMessage("❌ Erreur lors de la mise à jour.");
                          });
                      }}
                      className="btn btn-success"
                    >
                      Marquer livrée
                    </button>
                  ) : (
                    <span className="badge badge-success">Livrée</span>
                  )}
                </td>
              </tr>
            ))
        ) : (
          <tr><td colSpan="7">Aucune livraison</td></tr>
        )}

      </tbody>

      </table>

      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Précédent</button>
        <span>Page {page} / {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Suivant</button>
      </div>
    </div>
  </Layout>
  );
}

export default GestionLivraison;
