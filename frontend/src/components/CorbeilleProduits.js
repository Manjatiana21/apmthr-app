import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { getProduitsArchives, reactiverProduit } from "../api";
import MessageModal from "./MessageModal"; // ✅ import

function CorbeilleProduits() {
  const [produitsArchives, setProduitsArchives] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [confirmReactiverId, setConfirmReactiverId] = useState(null); // ✅ pour confirmation

  useEffect(() => {
    fetchProduitsArchives();
  }, []);

  const fetchProduitsArchives = async () => {
    try {
      const dataRes = await getProduitsArchives(); 
      const data = Array.isArray(dataRes.data) ? dataRes.data : dataRes.data.results;
      setProduitsArchives(data || []);
    } catch (err) {
      console.error("❌ Erreur API corbeille:", err.response?.data || err);
      setMessage("❌ Impossible de charger les produits archivés.");
      setMessageType("error");
    }
  };

  const handleReactiver = async (id) => {
    try {
      await reactiverProduit(id); 
      setProduitsArchives(produitsArchives.filter((p) => p.id !== id));
      setMessage("✅ Produit réactivé !");
      setMessageType("success");
    } catch (err) {
      console.error("❌ Erreur réactivation:", err.response?.data || err);
      setMessage("❌ Erreur lors de la réactivation du produit");
      setMessageType("error");
    } finally {
      setConfirmReactiverId(null); // ✅ fermer la modale
    }
  };

  return (
    <Layout>
      <div className="corbeille-produits">
        <h2>Produits archivés</h2>

        <table>
          <thead>
            <tr>
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
            {produitsArchives.length > 0 ? (
              produitsArchives.map((p) => (
                <tr key={p.id}>
                  <td>{p.designation}</td>
                  <td>{p.type_produit?.libelleTP}</td>
                  <td>{p.fournisseur?.type_F}</td>
                  <td>{p.prix} Ar</td>
                  <td>{p.stock}</td>
                  <td>{new Date(p.date_ajout).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => setConfirmReactiverId(p.id)} // ✅ ouvrir confirmation
                      className="btn-reactiver"
                    >
                      Réinitialiser
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Aucun produit archivé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Message modal */}
      <MessageModal
        message={message}
        type={messageType}
        onClose={() => setMessage("")}
      />

      {/* ✅ Confirmation modal */}
      {confirmReactiverId && (
        <MessageModal
          message="Voulez-vous vraiment réactiver ce produit ?"
          type="confirm"
          onClose={() => setConfirmReactiverId(null)}
          onConfirm={() => handleReactiver(confirmReactiverId)}
        />
      )}
    </Layout>
  );
}

export default CorbeilleProduits;
