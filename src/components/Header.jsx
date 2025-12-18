import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { API } from '../centerAPI/API';
const Header = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [name, setName] = useState();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user?.name || 'Admin';
  const getName = async () => {
    try {
      const res = await API.get('/auth/admin/profile/');
      setName(res.data.name);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getName();
  }, []);
  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/login');
  };

  return (
    <>
      <style>{`
        .admin-header {
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
          padding: 0 40px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 2px solid rgba(139, 92, 246, 0.3);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 40px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .logo:hover {
          transform: scale(1.05);
        }

        .logo-icon {
          width: 45px;
          height: 45px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }

        .logo-text {
          font-size: 22px;
          font-weight: 800;
          color: white;
          letter-spacing: 0.5px;
        }

        .nav-links {
          display: flex;
          gap: 8px;
        }

        .nav-btn {
          padding: 10px 20px;
          background: transparent;
          border: 2px solid transparent;
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-btn:hover {
          background: rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.5);
          color: white;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .search-box {
          position: relative;
        }

        .search-input {
          width: 300px;
          padding: 10px 40px 10px 16px;
          background: rgba(0, 0, 0, 0.3);
          border: 2px solid rgba(139, 92, 246, 0.3);
          border-radius: 12px;
          color: white;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #8b5cf6;
          background: rgba(0, 0, 0, 0.4);
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .search-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.5);
          font-size: 18px;
        }

        .profile-section {
          position: relative;
        }

        .profile-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          background: rgba(139, 92, 246, 0.2);
          border: 2px solid rgba(139, 92, 246, 0.4);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .profile-btn:hover {
          background: rgba(139, 92, 246, 0.3);
          border-color: #8b5cf6;
          transform: translateY(-2px);
        }

        .profile-avatar {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
          color: white;
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4);
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .profile-name {
          font-size: 14px;
          font-weight: 600;
          color: white;
          line-height: 1.2;
        }

        .profile-role {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }

        .profile-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 220px;
          background: #1e1b4b;
          border: 2px solid rgba(139, 92, 246, 0.4);
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          overflow: hidden;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-item {
          padding: 14px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
        }

        .dropdown-item:hover {
          background: rgba(139, 92, 246, 0.2);
          color: white;
        }

        .dropdown-item.danger {
          color: #ef4444;
        }

        .dropdown-item.danger:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        .dropdown-divider {
          height: 1px;
          background: rgba(139, 92, 246, 0.2);
          margin: 4px 0;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: #1e1b4b;
          border: 2px solid rgba(139, 92, 246, 0.4);
          border-radius: 16px;
          padding: 30px;
          max-width: 420px;
          width: 90%;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .modal-icon {
          width: 70px;
          height: 70px;
          background: rgba(239, 68, 68, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          margin: 0 auto 20px;
        }

        .modal-title {
          font-size: 22px;
          font-weight: 700;
          color: white;
          text-align: center;
          margin-bottom: 12px;
        }

        .modal-text {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
          margin-bottom: 30px;
          line-height: 1.5;
        }

        .modal-buttons {
          display: flex;
          gap: 12px;
        }

        .modal-btn {
          flex: 1;
          padding: 12px 24px;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .modal-btn-cancel {
          background: rgba(139, 92, 246, 0.2);
          color: white;
          border: 2px solid rgba(139, 92, 246, 0.4);
        }

        .modal-btn-cancel:hover {
          background: rgba(139, 92, 246, 0.3);
          border-color: #8b5cf6;
        }

        .modal-btn-confirm {
          background: #ef4444;
          color: white;
        }

        .modal-btn-confirm:hover {
          background: #dc2626;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }

        @media (max-width: 768px) {
          .admin-header {
            padding: 0 20px;
          }
          .search-input {
            width: 200px;
          }
          .nav-links {
            display: none;
          }
          .profile-info {
            display: none;
          }
        }
      `}</style>

      <header className="admin-header">
        <div className="header-left">
          <div className="logo" onClick={() => navigate('/')}>
            <div className="logo-icon">📚</div>
            <span className="logo-text">Mutolaa Admin</span>
          </div>

          <nav className="nav-links">
            <button className="nav-btn" onClick={() => navigate('/')}>
              <span>📊</span>
              <span>Dashboard</span>
            </button>
            <button className="nav-btn" onClick={() => navigate('/addLibrary')}>
              <span>➕</span>
              <span>Kutubxona qo'shish</span>
            </button>
          </nav>
        </div>

        <div className="header-right">
          <div className="profile-section">
            <div
              className="profile-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}>
              <div className="profile-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="profile-info">
                <div className="profile-name">{name}</div>
                <div className="profile-role">Administrator</div>
              </div>
            </div>

            {showProfileMenu && (
              <div className="profile-dropdown">
                <button className="dropdown-item">
                  <span>👤</span>
                  <span>Profilni ko'rish</span>
                </button>
                <button className="dropdown-item">
                  <span>⚙️</span>
                  <span>Sozlamalar</span>
                </button>
                <div className="dropdown-divider"></div>
                <button
                  className="dropdown-item danger"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowLogoutModal(true);
                  }}>
                  <span>🚪</span>
                  <span>Chiqish</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {showLogoutModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowLogoutModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <h2 className="modal-title">Tizimdan chiqish</h2>
            <p className="modal-text">
              Haqiqatan ham tizimdan chiqmoqchimisiz? Barcha saqlanmagan
              o'zgarishlar yo'qoladi.
            </p>
            <div className="modal-buttons">
              <button
                className="modal-btn modal-btn-cancel"
                onClick={() => setShowLogoutModal(false)}>
                Bekor qilish
              </button>
              <button
                className="modal-btn modal-btn-confirm"
                onClick={handleLogout}>
                Ha, chiqish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
