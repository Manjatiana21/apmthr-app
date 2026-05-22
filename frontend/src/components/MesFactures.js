import React, { useEffect, useState } from "react";
import { getFacturesRecues } from "../api";
import Layout from "./Layout";
import "../styles/MesFacture.css";

function MesFactures() {
  const [factures, setFactures] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getFacturesRecues()
      .then((data) => setFactures(data))
      .catch(() => setMessage("❌ Impossible de charger vos factures."));
  }, []);

  return (
    <Layout>
      <div className="mesfactures-title">
      <h2>Liste de vos factures réçus</h2>
      </div>
      {message && <p className="message">{message}</p>}
      <table className="Facture-tableau">
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Date</th>
            <th>Montant</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {factures.length > 0 ? (
            factures.map((f) => (
              <tr key={f.id}>
                <td data-label="Facture N° :">{f.numero}</td>
              <td data-label="Date d'émission">
                {new Date(f.date_emission).toLocaleDateString("fr-FR")}
              </td>
                <td data-label="Montant Total">{f.montant_total} Ar</td>
                <td data-label="Action">
                  <div className="btnaction-lfacture">
                    <a href={`/factures/${f.id}`}>Consulter</a>
                  </div>
                </td>
              </tr>
                    ))
                  ) : (
              <tr>
                <td colSpan="4">Aucune facture reçue.</td>
              </tr>
          )}
        </tbody>

      </table>
    </Layout>
  );
}

export default MesFactures;
