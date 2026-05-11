// frontend/src/components/MessageModal.js
import React from "react";
import "../styles/MessageModal.css";

function MessageModal({ message, type, onClose, onConfirm }) {
  if (!message) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal-box ${type}`}>
        <p>{message}</p>

        {type === "confirm" ? (
          <div className="modal-actions">
            <button className="btn-yes" onClick={onConfirm}>Oui</button>
            <button className="btn-no" onClick={onClose}>Non</button>
          </div>
        ) : (
          <button className="btn-close" onClick={onClose}>Fermer</button>
        )}
      </div>
    </div>
  );
}

export default MessageModal;
