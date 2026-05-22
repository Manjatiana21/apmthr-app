// frontend/src/components/MesNotifications.js
import React, { useEffect, useState } from "react";
import { getMesNotifications, marquerNotificationClientLue, marquerToutesNotificationsClientLues } from "../api";
import Layout from "./Layout"; 
import "../styles/MesNotifications.css";

function MesNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [nbNonLues, setNbNonLues] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getMesNotifications();
        const data = res.notifications || [];
        setNotifications(data);
        setNbNonLues(res.nb_non_lues ?? data.filter((n) => !n.lu).length);
      } catch (err) {
        console.error("❌ Erreur API:", err.response?.data || err);
        setMessage("❌ Impossible de charger vos notifications.");
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, []);

  const marquerCommeLue = async (id) => {
    try {
      const res = await marquerNotificationClientLue(id);
      if (res.success || res.data?.success) {
        const updated = notifications.map((notif) =>
          notif.id === id ? { ...notif, lu: true } : notif
        );
        setNotifications(updated);
        setNbNonLues(updated.filter((n) => !n.lu).length);
      }
    } catch (err) {
      console.error("❌ Erreur mise à jour:", err.response?.data || err);
      setMessage("❌ Erreur lors de la mise à jour de la notification.");
    }
  };

  const marquerToutesCommeLues = async () => {
    try {
      const res = await marquerToutesNotificationsClientLues();
      if (res.success) {
        const updated = notifications.map((notif) => ({ ...notif, lu: true }));
        setNotifications(updated);
        setNbNonLues(0);
      }
    } catch (err) {
      console.error("❌ Erreur mise à jour:", err.response?.data || err);
      setMessage("❌ Erreur lors de la mise à jour des notifications.");
    }
  };

  return (
    <Layout>
      <div className="mes-notifications">
        <h2>Notifications</h2>
        {message && <p className="message">{message}</p>}

        <div className="notif-counter">
          <span className="badge badge-danger" id="NON_LUES">
            Notifications non lues : {nbNonLues}
          </span>
          {nbNonLues > 0 && (
            <button className="btn-mark-all" onClick={marquerToutesCommeLues} id="M_Tous_lus">
              Tout marquer comme lues
            </button>
          )}
        </div>

        <ul className="notif-list">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <li
                key={notif.id}
                className={`notif-item ${notif.lu ? "" : "notif-warning"}`}
              >
                <span>{notif.message}</span>
                {!notif.lu && (
                  <button
                    className="btn-mark-read"
                    onClick={() => marquerCommeLue(notif.id)}
                  id="Boutton-Mlus">
                    Marquer comme lue
                  </button>
                )}
              </li>
            ))
          ) : (
            <li className="notif-item">Aucune notification</li>
          )}
        </ul>
      </div>
    </Layout>
  );
}

export default MesNotifications;
