// frontend/src/components/RapportMouvement.js
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Layout from "./Layout";   
import { getRapportMouvements } from "../api"; 
import "../styles/Stock.css";
import MessageModal from "./MessageModal"; // ✅ import

function GestionStock() {
  const [stats, setStats] = useState({});
  const [mouvements, setMouvements] = useState([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [produitFilter, setProduitFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    getRapportMouvements()
      .then((res) => {
        setStats(res.data.stats || {});
        setMouvements(res.data.mouvements || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setMessage("❌ Impossible de charger le rapport.");
        setMessageType("error");
        setLoading(false);
      });
  }, []);

  const moisNoms = {
    "1": "Janvier", "2": "Février", "3": "Mars", "4": "Avril", "5": "Mai", "6": "Juin",
    "7": "Juillet", "8": "Août", "9": "Septembre", "10": "Octobre", "11": "Novembre", "12": "Décembre",
  };

  const labels = Object.keys(stats);
  const entrees = labels.map((mois) => stats[mois]?.ENTREE || 0);
  const sorties = labels.map((mois) => stats[mois]?.SORTIE || 0);

  const chartData = {
    labels: labels.map((mois) => moisNoms[mois] || mois),
    datasets: [
      { label: "Entrées", data: entrees, backgroundColor: "rgba(75,192,192,0.7)" },
      { label: "Sorties", data: sorties, backgroundColor: "rgba(255,99,132,0.7)" },
    ],
  };

  const mouvementsFiltres = mouvements.filter((m) => {
    const matchType = typeFilter ? m.type_mouvement === typeFilter : true;
    const matchProduit = produitFilter
      ? m.produit.designation.toLowerCase().includes(produitFilter.toLowerCase())
      : true;
    return matchType && matchProduit;
  });

  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(mouvementsFiltres.length / PAGE_SIZE);
  const mouvementsPage = mouvementsFiltres.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Layout>
      <div className="stock-container">
        <h1>Rapport des mouvements de stock</h1>

        {loading ? (
          <p>Chargement du rapport...</p>
        ) : (
          <>
            <div className="rapport-grid">
              <div className="rapport-chart">
                <Bar data={chartData} />
              </div>

              <div className="rapport-synthese">
                <h2>Synthèse mensuelle des flux</h2>
                <table className="table-stock">
                  <thead>
                    <tr>
                      <th>Mois</th>
                      <th>Entrées</th>
                      <th>Sorties</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labels.length > 0 ? (
                      labels.map((mois) => (
                        <tr key={mois}>
                          <td>{moisNoms[mois] || mois}</td>
                          <td>{stats[mois]?.ENTREE || 0}</td>
                          <td>{stats[mois]?.SORTIE || 0}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="3">Aucune donnée disponible</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="filters">
              <label>Type :</label>
              <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}>
                <option value="">Tous</option>
                <option value="ENTREE">Entrée</option>
                <option value="SORTIE">Sortie</option>
              </select>

              <label>Produit :</label>
              <input
                type="text"
                placeholder="Nom produit"
                value={produitFilter}
                onChange={(e) => { setProduitFilter(e.target.value); setPage(1); }}
              />
            </div>

            <h2>Liste détaillée des mouvements</h2>
            <table className="table-stock">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Quantité</th>
                  <th>Type</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {mouvementsPage.length > 0 ? (
                  mouvementsPage.map((m) => (
                    <tr key={m.id}>
                      <td>{m.produit.designation}</td>
                      <td>{m.quantite}</td>
                      <td>{m.type_mouvement}</td>
                      <td>{m.date_mouvement}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4">Aucun mouvement trouvé.</td></tr>
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

export default GestionStock;
