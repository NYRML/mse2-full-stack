import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ itemName: '', description: '', type: 'Lost', location: '', contactInfo: '' });
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchItems = async () => {
    const { data } = await API.get('/items');
    setItems(data);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/items/${editId}`, form);
        setMsg('Item updated!');
        setEditId(null);
      } else {
        await API.post('/items', form);
        setMsg('Item added!');
      }
      setForm({ itemName: '', description: '', type: 'Lost', location: '', contactInfo: '' });
      fetchItems();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    await API.delete(`/items/${id}`);
    fetchItems();
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setForm({ itemName: item.itemName, description: item.description, type: item.type, location: item.location, contactInfo: item.contactInfo });
  };

  const handleSearch = async () => {
    if (!search.trim()) { fetchItems(); return; }
    const { data } = await API.get(`/items/search?name=${search}`);
    setItems(data);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <span>🔍 Lost & Found — Welcome, {user?.name}</span>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </nav>
      <div className="content">
        <div className="card">
          <h3>{editId ? '✏️ Edit Item' : '➕ Add Item'}</h3>
          {msg && <p className="msg">{msg}</p>}
          <form onSubmit={handleSubmit} className="item-form">
            <input name="itemName" placeholder="Item Name" value={form.itemName} onChange={handleChange} required />
            <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
            <select name="type" value={form.type} onChange={handleChange}>
              <option>Lost</option>
              <option>Found</option>
            </select>
            <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
            <input name="contactInfo" placeholder="Contact Info" value={form.contactInfo} onChange={handleChange} />
            <button type="submit">{editId ? 'Update Item' : 'Add Item'}</button>
            {editId && <button type="button" onClick={() => { setEditId(null); setForm({ itemName: '', description: '', type: 'Lost', location: '', contactInfo: '' }); }}>Cancel</button>}
          </form>
        </div>
        <div className="card">
          <h3>🔎 Search Items</h3>
          <div className="search-row">
            <input placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} />
            <button onClick={handleSearch}>Search</button>
            <button onClick={() => { setSearch(''); fetchItems(); }}>Clear</button>
          </div>
        </div>
        <div className="card">
          <h3>📋 All Items ({items.length})</h3>
          {items.length === 0 ? <p>No items found.</p> :
            <div className="items-grid">
              {items.map(item => (
                <div key={item._id} className={`item-card ${item.type === 'Lost' ? 'lost' : 'found'}`}>
                  <div className="item-badge">{item.type}</div>
                  <h4>{item.itemName}</h4>
                  <p>{item.description}</p>
                  <p>📍 {item.location}</p>
                  <p>📞 {item.contactInfo}</p>
                  <p>🗓 {new Date(item.date).toLocaleDateString()}</p>
                  <div className="item-actions">
                    <button onClick={() => handleEdit(item)}>Edit</button>
                    <button className="del-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
      </div>
    </div>
  );
}
