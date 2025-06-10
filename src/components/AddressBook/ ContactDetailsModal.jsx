import React from "react";
import styles from "./styles.module.css";

const ContactDetailsModal = ({ title, items, onClose }) => {
    return (
        <div
            className={styles.modalOverlay}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.dialogTitle}>{title}</h2>
                <ul className={styles.detailsList}>
                    {items.map((item, index) => (
                        <li key={index} className={styles.detailsItem}>{item}</li>
                    ))}
                </ul>
                <button className={styles.submitButton} onClick={onClose}>
                    Закрыть
                </button>
            </div>
        </div>
    );
};

export default ContactDetailsModal;