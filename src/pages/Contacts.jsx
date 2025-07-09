import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import '../styles/style.css';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get('https://jsonplaceholder.typicode.com/users');
        setContacts(res.data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };
    fetchContacts();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="welcome-page">
      <header className="header">
        <h2>Contact List</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <div className="contacts-grid">
        {contacts.map(contact => {
          const initial = contact.name.charAt(0).toUpperCase();
          const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${initial}`;

          return (
            <div className="contact-card" key={contact.id}>
              <img src={avatarUrl} alt={contact.name} className="avatar" />
              <div className="contact-info">
                <h3>{contact.name}</h3>
                <p>{contact.email}</p>
                <p>{contact.phone}</p>
                <p>{contact.website}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
