import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
    const [contacts, setContacts] = useState([]);
    const [search, setSearch] = useState('');
    const [sortOption, setSortOption] = useState('id-ascending');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [contactToDelete, setContactToDelete] = useState(null); 

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
        setContacts(contacts.filter((contact) => contact.id !== id));
        fetch(`http://localhost:5000/contacts/${id}`, {
            method: 'DELETE',
        }).then(() => {
            setShowDeleteModal(false)
        })
    };

    const openDeleteModal = (contact) => {
        setShowDeleteModal(true)
        setContactToDelete(contact)
    }

    const closeDeleteModal = () => {
        setShowDeleteModal(false)
        setContactToDelete(null)
    }

    const handleEdit = (contact) => {
        // Mengubah kontak menjadi editable
        setContacts(contacts.map((item) =>
            item.id === contact.id ? { ...item, editing: true } : item
        ));
    };

    const handleSaveEdit = (id, name, phone, avatarFile) => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('phone', phone);

        // Jika ada file avatar, tambahkan ke formData
        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        // Mengirim data menggunakan fetch
        fetch(`http://localhost:5000/contacts/${id}`, {
            method: 'PUT',
            body: formData,
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

    const handleAvatarChange = (e, contactId) => {
        const file = e.target.files[0];
        if (file) {
            setContacts(contacts.map(item =>
                item.id === contactId ? { ...item, avatarFile: file } : item
            ));
        }
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

                                    {/* Input untuk memilih avatar baru */}
                                    <input
                                        type="file"
                                        onChange={(e) => handleAvatarChange(e, contact.id)}
                                    />

                                    <button
                                        className="btn save-btn"
                                        onClick={() =>
                                            handleSaveEdit(contact.id, contact.name, contact.phone, contact.avatarFile)
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
                                <div className="contact-item">
                                    <div className="avatar">
                                        <img
                                            src={contact.avatar || 'images.png'}
                                            alt={contact.name}
                                            className="avatar-img"
                                        />
                                    </div>
                                    <div className="contact-info">
                                        <h5 className="card-title">{contact.name}</h5>
                                        <p className="card-text">{contact.phone}</p>
                                    </div>
                                    <div className="card-actions">
                                        <button
                                            className="btn edit-btn"
                                            onClick={() => handleEdit(contact)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn delete-btn"
                                            onClick={() => openDeleteModal(contact)}
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

            {/* Modal Delete */}
            {showDeleteModal && contactToDelete && (
                <div className='modal'>
                    <div className="modal-content">
                        <h4>Are you sure you want to delete this contact?</h4>
                        <p>{contactToDelete.name} ({contactToDelete.phone})</p>
                        <button
                            className="btn delete-confirm-btn"
                            onClick={() => handleDelete(contactToDelete.id)}
                        >
                            Delete
                        </button>
                        <button
                            className="btn cancel-btn"
                            onClick={closeDeleteModal}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LandingPage;
