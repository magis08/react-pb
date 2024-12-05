const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Contact, sequelize } = require('./models/contact');

sequelize.authenticate()
  .then(() => {
    console.log('Koneksi ke database berhasil!');
  })
  .catch(err => {
    console.error('Tidak dapat terhubung ke database:', err);
  });

sequelize.sync({ force: false }) // Set ke true jika ingin menghapus tabel lama dan membuat ulang
  .then(() => {
    console.log('Tabel berhasil disinkronkan.');
  })
  .catch(err => {
    console.error('Gagal menyinkronkan tabel:', err);
  });

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Sinkronisasi Database
sequelize.sync();

// Routes API
app.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.findAll();
    res.json(contacts);
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/contacts', async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.json(contact);
  } catch (err) {
    console.error('Error creating contact:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/contacts/:id', async (req, res) => {
  try {
    console.log(req.params.id)
    const { id } = req.params;
    const { name, phone } = req.body;

    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    contact.name = name;
    contact.phone = phone;
    await contact.save();

    res.json(contact);
  } catch (err) {
    console.error('Error updating contact:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await Contact.destroy({ where: { id } });
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted' });
  } catch (err) {
    console.error('Error deleting contact:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
