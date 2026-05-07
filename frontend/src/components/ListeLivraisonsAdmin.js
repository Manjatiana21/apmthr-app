import React, { useEffect, useState } from "react";
import Layout from "./Layout";  
import { getLivraisonsAdmin, updateLivraisonStatut } from "../api"; 
import "../styles/Livraison.css";

function ListeLivraisonsAdmin() {
  const [livraisons, setLivraisons] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const pageSize = 10;

  useEffect(() => {
    setLoading(true);
    getLivraisonsAdmin()
      .then((res) => {
        // ✅ On filtre directement côté frontend pour ne garder que les livraisons EN_COURS
        const enCours = res.data.filter(l => l.statut === "EN_COURS");
        setLivraisons(enCours);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setMessage("❌ Impossible de charger les livraisons.");
        setLoading(false);
      });
  }, []);

  // ✅ Pagination front
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const livraisonsPage = livraisons.slice(startIndex, endIndex);
  const totalPages = Math.ceil(livraisons.length / pageSize);

  // ✅ Mise à jour du statut
  const updateStatut = async (id, nouveauStatut) => {
    try {
      const res = await updateLivraisonStatut(id, nouveauStatut); 
      setLivraisons(livraisons.map(l => l.id === id ? res.data : l));
      setMessage(`✅ Livraison #${id} mise à jour en ${nouveauStatut}`);
    } catch (err) {
      console.error("Erreur mise à jour:", err);
      setMessage("❌ Erreur lors de la mise à jour du statut.");
    }
  };

  return (
    <Layout>
      <div className="livraison-container">
        <h2>Livraisons en cours</h2>
        {message && <p className="message">{message}</p>}

        {loading ? (
          <p>Chargement des livraisons...</p>
        ) : (
          <>
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
                  livraisonsPage.map((liv) => (
                    <tr key={liv.id}>
                      <td>{liv.id}</td>
                      <td>{liv.produit_designation}</td>
                      <td>{liv.client}</td>
                      <td>{liv.adresse}</td>
                       <td>{liv.date_prevue || "Non planifiée"}</td>
                      <td><span className="badge badge-warning">En cours</span></td>
                      <td>
                        <button 
                          onClick={() => updateStatut(liv.id, "LIVREE")} 
                          className="btn btn-success"
                        >
                          Marquer livrée
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="8">Aucune livraison en cours</td></tr>
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
    </Layout>
  );
}

export default ListeLivraisonsAdmin;
