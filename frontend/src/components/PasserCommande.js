// frontend/src/components/PasserCommande.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduitById, getModesPaiement, passerCommande } from "../api"; 
import "../styles/PasserCommande.css";
import MessageModal from "./MessageModal"; // ✅ import

function PasserCommande({ onCommandeSuccess }) {
  const { id } = useParams(); 
  const [produit, setProduit] = useState(null);
  const [modes, setModes] = useState([]);
  const [formData, setFormData] = useState({
    quantite: 1,
    adresse_livraison: "",
    date_livraison: "",
    mode_paiement: "",
  });
  const [numeroAdmin, setNumeroAdmin] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  // Charger le produit
  useEffect(() => {
    getProduitById(id)
      .then((res) => setProduit(res.data))
      .catch((err) => {
        console.error("Erreur API produit:", err);
        setMessage("❌ Impossible de charger le produit.");
        setMessageType("error");
      });
  }, [id]);

  // Charger les modes de paiement
  useEffect(() => {
    getModesPaiement()
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.results || res.data.modes || [];
        setModes(data);
      })
      .catch((err) => {
        console.error("Erreur API modes:", err);
        setMessage("❌ Impossible de charger les modes de paiement.");
        setMessageType("error");
        setModes([]);
      });
  }, []);

  // Gestion du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "mode_paiement") {
      const mode = modes.find((m) => m.id === parseInt(value));
      setNumeroAdmin(mode ? mode.numero_admin : "");
    }
  };

  // Soumission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const commandeData = { ...formData, produit: id };

    try {
      const res = await passerCommande(commandeData);
      setMessage("✅ Commande passée avec succès !");
      setMessageType("success");
      console.log("Commande:", res.data);

      if (onCommandeSuccess) {
        onCommandeSuccess(res.data);
      }
    } catch (err) {
      console.error("Erreur commande:", err);
      setMessage("❌ Erreur lors du passage de la commande.");
      setMessageType("error");
    }
  };

  if (!produit) return <p>Chargement du produit...</p>;

  return (
    <div className="commande-card">
      <h2>Passer une commande</h2>

      <p>
        Produit choisi : <strong>{produit.designation}</strong> - {produit.prix} Ar
      </p>
      {produit.description && <p className="description1">{produit.description}</p>}

      <form onSubmit={handleSubmit}>
        <label>Quantité 
          <input
            type="number"
            name="quantite"
            min="1"
            max={produit.stock}   // ✅ limite côté frontend
            value={formData.quantite}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value > produit.stock) {
                setMessage(`❌ Stock insuffisant. Disponible: ${produit.stock} pièces.`);
                setMessageType("error");
              } else {
                setMessage(""); // ✅ efface le message si c’est correct
                setFormData({ ...formData, quantite: value });
              }
            }}
            required
          />
        </label>


        <label>Adresse de livraison 
          <input
            type="text"
            name="adresse_livraison"
            value={formData.adresse_livraison}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <select
            name="mode_paiement"
            value={formData.mode_paiement}
            onChange={handleChange}
            required
          >
            <option value="">Mode de paiement</option>
            {Array.isArray(modes) && modes.length > 0 ? (
              modes.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.mode_paiement}
                </option>
              ))
            ) : (
              <option disabled>Aucun mode disponible</option>
            )}
          </select>
        </label>

        {numeroAdmin && (
          <div className="numero-admin">
            <label>Numéro pour envoyer le paiement :</label>
            <input className="mode" type="text" value={numeroAdmin} readOnly />
          </div>
        )}

        <button type="submit" className="btn-commande">Commander</button>
      </form>

      {/* ✅ Message modal pour succès/erreur */}
      <MessageModal
        message={message}
        type={messageType}
        onClose={() => setMessage("")}
      />
    </div>
  );
}

export default PasserCommande;
