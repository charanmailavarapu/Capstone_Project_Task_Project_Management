import React from 'react';
import './Modal.css';

const Modal = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-bg" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} title="Close">&times;</button>
        {title && <div className="modal-title">{title}</div>}
        <div className="modal-content">{children}</div>
        {footer && <div className="modal-actions">{footer}</div>}
      </div>
    </div>
  );
};
export default Modal;