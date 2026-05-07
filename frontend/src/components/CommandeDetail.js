import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import DetailCommandeClient from "./DetailCommandeClient";

export default function CommandeDetail() {
  const { id } = useParams();
  const [commande, setCommande] = useState(null);

  useEffect(() => {
    api.get(`/api/commandes/${id}/`)
      .then((res) => setCommande(res.data))
      .catch((err) => console.error("Erreur API:", err));
  }, [id]);

  if (!commande) return <p>Chargement...</p>;

  return <DetailCommandeClient commande={commande} />;
}
