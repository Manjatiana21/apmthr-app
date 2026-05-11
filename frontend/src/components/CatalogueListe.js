// frontend/src/components/CatalogueListe.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import { getProduits, deleteProduit } from "../api";
import "../styles/CatalogueAdmin.css";
import { formatDate } from "../utils/formatDate";
import MessageModal from "./MessageModal";


function CatalogueListe() {
  const [produits, setProduits] = useState([]);
  const [loadingProduits, setLoadingProduits] = useState(true);
  const [search, setSearch] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [message, setMessage] = useState("");
   const [messageType, setMessageType] = useState("success");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 10; 

  useEffect(() => {
    fetchProduits();
  }, []);

  const fetchProduits = async (query = "", date = "") => {
    setLoadingProduits(true);
    try {
      const res = await getProduits();
      const data = Array.isArray(res.data) ? res.data : res.data.results;
      let filtered = (data || []).filter(p => p.is_active);

      if (query) {
        filtered = filtered.filter((p) =>
          p.designation.toLowerCase().includes(query.toLowerCase())
        );
      }

      if (date) {
        filtered = filtered.filter(
          (p) => formatDate(p.date_ajout) === formatDate(date)
        );
      }

      setProduits(filtered);
      setPage(1);
    } catch (err) {
      console.error("❌ Erreur API produits:", err.response?.data || err);
      setMessage("❌ Impossible de charger les produits.");
      setMessageType("error");
    } finally {
      setLoadingProduits(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduit(id);
      setProduits(produits.filter((p) => p.id !== id));
      setMessage("✅ Produit supprimé !");
      setMessageType("success");
    } catch (err) {
      console.error("❌ Erreur archivage:", err.response?.data || err);
      setMessage("❌ Erreur lors de l'archivage du produit");
      setMessageType("error");
    } finally {
      setConfirmDeleteId(null); // ✅ fermer la confirmation
    }
  };

  // ✅ Pagination front
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const produitsPage = produits.slice(startIndex, endIndex);
  const totalPages = Math.ceil(produits.length / pageSize);

  return (
    <Layout>
      <div className="catalogue-admin">
        <div className="table-section">
          <h2>Liste des produits</h2>

          <div className="search-bar-catalogue">
            <input className="inputrecherche"
              type="text"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <input className="daterecherche"
              type="date"
              value={searchDate}
              onChange={(e) => {
                setSearchDate(e.target.value);
                fetchProduits(search, e.target.value);
              }}
            />
            <button onClick={() => fetchProduits(search, searchDate)}>🔍</button>
          </div>

          {loadingProduits ? (
            <p>Chargement des produits...</p>
          ) : (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Désignation</th>
                    <th>Type</th>
                    <th>Fournisseur</th>
                    <th>Prix</th>
                    <th>Stock</th>
                    <th>Date d’ajout</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {produitsPage.length > 0 ? (
                    produitsPage.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <img
                            src={p.image || "/placeholder.png"}
                            alt={p.designation}
                            className="miniature"
                          />
                        </td>
                        <td>{p.designation}</td>
                        <td>{p.type_produit?.libelleTP}</td>
                        <td>{p.fournisseur?.type_F}</td>
                        <td>{p.prix} Ar</td>
                        <td>
                          <span
                            className={`badge ${
                              p.stock < 5 ? "badge-danger" : "badge-success"
                            }`}
                          >
                            {p.stock}
                          </span>
                        </td>
                        <td>{formatDate(p.date_ajout)}</td>
                        <td>
                          <button className="btn-edit">
                            <Link to={`/admin/produits/${p.id}/modifier`}>
                              Modifier
                            </Link>
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(p.id)} // ✅ ouvrir confirmation
                            className="btn-delete"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8">Aucun produit disponible</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="pagination">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  Précédent
                </button>
                <span>Page {page} / {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                  Suivant
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <MessageModal
        message={message}
        type={messageType}
        onClose={() => setMessage("")}
      />

      {/* ✅ Confirmation modal */}
      {confirmDeleteId && (
        <MessageModal
          message="Voulez-vous vraiment supprimer ce produit ?"
          type="confirm"
          onClose={() => setConfirmDeleteId(null)}
          onConfirm={() => handleDelete(confirmDeleteId)}
        />
      )}

    </Layout>
  );
}
export default CatalogueListe;