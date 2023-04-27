import { Link } from 'react-router-dom';
import './AdminNav.css'
function AdminNav() {
    return (
        <nav className="navbar">
            <h1 className="logo">Parking</h1>
            <div className="menu-icon">
            </div>
            <ul className='nav-links'>
                <Link to="/admin" className='home'>
                    <li>Admin</li>
                </Link>
                <Link to="/add-slot" className='add-slot'>
                    <li>Add Slot</li>
                </Link>

                <Link to="/show-slot-admin" className='show-slot'>
                    <li>Show Slot</li>
                </Link>
                <Link to="/logout" className='login'>
                    <li>Log out</li>
                </Link>
            </ul>
        </nav>

    )
}
export default AdminNav;