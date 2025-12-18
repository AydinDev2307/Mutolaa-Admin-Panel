import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../centerAPI/API';
import { Loader } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

const Home = () => {
  const navigate = useNavigate();
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [setHoveredId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchLibraries();
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const toggleFavorite = (e, library) => {
    e.stopPropagation();

    const isFavorite = favorites.some((fav) => fav.id === library.id);
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter((fav) => fav.id !== library.id);
      notifications.show({
        title: 'Sevimlilardan olib tashlandi',
        message: `"${library.name}" sevimlilardan olib tashlandi`,
        color: 'blue',
        autoClose: 2000,
      });
    } else {
      newFavorites = [...favorites, library];
      notifications.show({
        title: "Sevimlilarga qo'shildi",
        message: `"${library.name}" sevimlilar ro\'yxatiga qo\'shildi`,
        color: 'green',
        autoClose: 2000,
      });
    }

    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (libraryId) => {
    return favorites.some((fav) => fav.id === libraryId);
  };

  const fetchLibraries = async () => {
    try {
      const res = await API.get('/libraries/libraries/');
      setLibraries(res.data);
    } catch (err) {
      console.error('❌ Kutubxonalarni yuklashda xato:', err);
      if (err.response?.status === 401) {
        notifications.show({
          title: 'Sessiya tugadi',
          message: 'Iltimos, qaytadan login qiling',
          color: 'red',
        });
        localStorage.clear();
        window.location.href = '/login';
      } else {
        notifications.show({
          title: 'Xato',
          message:
            err.response?.data?.detail || 'Kutubxonalarni yuklashda xatolik',
          color: 'red',
          autoClose: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const updateActiveStatus = async (library, status) => {
    if (updatingId === library.id) return;

    try {
      setUpdatingId(library.id);
      const url = status
        ? `/libraries/library/activate/${library.id}/`
        : `/libraries/library/deactivate/${library.id}/`;

      await API.patch(url, { is_active: status });

      setLibraries((prev) =>
        prev.map((item) =>
          item.id === library.id ? { ...item, is_active: status } : item
        )
      );

      setOpenMenuId(null);

      notifications.show({
        title: 'Muvaffaqiyatli!',
        message: status
          ? `"${library.name}" kutubxonasi faollashtirildi ✅`
          : `"${library.name}" kutubxonasi faolsizlantirildi ⛔`,
        color: 'green',
        autoClose: 3000,
      });
    } catch (err) {
      console.error('❌ Faollashtirishda xato:', err);
      notifications.show({
        title: 'Xato!',
        message: 'Faollashtirishda xatolik yuz berdi',
        color: 'red',
        autoClose: 5000,
      });
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId !== null && !event.target.closest('.menu-container')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery]);

  if (loading) {
    return (
      <div
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          background: 'linear-gradient(135deg, #0f0a1e 0%, #1e1b4b 100%)',
        }}>
        <Loader size="xl" color="violet" />
        <h1 style={{ color: '#a78bfa', fontSize: '24px' }}>
          Kutubxonalar yuklanmoqda...
        </h1>
      </div>
    );
  }

  const filteredLibraries = libraries.filter((library) => {
    const matchesSearch =
      library.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      library.address.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'all') return true;
    if (filter === 'active') return library.is_active;
    if (filter === 'inactive') return !library.is_active;
    if (filter === 'most') {
      const maxBooks = Math.max(...libraries.map((l) => l.total_books || 0));
      return (library.total_books || 0) >= maxBooks * 0.7;
    }
    if (filter === 'least') {
      const avgBooks =
        libraries.reduce((sum, l) => sum + (l.total_books || 0), 0) /
        libraries.length;
      return (library.total_books || 0) < avgBooks * 0.5;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredLibraries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLibraries = filteredLibraries.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '30px 0',
          gap: '10px',
        }}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: '10px 20px',
            border: '2px solid #8b5cf6',
            borderRadius: '8px',
            background:
              currentPage === 1
                ? 'rgba(139, 92, 246, 0.1)'
                : 'rgba(139, 92, 246, 0.2)',
            color: '#a78bfa',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            opacity: currentPage === 1 ? 0.5 : 1,
          }}>
          ← Oldingi
        </button>

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              style={{
                padding: '10px 15px',
                border: `2px solid ${
                  page === currentPage ? '#8b5cf6' : 'rgba(139, 92, 246, 0.4)'
                }`,
                borderRadius: '8px',
                background:
                  page === currentPage ? '#8b5cf6' : 'rgba(139, 92, 246, 0.1)',
                color: page === currentPage ? 'white' : '#a78bfa',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
              }}>
              {page}
            </button>
          );
        })}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: '10px 20px',
            border: '2px solid #8b5cf6',
            borderRadius: '8px',
            background:
              currentPage === totalPages
                ? 'rgba(139, 92, 246, 0.1)'
                : 'rgba(139, 92, 246, 0.2)',
            color: '#a78bfa',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            opacity: currentPage === totalPages ? 0.5 : 1,
          }}>
          Keyingi →
        </button>
      </div>
    );
  };

  return (
    <>
      <Notifications position="top-right" zIndex={1000} />
      <style>{`
        .home-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0a1e 0%, #1e1b4b 100%);
          padding: 30px 40px;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .dashboard-title {
          color: white;
          font-size: 28px;
          font-weight: 700;
        }

        .dashboard-count {
          color: #a78bfa;
          font-size: 18px;
          font-weight: 600;
          margin-left: 10px;
        }

        .favorites-badge {
          background: rgba(139, 92, 246, 0.2);
          border: 2px solid rgba(139, 92, 246, 0.4);
          border-radius: 12px;
          padding: 10px 20px;
          color: #a78bfa;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .favorites-badge:hover {
          background: rgba(139, 92, 246, 0.3);
          border-color: #8b5cf6;
          transform: translateY(-2px);
        }

        .favorites-count {
          background: #8b5cf6;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
        }

        .search-filter-section {
          background: rgba(30, 27, 75, 0.6);
          border: 2px solid rgba(139, 92, 246, 0.3);
          border-radius: 16px;
          padding: 25px;
          margin-bottom: 25px;
        }

        .search-box-main {
          margin-bottom: 20px;
        }

        .search-input-main {
          width: 100%;
          padding: 14px 20px;
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(139, 92, 246, 0.4);
          border-radius: 12px;
          color: white;
          font-size: 15px;
        }

        .search-input-main:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2);
        }

        .search-input-main::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .filter-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 10px 20px;
          background: rgba(139, 92, 246, 0.2);
          border: 2px solid rgba(139, 92, 246, 0.4);
          border-radius: 10px;
          color: #a78bfa;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .filter-btn.active {
          background: #8b5cf6;
          border-color: #8b5cf6;
          color: white;
        }

        .filter-btn:hover {
          background: rgba(139, 92, 246, 0.3);
          border-color: #8b5cf6;
        }

        .table-header {
          background: rgba(30, 27, 75, 0.8);
          border: 2px solid rgba(139, 92, 246, 0.4);
          border-radius: 12px;
          padding: 20px 25px;
          display: grid;
          grid-template-columns: 0.5fr 1.5fr 2fr 1fr 1fr 0.8fr;
          gap: 20px;
          margin-bottom: 15px;
        }

        .table-header-item {
          color: #a78bfa;
          font-weight: 700;
          font-size: 15px;
        }

        .library-card {
          background: rgba(30, 27, 75, 0.6);
          border: 2px solid rgba(139, 92, 246, 0.3);
          border-radius: 12px;
          padding: 20px 25px;
          margin-bottom: 12px;
          transition: all 0.3s ease;
          cursor: pointer;
          display: grid;
          grid-template-columns: 0.5fr 1.5fr 2fr 1fr 1fr 0.8fr;
          gap: 20px;
          align-items: center;
        }

        .library-card:hover {
          background: rgba(30, 27, 75, 0.8);
          border-color: #8b5cf6;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
        }

        .like-btn {
          width: 40px;
          height: 40px;
          border: 2px solid rgba(139, 92, 246, 0.4);
          border-radius: 50%;
          background: rgba(139, 92, 246, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .like-btn:hover {
          background: rgba(139, 92, 246, 0.3);
          border-color: #8b5cf6;
          transform: scale(1.1);
        }

        .like-btn.liked {
          background: rgba(239, 68, 68, 0.2);
          border-color: #ef4444;
        }

        .like-btn.liked:hover {
          background: rgba(239, 68, 68, 0.3);
        }

        .library-name {
          color: white;
          font-size: 16px;
          font-weight: 600;
        }

        .library-address {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          border: 2px solid;
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

        .book-count {
          color: #a78bfa;
          font-size: 15px;
          font-weight: 600;
        }

        .menu-container {
          position: relative;
        }

        .menu-btn {
          width: 36px;
          height: 36px;
          border: 2px solid rgba(139, 92, 246, 0.4);
          border-radius: 50%;
          background: rgba(139, 92, 246, 0.2);
          color: #a78bfa;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .menu-btn:hover {
          background: rgba(139, 92, 246, 0.3);
          border-color: #8b5cf6;
        }

        .dropdown-menu {
          position: absolute;
          top: -100px;
          right: 0;
          width: 180px;
          background: #1e1b4b;
          border: 2px solid rgba(139, 92, 246, 0.4);
          border-radius: 12px;
          padding: 8px;
          z-index: 150;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .dropdown-btn {
          width: 100%;
          padding: 10px 16px;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
          margin-bottom: 4px;
        }

        .dropdown-btn:hover {
          background: rgba(139, 92, 246, 0.3);
          color: white;
        }

        .dropdown-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .dropdown-btn.activate {
          color: #22c55e;
        }

        .dropdown-btn.deactivate {
          color: #ef4444;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          color: #a78bfa;
          background: rgba(30, 27, 75, 0.4);
          border-radius: 16px;
          border: 2px dashed rgba(139, 92, 246, 0.3);
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .empty-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 10px;
          color: white;
        }

        .empty-text {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.6);
        }
      `}</style>

      <main className="home-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            Dashboard
            <span className="dashboard-count">
              {filteredLibraries.length} ta kutubxona
            </span>
          </h1>
          <div
            className="favorites-badge"
            onClick={() => navigate('/favorites')}>
            <span>❤️</span>
            <span>Sevimlilar</span>
            {favorites.length > 0 && (
              <span className="favorites-count">{favorites.length}</span>
            )}
          </div>
        </div>

        <div className="search-filter-section">
          <div className="search-box-main">
            <input
              type="text"
              className="search-input-main"
              placeholder="🔍 Kutubxona nomi yoki manzili bo'yicha qidiring..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}>
              Hammasi ({libraries.length})
            </button>
            <button
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}>
              ✅ Faollar ({libraries.filter((l) => l.is_active).length})
            </button>
            <button
              className={`filter-btn ${filter === 'inactive' ? 'active' : ''}`}
              onClick={() => setFilter('inactive')}>
              ⛔ Nofaollar ({libraries.filter((l) => !l.is_active).length})
            </button>
            <button
              className={`filter-btn ${filter === 'most' ? 'active' : ''}`}
              onClick={() => setFilter('most')}>
              📚 Eng ko'p kitoblar
            </button>
            <button
              className={`filter-btn ${filter === 'least' ? 'active' : ''}`}
              onClick={() => setFilter('least')}>
              📖 Eng kam kitoblar
            </button>
          </div>
        </div>

        {filteredLibraries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h2 className="empty-title">Kutubxona topilmadi</h2>
            <p className="empty-text">
              {searchQuery
                ? `"${searchQuery}" bo'yicha hech narsa topilmadi`
                : "Filter bo'yicha kutubxona mavjud emas"}
            </p>
          </div>
        ) : (
          <>
            <div className="table-header">
              <div className="table-header-item">♥</div>
              <div className="table-header-item">Kutubxona</div>
              <div className="table-header-item">Manzil</div>
              <div className="table-header-item">Holat</div>
              <div className="table-header-item">Kitoblar</div>
              <div className="table-header-item">Amallar</div>
            </div>

            {currentLibraries.map((library) => (
              <div
                key={library.id}
                className="library-card"
                onMouseEnter={() => setHoveredId(library.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => navigate(`/detail/${library.id}`)}>
                <div>
                  <button
                    className={`like-btn ${
                      isFavorite(library.id) ? 'liked' : ''
                    }`}
                    onClick={(e) => toggleFavorite(e, library)}>
                    {isFavorite(library.id) ? '❤️' : '🤍'}
                  </button>
                </div>
                <div className="library-name">{library.name}</div>
                <div className="library-address">{library.address}</div>
                <div>
                  <span
                    className={`status-badge ${
                      library.is_active ? 'status-active' : 'status-inactive'
                    }`}>
                    {library.is_active ? '✓ Faol' : '✗ Nofaol'}
                  </span>
                </div>
                <div className="book-count">
                  📚 {library.total_books || 0} ta
                </div>
                <div className="menu-container">
                  <button
                    className="menu-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(
                        openMenuId === library.id ? null : library.id
                      );
                    }}
                    disabled={updatingId === library.id}>
                    {updatingId === library.id ? '⏳' : '⋮'}
                  </button>
                  {openMenuId === library.id && updatingId !== library.id && (
                    <div
                      className="dropdown-menu"
                      onClick={(e) => e.stopPropagation()}>
                      <button
                        className="dropdown-btn activate"
                        onClick={() => updateActiveStatus(library, true)}
                        disabled={library.is_active}>
                        {library.is_active ? '✓ Faol' : '✓ Faollashtirish'}
                      </button>
                      <button
                        className="dropdown-btn deactivate"
                        onClick={() => updateActiveStatus(library, false)}
                        disabled={!library.is_active}>
                        {!library.is_active ? '✗ Nofaol' : '✗ Faolsizlantirish'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {renderPagination()}
          </>
        )}
      </main>
    </>
  );
};

export default Home;
