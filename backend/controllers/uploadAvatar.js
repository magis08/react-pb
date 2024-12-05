const fs = require('fs');
const path = require('path');
const { Contact } = require('../models/contact'); 

const uploadAvatar = (req, res) => {
    if (!req.files || !req.files.avatar) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.files.avatar;
    const uploadDir = path.join(__dirname, '..', 'uploads', 'avatars'); 

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, file.name);

    file.mv(filePath, async (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error moving file', error: err });
        }

        try {
            const contact = await Contact.create({
                name: req.body.name,
                phone: req.body.phone,
                avatar: '/uploads/avatars/' + file.name,
            });

            return res.json({ message: 'Avatar uploaded successfully', contact });
        } catch (error) {
            console.error('Error saving contact:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    });
};

module.exports = { uploadAvatar };
