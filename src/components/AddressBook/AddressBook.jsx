import React, { useState, useEffect } from "react";
import { useDebounce } from 'use-debounce';
import styles from "./styles.module.css";
import ContactCard from "./ ContactCard.jsx";
import ContactForm from "./ ContactForm.jsx";
import ContactDetailsModal from "./ ContactDetailsModal.jsx";
import useContacts from "../../hooks/useContacts";

const AddressBook = () => {
    const {
        contacts,
        search,
        handleSearchChange,
        page,
        setPage,
        totalPages,
        isLoading,
        loadContacts,
        handleDelete,
        handleLoadDetails,
        saveContact,
    } = useContacts();

    const [debouncedSearch] = useDebounce(search, 500);
    const [popupOpen, setPopupOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [detailsPopupOpen, setDetailsPopupOpen] = useState(false);
    const [detailsTitle, setDetailsTitle] = useState("");
    const [detailsList, setDetailsList] = useState([]);
    
    useEffect(() => {
        loadContacts(page, debouncedSearch);
    }, [page, debouncedSearch, loadContacts]);

    const handleSearchInputChange = (e) => {
        handleSearchChange(e.target.value);
    };

    const handleAdd = () => {
        setSelectedContact(null);
        setPopupOpen(true);
    };

    const handleEdit = (contact) => {
        setSelectedContact(contact);
        setPopupOpen(true);
    };

    const handleSubmit = async (contactData) => {
        await saveContact(contactData, selectedContact);
        setPopupOpen(false);
        loadContacts(page, debouncedSearch);
    };

    const handleShowDetails = async (id, type) => {
        const items = await handleLoadDetails(id, type);
        setDetailsTitle(type === "emails" ? "Все email адреса" : "Все номера телефона");
        setDetailsList(items);
        setDetailsPopupOpen(true);
    };

    const goToPreviousPage = () => page > 0 && setPage(page - 1);
    const goToNextPage = () => page + 1 < totalPages && setPage(page + 1);

    const getInitialEmails = () => {
        return selectedContact
            ? selectedContact.emails.map(e => ({ email: e.email, primary: e.primaryEmail }))
            : [{ email: "", primary: true }];
    };

    const getInitialPhones = () => {
        return selectedContact
            ? selectedContact.phones.map(p => ({ number: p.number, primary: p.primaryPhone }))
            : [{ number: "", primary: true }];
    };

    return (
        <div className={`${styles.container} ${isLoading ? styles.loading : ''}`}>
            <div className={styles.header}>
                <div className={styles.searchContainer}>
                    <input
                        placeholder="Поиск..."
                        className={styles.searchInput}
                        value={search}
                        onChange={handleSearchInputChange}
                        type="search"
                        aria-label="Поиск контактов"
                    />
                </div>
                <button className={styles.button} onClick={handleAdd} type="button">
                    Добавить контакт
                </button>
            </div>

            {isLoading ? (
                <div className={styles.loader}>Загрузка...</div>
            ) : (
                <>
                    <div className={styles.contactsList}>
                        {contacts.length > 0 ? (
                            contacts.map((contact) => (
                                <ContactCard
                                    key={contact.id}
                                    contact={contact}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onLoadDetails={handleShowDetails}
                                />
                            ))
                        ) : (
                            <div className={styles.noResults}>
                                {debouncedSearch ? "Ничего не найдено" : "Список контактов пуст"}
                            </div>
                        )}
                    </div>

                    {contacts.length > 0 && (
                        <div className={styles.pagination}>
                            <button
                                className={styles.button}
                                disabled={page === 0}
                                onClick={goToPreviousPage}
                                type="button"
                            >
                                Назад
                            </button>
                            <span translate="no">
                Страница {page + 1} из {totalPages}
              </span>
                            <button
                                className={styles.button}
                                disabled={page + 1 === totalPages}
                                onClick={goToNextPage}
                                type="button"
                            >
                                Вперёд
                            </button>
                        </div>
                    )}
                </>
            )}

            {popupOpen && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setPopupOpen(false)}
                    role="dialog"
                    aria-modal="true"
                >
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2 className={styles.dialogTitle}>
                            {selectedContact ? "Редактировать контакт" : "Добавить контакт"}
                        </h2>
                        <ContactForm
                            contact={selectedContact}
                            onSubmit={handleSubmit}
                            onCancel={() => setPopupOpen(false)}
                            emails={getInitialEmails()}
                            phones={getInitialPhones()}
                        />
                    </div>
                </div>
            )}

            {detailsPopupOpen && (
                <ContactDetailsModal
                    title={detailsTitle}
                    items={detailsList}
                    onClose={() => setDetailsPopupOpen(false)}
                />
            )}
        </div>
    );
};

export default AddressBook;