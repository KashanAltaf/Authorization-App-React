// src/pages/Contacts.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/style.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 7;

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(res => setContacts(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const roleText = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User';

  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);

  const nextPage = () => {
    if (indexOfLastContact < contacts.length) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const closeModal = () => setSelectedContact(null);

return (
  <div className="contacts-page">
    <header className="header">
      <h2>Welcome, <span>{roleText}</span>!</h2>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </header>

    <main className="contacts-content">
      
      <div className="contacts-table-container">
        <table className="contacts-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentContacts.map((contact, idx) => (
              <tr key={contact.id}>
                <td>{indexOfFirstContact + idx + 1}</td>
                <td>{contact.name}</td>
                <td>{contact.phone}</td>
                <td>
                  <button className="view-btn" onClick={() => setSelectedContact(contact)}>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-buttons">
        <button onClick={prevPage} disabled={currentPage === 1}>&larr; Prev</button>
        <span>Page {currentPage}</span>
        <button onClick={nextPage} disabled={indexOfLastContact >= contacts.length}>Next &rarr;</button>
      </div>
    </main>

    {selectedContact && (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="contact-modal" onClick={e => e.stopPropagation()}>
          <img
            className="contact-avatar"
            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${selectedContact.name.charAt(0)}`}
            alt="avatar"
          />
          <div className="contact-info">
            <h3>{selectedContact.name}</h3>
            <p><strong>Email:</strong> {selectedContact.email}</p>
            <p><strong>Phone:</strong> {selectedContact.phone}</p>
            <p><strong>Company:</strong> {selectedContact.company?.name}</p>
            <p><strong>Website:</strong> {selectedContact.website}</p>
            <button onClick={closeModal} className="close-btn">Close</button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}