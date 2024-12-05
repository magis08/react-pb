import React from 'react';
import { useNavigate } from 'react-router-dom';

function AddContactPage() {
  const navigate = useNavigate();

  const addContact = (contact) => {
    fetch('http://localhost:5000/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    })
      .then((res) => res.json())
      .then(() => {
        navigate('/');
      });
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Add Contact</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const name = e.target.name.value;
          const phone = e.target.phone.value;
          addContact({ name, phone });
          e.target.reset();
        }}
        className="mx-auto"
        style={{ maxWidth: '400px' }}
      >
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input id="name" name="name" type="text" className="form-control" required />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input id="phone" name="phone" type="text" className="form-control" required />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Add Contact
        </button>
      </form>
    </div>
  );
}

export default AddContactPage;
