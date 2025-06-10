import { useState, useEffect } from "react";

const useContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const loadContacts = async (pageNumber, searchTerm) => {
        try {
            const response = await fetch(
                `/contacts?search=${encodeURIComponent(searchTerm)}&page=${pageNumber}&size=5`
            );
            if (!response.ok) throw new Error("Ошибка загрузки контактов");
            const data = await response.json();
            setContacts(data.content);
            setTotalPages(data.totalPages)
        } catch (err) {
            console.log("Не удалось загрузить контакты", err);
        }
    };

    useEffect(() => {
        loadContacts(page, search);
    }, [page, search]);

    const handleDelete = async (id) => {
        await fetch(`/contacts/${id}`, { method: "DELETE" });
        loadContacts(page, search);
    };

    const handleLoadDetails = async (id, type) => {
        const response = await fetch(`/contacts/${id}/${type}`);
        const items = await response.json();
        return items.map((i) => type === "emails" ? i.email : i.number);
    };

    const handleSearchChange = (newSearch) => {
        setSearch(newSearch);
        setPage(0); 
    };

    const saveContact = async (contact, selectedContact) => {
        const method = selectedContact ? "PUT" : "POST";
        const url = selectedContact ? `/contacts/${selectedContact.id}` : "/contacts";
        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contact),
        });
        loadContacts(page, search);
    };

    return {
        contacts,
        search,
        setSearch,
        page,
        setPage,
        totalPages,
        handleDelete,
        handleLoadDetails,
        saveContact,
        loadContacts,
        handleSearchChange
    };
};

export default useContacts;