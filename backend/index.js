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
  const contacts = await Contact.findAll();
  res.json(contacts);
});

app.post('/contacts', async (req, res) => {
  const contact = await Contact.create(req.body);
  res.json(contact);
});

app.delete('/contacts/:id', async (req, res) => {
  await Contact.destroy({ where: { id: req.params.id } });
  res.json({ message: 'Contact deleted' });
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
