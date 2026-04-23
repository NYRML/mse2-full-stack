import { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    itemName: '', description: '', type: 'lost', location: '', date: '', contactInfo: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await API.get('/items');
      setItems(res.data);
      setFilteredItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = items.filter(item =>
      item.itemName.toLowerCase().includes(term) ||
      item.type.toLowerCase().includes(term)
    );
    setFilteredItems(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/items/${editingId}`, form);
        setMessage('Item updated');
      } else {
        await API.post('/items', form);
        setMessage('Item added');
      }
      setForm({ itemName: '', description: '', type: 'lost', location: '', date: '', contactInfo: '' });
      setEditingId(null);
      fetchItems();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleEdit = (item) => {
    setForm({
      itemName: item.itemName,
      description: item.description,
      type: item.type,
      location: item.location,
      date: item.date.split('T')[0],
      contactInfo: item.contactInfo
    });
    setEditingId(item._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this item?')) {
      await API.delete(`/items/${id}`);
      fetchItems();
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Report an Item</h2>
        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input name="itemName" placeholder="Item Name" value={form.itemName} onChange={(e) => setForm({...form, itemName: e.target.value})} required />
          <textarea name="description" placeholder="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} required />
          <select name="type" value={form.type} onChange={(e) => setForm({...form, type: e.target.value})}>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
          <input name="location" placeholder="Location" value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} required />
          <input name="date" type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} required />
          <input name="contactInfo" placeholder="Contact (phone/email)" value={form.contactInfo} onChange={(e) => setForm({...form, contactInfo: e.target.value})} required />
          <button type="submit">{editingId ? 'Update Item' : 'Add Item'}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ itemName: '', description: '', type: 'lost', location: '', date: '', contactInfo: '' }); }}>Cancel</button>}
        </form>

        <div className="search-bar">
          <input type="text" placeholder="Search by name or category (lost/found)" value={searchTerm} onChange={handleSearch} />
        </div>

        <h2>All Items</h2>
        <div className="item-list">
          {filteredItems.map(item => (
            <div className="card" key={item._id}>
              <h3>{item.itemName} <span style={{ color: item.type === 'lost' ? 'red' : 'green' }}>({item.type})</span></h3>
              <p><strong>Description:</strong> {item.description}</p>
              <p><strong>Location:</strong> {item.location}</p>
              <p><strong>Date:</strong> {new Date(item.date).toDateString()}</p>
              <p><strong>Contact:</strong> {item.contactInfo}</p>
              <p><strong>Reported by:</strong> {item.user?.name} ({item.user?.email})</p>
              <button onClick={() => handleEdit(item)}>Edit</button>
              <button onClick={() => handleDelete(item._id)} style={{ background: '#dc3545', marginLeft: '10px' }}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}