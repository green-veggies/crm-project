const Contact = require('../models/Contact');

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createContact = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, company, jobTitle } = req.body;

  const newContact = new Contact({
    firstName,
    lastName,
    email,
    phoneNumber,
    company,
    jobTitle
  });

  try {
    const contact = await newContact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// exports.getContactById = async (req, res) => {
//   try {
//     const contact = await Contact.findById(req.params.id);
//     if (!contact) {
//       return res.status(404).json({ message: 'Contact not found' });
//     }
//     res.json(contact);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
