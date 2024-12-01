import React, { useEffect, useState } from 'react';

function App() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/contacts')
      .then((res) => res.json())
      .then((data) => setContacts(data));
  }, []);

  const addContact = (contact) => {
    fetch('http://localhost:5000/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    })
      .then((res) => res.json())
      .then((newContact) => setContacts([...contacts, newContact]));
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const name = e.target.name.value;
          const phone = e.target.phone.value;
          addContact({ name, phone });
          e.target.reset();
        }}
      >
        <input name="name" placeholder="Name" required />
        <input name="phone" placeholder="Phone" required />
        <button type="submit">Add</button>
      </form>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            {contact.name} - {contact.phone}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
    