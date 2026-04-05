import React, { useState } from 'react';
import '../styles/ReturnModal.css';

const ReturnModal = ({ onClose, orderId }) => {
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Return requested for Order #${orderId} with reason: ${reason}`);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Return Order #{orderId}</h3>
        <form onSubmit={handleSubmit}>
          <label>Reason for Return:</label>
          <textarea
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason here..."
          />
          <div className="modal-actions">
            <button type="submit" className="submit-btn">Submit</button>
            <button onClick={onClose} type="button" className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnModal;