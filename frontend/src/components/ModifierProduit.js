import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "./Layout";   
import { getProduitById, updateProduit } from "../api"; 
import "../styles/ModifierProduit.css";
import MessageModal from "./MessageModal";

function ModifierProduit() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    designation: "",
    description: "",
    stock: "",
    type_produit: "",
    fournisseur: "",
    prix: "",
    image: null,
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Charger toutes les données du produit dès l’ouverture
  useEffect(() => {
    getProduitById(id) 
      .then((res) => {
        setFormData({
          designation: res.data.designation || "",
          description: res.data.description || "",
          stock: res.data.stock || "",
          type_produit: res.data.type_produit?.libelleTP || "",
          fournisseur: res.data.fournisseur?.type_F || "",
          prix: res.data.prix || "",
          image: null, 
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setMessage("❌ Impossible de charger le produit.");
        setLoading(false);
      });    
  }, [id]);

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  // Soumettre la modification
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();

    // N’ajouter que les champs non vides
    for (let key in formData) {
      if (formData[key] !== null && formData[key] !== "") {
        formDataObj.append(key, formData[key]);
      }
    }

    try {
      await updateProduit(id, formDataObj); 
      setSuccessMessage("✅ Produit modifié avec succès !");
    } catch (err) {
      console.error("Erreur modification:", err);
      setMessage("❌ Erreur lors de la modification du produit.");
    }
  };

  return (
    <Layout>
      <div className="modifier-produit">
        <h2>Modifier le produit : {formData.designation}</h2>
        {message && <p className="message">{message}</p>}
        {loading ? (
          <p>Chargement du produit...</p>
        ) : (
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <label className="Designation">Désignation</label>
            <input type="text" name="designation" value={formData.designation} onChange={handleChange} required />

            <label className="Description">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} />

            <label className="QTE">Stock</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />

            <label className="Type">Type de produit</label>
            <input type="text" name="type_produit" value={formData.type_produit} onChange={handleChange} required />

            <label className="Fournisseur">Fournisseur</label>
            <input type="text" name="fournisseur" value={formData.fournisseur} onChange={handleChange} required />

            <label className="PRX">Prix</label>
            <input type="number" name="prix" value={formData.prix} onChange={handleChange} required />

            <label className="custom_Image">Image :  
              <input
                type="file"
                name="image"
                onChange={handleChange}
                style={{ display: "none" }}
              />
              📂 Choisir un fichier
            </label>

            <button type="submit" className="btn-success">Enregistrer</button>
            <Link to="/admin/catalogue" className="btn-secondary" id="Annuler">Annuler</Link>
          </form>
        )}

        
        <MessageModal 
          message={successMessage} 
          onClose={() => {
            setSuccessMessage("");
            navigate("/admin/catalogue");
          }} 
        />
      </div>
    </Layout>
  );
}

export default ModifierProduit;
