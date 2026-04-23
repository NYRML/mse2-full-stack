import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <div className="navbar">
      <h2>Lost & Found Portal</h2>
      <div>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>
    </div>
  );
}