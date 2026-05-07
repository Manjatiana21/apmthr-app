// frontend/src/context/NotificationsContext.js
import React, { createContext, useState, useEffect } from "react";
import { getMe, getMesNotifications, getNotificationsAdmin } from "../api";

export const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [nbNonLues, setNbNonLues] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const refreshNotifications = async () => {
    try {
      const resUser = await getMe();
      setUser(resUser.data);

      if (resUser.data.role === "CLIENT") {
        const resNotif = await getMesNotifications();
        setNbNonLues(resNotif.nb_non_lues || 0);
      } else if (resUser.data.role === "ADMIN") {
        const resNotif = await getNotificationsAdmin();
        setNbNonLues(resNotif.nb_non_lues || 0);
      }
    } catch (err) {
      setUser(null);
      setNbNonLues(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshNotifications();
  }, []);

  return (
    <NotificationsContext.Provider value={{ nbNonLues, loading, user, refreshNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};
