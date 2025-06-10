import React from "react";
import styles from "./styles.module.css";
import { ChevronDown } from "lucide-react";

const ContactCard = ({ contact, onEdit, onDelete, onLoadDetails }) => {
    const primaryEmail =
        contact.emails?.find((e) => e.primaryEmail)?.email ||
        contact.emails?.[0]?.email ||
        "-";

    const primaryPhone =
        contact.phones?.find((p) => p.primaryPhone)?.number ||
        contact.phones?.[0]?.number ||
        "-";

    return (
        <div className={styles.contactCard}>
            <div className={styles.cardContent}>
                <div>{contact.fullName}</div>
                <div>{contact.postalAddress}</div>
                <div className={styles.flexCenter}>
                    {primaryEmail}
                    {contact.emails.length > 1 && (
                        <button
                            className={styles.iconButton}
                            onClick={() => onLoadDetails(contact.id, "emails")}
                            aria-label="Показать все email"
                            type="button"
                        >
                            <ChevronDown />
                        </button>
                    )}
                </div>
                <div className={styles.flexCenter}>
                    {primaryPhone}
                    {contact.phones.length > 1 && (
                        <button
                            className={styles.iconButton}
                            onClick={() => onLoadDetails(contact.id, "phones")}
                            aria-label="Показать все телефоны"
                            type="button"
                        >
                            <ChevronDown />
                        </button>
                    )}
                </div>
                <div className={styles.colSpan2Right}>
                    <button
                        className={`${styles.button} ${styles.buttonMarginRight}`}
                        onClick={() => onEdit(contact)}
                        type="button"
                    >
                        Редактировать
                    </button>
                    <button
                        className={`${styles.button} ${styles.buttonDestructive}`}
                        onClick={() => onDelete(contact.id)}
                        type="button"
                    >
                        Удалить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContactCard;