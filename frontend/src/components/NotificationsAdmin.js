// frontend/src/components/NotificationsAdmin.js
import React, { useEffect, useState, useContext } from "react";
import { getNotificationsAdmin, marquerNotificationAdminLue, marquerToutesNotificationsAdminLues } from "../api"; 
import Layout from "./Layout";
import "../styles/NotificationsAdmin.css";
import { NotificationsContext } from "./NotificationsContext";

function NotificationsAdmin() {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");
  const { refreshNotifications } = useContext(NotificationsContext);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotificationsAdmin();
        setNotifications(res.notifications || []);
      } catch (err) {
        console.error("❌ Erreur API:", err.response?.data || err);
        setMessage("❌ Impossible de charger les notifications admin.");
      }
    };
    fetchNotifications();
  }, []);

  const marquerCommeLue = async (id) => {
    try {
      await marquerNotificationAdminLue(id);
      const updated = notifications.map((notif) =>
        notif.id === id ? { ...notif, lu: true } : notif
      );
      setNotifications(updated);
      refreshNotifications(); // ✅ met à jour Layout
    } catch (err) {
      console.error("❌ Erreur mise à jour:", err.response?.data || err);
      setMessage("❌ Erreur lors de la mise à jour de la notification.");
    }
  };

  const marquerToutesCommeLues = async () => {
    try {
      await marquerToutesNotificationsAdminLues();
      const updated = notifications.map((notif) => ({ ...notif, lu: true }));
      setNotifications(updated);
      refreshNotifications(); // ✅ met à jour Layout
    } catch (err) {
      console.error("❌ Erreur mise à jour:", err.response?.data || err);
      setMessage("❌ Erreur lors de la mise à jour des notifications.");
    }
  };

  return (
    <Layout>
      <div className="notifications-admin">
        <h2>Notifications Admin</h2>
        {message && <p className="message">{message}</p>}

        <div className="notif-counter">
          <button className="btn-mark-all" onClick={marquerToutesCommeLues}>
            Tout marquer comme lues
          </button>
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
                  >
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

export default NotificationsAdmin;
