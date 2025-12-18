import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const removeFavorite = (e, library) => {
    e.stopPropagation();

    const newFavorites = favorites.filter((fav) => fav.id !== library.id);
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));

    notifications.show({
      title: "O'chirildi",
      message: `"${library.name}" sevimlilardan olib tashlandi`,
      color: 'orange',
      autoClose: 2000,
    });
  };

  const clearAllFavorites = () => {
    if (favorites.length === 0) return;

    if (window.confirm("Barcha sevimli kutubxonalarni o'chirmoqchimisiz?")) {
      setFavorites([]);
      localStorage.removeItem('favorites');

      notifications.show({
        title: 'Tozalandi',
        message: "Barcha sevimlilar o'chirildi",
        color: 'blue',
        autoClose: 2000,
      });
    }
  };

  const filteredFavorites = favorites.filter(
    (library) =>
      library.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      library.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Notifications position="top-right" zIndex={1000} />
      <style>{`
        .favorites-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0a1e 0%, #1e1b4b 100%);
          padding: 30px 40px;
        }

        .favorites-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .back-btn {
          background: rgba(139, 92, 246, 0.2);
          border: 2px solid rgba(139, 92, 246, 0.4);
          color: #a78bfa;
          padding: 10px 20px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .back-btn:hover {
          background: rgba(139, 92, 246, 0.3);
          border-color: #8b5cf6;
        }

        .page-title {
          color: white;
          font-size: 28px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .title-count {
          color: #a78bfa;
          font-size: 18px;
          font-weight: 600;
        }

        .clear-btn {
          background: rgba(239, 68, 68, 0.2);
          border: 2px solid rgba(239, 68, 68, 0.4);
          color: #ef4444;
          padding: 10px 20px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .clear-btn:hover {
          background: rgba(239, 68, 68, 0.3);
          border-color: #ef4444;
        }

        .clear-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .search-section {
          background: rgba(30, 27, 75, 0.6);
          border: 2px solid rgba(139, 92, 246, 0.3);
          border-radius: 16px;
          padding: 25px;
          margin-bottom: 25px;
        }

        .search-input {
          width: 100%;
          padding: 14px 20px;
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(139, 92, 246, 0.4);
          border-radius: 12px;
          color: white;
          font-size: 15px;
        }

        .search-input:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2);
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .favorites-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .favorite-card {
          background: rgba(30, 27, 75, 0.6);
          border: 2px solid rgba(139, 92, 246, 0.3);
          border-radius: 16px;
          padding: 25px;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
        }

        .favorite-card:hover {
          background: rgba(30, 27, 75, 0.8);
          border-color: #8b5cf6;
          transform: translateY(-5px);
          box-shadow: 0 12px 28px rgba(139, 92, 246, 0.3);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .library-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .remove-btn {
          background: rgba(239, 68, 68, 0.2);
          border: 2px solid rgba(239, 68, 68, 0.4);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 18px;
        }

        .remove-btn:hover {
          background: rgba(239, 68, 68, 0.4);
          border-color: #ef4444;
          transform: rotate(90deg);
        }

        .card-body {
          margin-top: 16px;
        }

        .library-name {
          color: white;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .library-info {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
        }

        .info-icon {
          font-size: 16px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          border: 2px solid;
          margin-top: 12px;
        }

        .status-active {
          background: rgba(34, 197, 94, 0.2);
          border-color: #22c55e;
          color: #22c55e;
        }

        .status-inactive {
          background: rgba(239, 68, 68, 0.2);
          border-color: #ef4444;
          color: #ef4444;
        }

        .empty-state {
          text-align: center;
          padding: 100px 20px;
          color: #a78bfa;
          background: rgba(30, 27, 75, 0.4);
          border-radius: 16px;
          border: 2px dashed rgba(139, 92, 246, 0.3);
        }

        .empty-icon {
          font-size: 80px;
          margin-bottom: 20px;
        }

        .empty-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 12px;
          color: white;
        }

        .empty-text {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 30px;
        }

        .empty-btn {
          background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
          color: white;
          font-weight: 700;
          padding: 14px 32px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .empty-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
        }

        @media (max-width: 768px) {
          .favorites-grid {
            grid-template-columns: 1fr;
          }

          .favorites-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }
        }
      `}</style>

      <main className="favorites-container">
        <div className="favorites-header">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate('/')}>
              <span>←</span>
              <span>Orqaga</span>
            </button>
            <h1 className="page-title">
              <span>❤️</span>
              <span>Sevimli Kutubxonalar</span>
              <span className="title-count">({favorites.length} ta)</span>
            </h1>
          </div>
          <button
            className="clear-btn"
            onClick={clearAllFavorites}
            disabled={favorites.length === 0}>
            🗑️ Barchasini o'chirish
          </button>
        </div>

        {favorites.length > 0 && (
          <div className="search-section">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Sevimlilar ichidan qidiring..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {filteredFavorites.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              {favorites.length === 0 ? '💔' : '🔍'}
            </div>
            <h2 className="empty-title">
              {favorites.length === 0
                ? "Sevimli kutubxonalar yo'q"
                : 'Kutubxona topilmadi'}
            </h2>
            <p className="empty-text">
              {favorites.length === 0
                ? "Kutubxonalarni sevimlilar ro'yxatiga qo'shish uchun ♥ tugmasini bosing"
                : `"${searchQuery}" bo'yicha hech narsa topilmadi`}
            </p>
            {favorites.length === 0 && (
              <button className="empty-btn" onClick={() => navigate('/')}>
                Kutubxonalarni ko'rish
              </button>
            )}
          </div>
        ) : (
          <div className="favorites-grid">
            {filteredFavorites.map((library) => (
              <div
                key={library.id}
                className="favorite-card"
                onClick={() => navigate(`/detail/${library.id}`)}>
                <div className="card-header">
                  <div className="library-icon">📚</div>
                  <button
                    className="remove-btn"
                    onClick={(e) => removeFavorite(e, library)}>
                    ✕
                  </button>
                </div>

                <div className="card-body">
                  <h3 className="library-name">{library.name}</h3>

                  <div className="library-info">
                    <div className="info-item">
                      <span className="info-icon">📍</span>
                      <span>{library.address}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">📖</span>
                      <span>{library.total_books || 0} ta kitob</span>
                    </div>
                  </div>

                  <div>
                    <span
                      className={`status-badge ${
                        library.is_active ? 'status-active' : 'status-inactive'
                      }`}>
                      {library.is_active ? '✓ Faol' : '✗ Nofaol'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default Favorites;
