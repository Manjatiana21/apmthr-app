import React, { useState } from "react";
import "../styles/SuspensionModal.css";


function SuspensionModal({ isOpen, onClose, onConfirm }) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Raison de suspension</h3>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Entrez la raison..."
        />
        <div className="modal-actions">
          <button onClick={onClose}>Annuler</button>
          <button onClick={() => onConfirm(reason)}>Confirmer</button>
        </div>
      </div>
    </div>
  );
}

export default SuspensionModal;
