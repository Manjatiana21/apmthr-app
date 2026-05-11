// frontend/src/components/CatalogueAdmin.js
import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import {
  getProduits,
  addProduit,
  getTypesProduits,
  getFournisseurs,
} from "../api";
import "../styles/CatalogueAdmin.css";
import { formatDate } from "../utils/formatDate";
import MessageModal from "./MessageModal"; 

function CatalogueAdmin() {
  const [produits, setProduits] = useState([]);
  const [typesProduits, setTypesProduits] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [formData, setFormData] = useState({
    designation: "",
    description: "",
    stock: "",
    type_produit_id: "",
    fournisseur_id: "",
    prix: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [loadingProduits, setLoadingProduits] = useState(true);
  const [showList, setShowList] = useState(false); // ✅ contrôle affichage liste
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    fetchTypesProduits();
    fetchFournisseurs();
  }, []);

  const fetchProduits = async () => {
    setLoadingProduits(true);
    try {
      const res = await getProduits();
      const data = Array.isArray(res.data) ? res.data : res.data.results;
      let filtered = (data || []).filter((p) => p.is_active);
      setProduits(filtered);
    } catch (err) {
      console.error("❌ Erreur API produits:", err.response?.data || err);
      setErrorMessage("❌ Impossible de charger les produits.");
    } finally {
      setLoadingProduits(false);
    }
  };

  const fetchTypesProduits = async () => {
    try {
      const res = await getTypesProduits();
      const data = Array.isArray(res.data) ? res.data : res.data.results;
      setTypesProduits(data || []);
    } catch (err) {
      console.error("❌ Erreur API types produits:", err.response?.data || err);
      setTypesProduits([]);
    }
  };

  const fetchFournisseurs = async () => {
    try {
      const res = await getFournisseurs();
      const data = Array.isArray(res.data) ? res.data : res.data.results;
      setFournisseurs(data || []);
    } catch (err) {
      console.error("❌ Erreur API fournisseurs:", err.response?.data || err);
      setFournisseurs([]);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (formData.stock < 0 || formData.prix < 0) {
      setErrorMessage("❌ Stock et prix doivent être positifs.");
      setLoading(false);
      return;
    }

    try {
      const formDataObj = new FormData();
      for (let key in formData) {
        if (formData[key] !== null && formData[key] !== "") {
          formDataObj.append(key, formData[key]);
        }
      }

      const res = await addProduit(formDataObj);
      setProduits([...produits, res.data]);
      setSuccessMessage("✅ Produit ajouté avec succès !");
      setFormData({
        designation: "",
        description: "",
        stock: "",
        type_produit_id: "",
        fournisseur_id: "",
        prix: "",
        image: null,
      });

      // ✅ afficher la liste après ajout
      setShowList(true);
      fetchProduits();
    } catch (err) {
      console.error("❌ Erreur ajout:", err.response?.data || err);
      setErrorMessage("❌ Erreur lors de l'ajout du produit");
    } finally {
      setLoading(false);
    }
  };

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const produitsPage = produits.slice(startIndex, endIndex);
  const totalPages = Math.ceil(produits.length / pageSize);


  return (
    <Layout>
      <div className="catalogue-admin">
  
        <div className="form-section-ajout">
          <h2>Ajouter un produit</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="AJOUT">
            <input className="DESIGNATION"
              type="text"
              name="designation"
              placeholder="Désignation"
              value={formData.designation}
              onChange={handleChange}
              required
            />
        
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />

            <input className="STOCK"
              type="number"
              name="stock"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleChange}
              required
            />

            <select
              name="type_produit_id"
              value={formData.type_produit_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Sélectionner un type --</option>
              {typesProduits.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.libelleTP}
                </option>
              ))}
            </select>

            <select
              name="fournisseur_id"
              value={formData.fournisseur_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Sélectionner un fournisseur --</option>
              {fournisseurs.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.type_F}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="prix"
              placeholder="Prix"
              value={formData.prix}
              onChange={handleChange}
              required
            />

            <label className="custom-file-upload">
              Image :
              <input
                type="file"
                name="image"
                onChange={handleChange}
                style={{ display: "none" }}
              />
              📂 Choisir un fichier
            </label>
            <span>
              {formData.image ? formData.image.name : "Aucun fichier sélectionné"}
            </span>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </form>
        </div>

        {/* ✅ Liste affichée seulement après ajout */}
                {showList && (
          <div className="table-section-ajout">
            <h2>Liste des produits ajoutés</h2>
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
                          <td>{p.date_ajout_formatee || formatDate(p.date_ajout)}</td>

                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7">Aucun produit disponible</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* ✅ Pagination */}
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
        )}

        {/* ✅ Modales pour messages */}
        <MessageModal
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
        <MessageModal
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      </div>
    </Layout>
  );
}

export default CatalogueAdmin;

