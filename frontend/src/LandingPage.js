import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
    const [contacts, setContacts] = useState([]);
    const [search, setSearch] = useState('');
    const [sortOption, setSortOption] = useState('id-ascending');

    useEffect(() => {
        fetch('http://localhost:5000/contacts')
            .then((res) => res.json())
            .then((data) => setContacts(data));
    }, []);

    const sortedContacts = [...contacts].sort((a, b) => {
        const [option, direction] = sortOption.split('-'); // Split option and direction

        if (option === 'name') {
            return direction === 'ascending'
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        }

        // Default to sorting by ID (ascending)
        return a.id - b.id;
    });

    const filteredContacts = sortedContacts.filter((contact) =>
        contact.name.toLowerCase().includes(search.toLowerCase()) ||
        contact.phone.toLowerCase().includes(search.toLowerCase())
    );

    const handleSortChange = () => {
        if (sortOption === 'id-ascending') {
            setSortOption('name-ascending');
        } else if (sortOption === 'name-ascending') {
            setSortOption('name-descending');
        } else {
            setSortOption('name-ascending');
        }
    };

    const handleDelete = (id) => {
        // Menghapus kontak dari daftar lokal
        setContacts(contacts.filter((contact) => contact.id !== id));
        // Menghapus kontak di server
        fetch(`http://localhost:5000/contacts/${id}`, {
            method: 'DELETE',
        });
    };

    const handleEdit = (contact) => {
        // Mengubah kontak menjadi editable
        setContacts(contacts.map((item) =>
            item.id === contact.id ? { ...item, editing: true } : item
        ));
    };

    const handleSaveEdit = (id, name, phone) => {
        const updatedContact = { id, name, phone };
        fetch(`http://localhost:5000/contacts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedContact),
        })
            .then((res) => res.json())
            .then((updatedContact) => {
                setContacts(contacts.map((contact) =>
                    contact.id === updatedContact.id ? updatedContact : contact
                ));
            })
            .catch((error) => console.error('Error updating contact:', error));
    };

    const handleCancelEdit = (id) => {
        // Mengembalikan kontak ke status sebelumnya tanpa menyimpan perubahan
        setContacts(contacts.map((contact) =>
            contact.id === id ? { ...contact, editing: false } : contact
        ));
    };

    return (
        <div className="container">
            <h1 className="header">Phonebook</h1>

            {/* Header Controls */}
            <div className="controls">
                {/* Sorting */}
                <div className="control left">
                    <button
                        type="button"
                        className="btn sort-btn"
                        onClick={handleSortChange}
                    >
                        {sortOption === 'name-ascending' ? '(Ascending)' : '(Descending)'}
                    </button>
                </div>

                {/* Searching */}
                <div className="control center">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Browse"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Add Contact Button */}
                <div className="control right">
                    <Link to="/add" className="btn add-btn">
                        Add Contact
                    </Link>
                </div>
            </div>

            {/* Contact List */}
            <div className="contact-list">
                {filteredContacts.map((contact) => (
                    <div key={contact.id} className="card">
                        <div className="card-body">
                            {contact.editing ? (
                                <div>
                                    <input
                                        type="text"
                                        value={contact.name}
                                        onChange={(e) =>
                                            setContacts(contacts.map((item) =>
                                                item.id === contact.id
                                                    ? { ...item, name: e.target.value }
                                                    : item
                                            ))
                                        }
                                    />
                                    <input
                                        type="text"
                                        value={contact.phone}
                                        onChange={(e) =>
                                            setContacts(contacts.map((item) =>
                                                item.id === contact.id
                                                    ? { ...item, phone: e.target.value }
                                                    : item
                                            ))
                                        }
                                    />
                                    <button
                                        className="btn save-btn"
                                        onClick={() =>
                                            handleSaveEdit(contact.id, contact.name, contact.phone)
                                        }
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="btn cancel-btn"
                                        onClick={() => handleCancelEdit(contact.id)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <h5 className="card-title">{contact.name}</h5>
                                    <p className="card-text">{contact.phone}</p>
                                    <div className="card-actions">
                                        <button
                                            className="btn edit-btn"
                                            onClick={() => handleEdit(contact)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn delete-btn"
                                            onClick={() => handleDelete(contact.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LandingPage;
