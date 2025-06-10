import React, { useState } from "react";
import styles from "./styles.module.css";

const ContactForm = ({
                         contact,
                         onSubmit,
                         onCancel,
                         emails: initialEmails,
                         phones: initialPhones,
                     }) => {
    const [emails, setEmails] = useState(initialEmails);
    const [phones, setPhones] = useState(initialPhones);
    const [emailErrors, setEmailErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(true);

    const validateEmail = (email, index) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = email === '' || re.test(email);

        setEmailErrors(prev => ({
            ...prev,
            [index]: isValid ? null : 'Введите корректный email (например: user@example.com)'
        }));

        return isValid;
    };

    const validateAllEmails = () => {
        const hasErrors = emails.some((item, index) => {
            console.log("bal", item)
            console.log("adas", item.email.trim() && !validateEmail(item.email, index))
            return item.email.trim() && !validateEmail(item.email, index);
        });
        const isValid = !hasErrors && emails.some(item => item.email.trim());
        setIsFormValid(isValid);
        return isValid;
    };

    const updateEmails = (index, value) => {
        console.log("40", value, index)
        const updated = [...emails];
        console.log(updated)
        updated[index] = { ...updated[index], email: value };
        console.log(updated)
        setEmails(updated);
        console.log(emails)
 

        if (value.trim()) {
            validateEmail(value, index);
        } else {
            setEmailErrors(prev => ({ ...prev, [index]: null }));
        }
            validateAllEmails();
    };

    const updatePhones = (index, value) => {
        const updated = [...phones];
        updated[index] = { ...updated[index], number: value };
        setPhones(updated);
    };

    const setPrimaryEmail = (index) => {
        setEmails(emails.map((item, i) => ({
            ...item,
            primary: i === index
        })));
    };

    const setPrimaryPhone = (index) => {
        setPhones(phones.map((item, i) => ({
            ...item,
            primary: i === index
        })));
    };

    const addEmail = () => setEmails([...emails, { email: "", primary: false }]);
    const addPhone = () => setPhones([...phones, { number: "", primary: false }]);

    const removeEmail = (index) => {
        const newEmails = emails.filter((_, i) => i !== index);
        if (emails[index].primary && newEmails.length > 0) {
            newEmails[0].primary = true;
        }
        setEmails(newEmails);
    };

    const removePhone = (index) => {
        const newPhones = phones.filter((_, i) => i !== index);
        if (phones[index].primary && newPhones.length > 0) {
            newPhones[0].primary = true;
        }
        setPhones(newPhones);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (!validateAllEmails()) {
            return;
        }

        const formData = new FormData(e.target);
        const payload = {
            fullName: formData.get("fullName"),
            postalAddress: formData.get("postalAddress"),
            emails: emails.map((item) => ({
                email: item.email,
                primaryEmail: item.primary
            })),
            phones: phones.map((item) => ({
                number: item.number,
                primaryPhone: item.primary
            })),
        };

        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <input
                className={styles.input}
                name="fullName"
                placeholder="ФИО"
                defaultValue={contact?.fullName || ""}
                required
                type="text"
            />
            <input
                className={styles.input}
                name="postalAddress"
                placeholder="Почтовый адрес"
                defaultValue={contact?.postalAddress || ""}
                required
                type="text"
            />

            <label>Email адреса:</label>
            {emails.map((item, index) => (
                <div key={index} className={styles.flexGroup}>
                    <input
                        className={`${styles.input} ${emailErrors[index] ? styles.error : ''}`}
                        type="text"
                        value={item.email}
                        onChange={(e) => {
                            item.email = e.target.value
                            updateEmails(index, e.target.value);
                     
                        }}
                        onBlur={() => validateAllEmails()}
                        placeholder="user@example.com"
                        required
                    />
                    <button
                        type="button"
                        className={styles.primaryButton}
                        onClick={() => setPrimaryEmail(index)}
                        disabled={item.primary}
                    >
                        {item.primary ? "Основной" : "Сделать основным"}
                    </button>
                    {emailErrors[index] && <div className={styles.errorMessage}>{emailErrors[index]}</div>}
                    {emails.length > 1 && (
                        
                        <button type="button" className={`${styles.button} ${styles.buttonDestructive}`} onClick={() => removeEmail(index)}>
                            ✕
                        </button>
                    )}
                </div>
            ))}
            <button type="button" onClick={addEmail}>
                Добавить Email
            </button>

            <label>Телефоны:</label>
            {phones.map((item, index) => (
                <div key={index} className={styles.flexGroup}>
                    <input
                        className={styles.input}
                        type="tel"
                        value={item.number}
                        onChange={(e) => updatePhones(index, e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className={styles.primaryButton}
                        onClick={() => setPrimaryPhone(index)}
                        disabled={item.primary}
                    >
                        {item.primary ? "Основной" : "Сделать основным"}
                    </button>
                    {phones.length > 1 && (
                        <button type="button" className={`${styles.button} ${styles.buttonDestructive}`} onClick={() => removePhone(index)}>
                            ✕
                        </button>
                    )}
                </div>
            ))}
            <button type="button" onClick={addPhone}>
                Добавить телефон
            </button>

            <button
                type="submit"
                className={`${styles.button} ${!isFormValid ? styles.disabled : styles.button}`}
                disabled={!isFormValid}
            >
                Сохранить
            </button>
            <button
                className={styles.button}
                type="button"
                onClick={onCancel}
            >
                Отмена
            </button>
        </form>
    );
};

export default ContactForm;