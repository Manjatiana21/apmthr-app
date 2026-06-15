import React, { useEffect, useState } from "react";
import { getUsers, suspendUser, reactivateUser } from "../api";
import Layout from "./Layout";
import SuspensionModal from "./SuspensionModal";

function GestionUtilisateurs() {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    getUsers().then((data) => setUsers(data));
  }, []);

  const handleSuspendClick = (id) => {
    setSelectedUser(id);
    setModalOpen(true);
  };

  const handleConfirmSuspend = async (reason) => {
    await suspendUser(selectedUser, reason);
    setUsers(users.map(u => u.id === selectedUser ? { ...u, is_active: false, suspension_reason: reason } : u));
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleReactivate = async (id) => {
    await reactivateUser(id);
    setUsers(users.map(u => u.id === id ? { ...u, is_active: true, suspension_reason: null } : u));
  };

  return (
    <Layout>
      <div>
        <h2>Gestion des utilisateurs</h2>
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Adresse</th>
              <th>Téléphone</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.adresse}</td>
                <td>{u.telephone || "Non renseigné"}</td>
                <td>{u.role}</td>
                <td>{u.is_active ? "Actif" : `Suspendu (${u.suspension_reason})`}</td>
                <td>
                  {u.is_active ? (
                    <button onClick={() => handleSuspendClick(u.id)}>Suspendre</button>
                  ) : (
                    <button onClick={() => handleReactivate(u.id)}>Réactiver</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <SuspensionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirmSuspend}
        />
      </div>
    </Layout>
  );
}

export default GestionUtilisateurs;
