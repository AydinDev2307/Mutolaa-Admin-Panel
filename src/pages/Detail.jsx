import { useEffect, useState } from 'react';
import { Container } from '@mantine/core';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../centerAPI/API';
import { notifications } from '@mantine/notifications';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [library, setLibrary] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        setLoading(true);
        setError(null);

        const allLibraries = await API.get('/libraries/libraries/');
        const foundLibrary = Array.isArray(allLibraries.data)
          ? allLibraries.data.find((lib) => lib.id === parseInt(id))
          : null;

        if (!foundLibrary) {
          setError('Kutubxona topilmadi');
          setLoading(false);
          notifications.show({
            title: 'Xato',
            message: 'Kutubxona topilmadi',
            color: 'red',
            autoClose: 3000,
          });
          return;
        }

        setLibrary(foundLibrary);

        const otherLibraries = allLibraries.data
          .filter((lib) => lib.id !== parseInt(id))
          .slice(0, 8);
        setSimilar(otherLibraries);
      } catch (err) {
        console.error('❌ Xatolik:', err);
        setError(`Ma'lumotlarni yuklashda xatolik: ${err.message}`);

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
              err.response?.data?.detail || "Ma'lumotlarni yuklashda xatolik",
            color: 'red',
            autoClose: 5000,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLibrary();
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <Notifications position="top-right" zIndex={1000} />
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f0a1e 0%, #1e1b4b 100%)',
          }}>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                border: '4px solid rgba(139, 92, 246, 0.3)',
                borderTop: '4px solid #8b5cf6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px',
              }}></div>
            <h2 style={{ color: '#a78bfa', fontSize: '20px' }}>
              Yuklanmoqda...
            </h2>
          </div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </>
    );
  }

  if (error || !library) {
    return (
      <>
        <Notifications position="top-right" zIndex={1000} />
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f0a1e 0%, #1e1b4b 100%)',
          }}>
          <div style={{ textAlign: 'center', color: 'white', padding: '40px' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                background: 'rgba(239, 68, 68, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                margin: '0 auto 20px',
              }}>
              ❌
            </div>
            <h3
              style={{
                marginBottom: '20px',
                color: '#a78bfa',
                fontSize: '24px',
              }}>
              {error || 'Kutubxona topilmadi'}
            </h3>
            <p
              style={{
                marginBottom: '30px',
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '16px',
              }}>
              ID: {id} - bu kutubxona mavjud emas
            </p>
            <div
              style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'center',
              }}>
              <button
                onClick={() => navigate('/')}
                style={{
                  padding: '12px 30px',
                  background: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '600',
                  transition: 'all 0.3s',
                }}>
                Barcha kutubxonalar
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '12px 30px',
                  background: 'rgba(139, 92, 246, 0.2)',
                  color: '#a78bfa',
                  border: '2px solid rgba(139, 92, 246, 0.4)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '600',
                  transition: 'all 0.3s',
                }}>
                Qayta urinish
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const visible = showAll ? similar : similar.slice(0, 4);

  return (
    <>
      <Notifications position="top-right" zIndex={1000} />
      <style>{`
        .detail-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0a1e 0%, #1e1b4b 100%);
          padding: 30px 40px;
        }

        .back-button {
          background: rgba(139, 92, 246, 0.2);
          border: 2px solid rgba(139, 92, 246, 0.4);
          color: #a78bfa;
          padding: 12px 24px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
          transition: all 0.3s ease;
          margin-bottom: 25px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .back-button:hover {
          background: rgba(139, 92, 246, 0.3);
          border-color: #8b5cf6;
          transform: translateX(-5px);
        }

        .library-header {
          display: flex;
          align-items: center;
          gap: 30px;
          margin-bottom: 30px;
          background: rgba(30, 27, 75, 0.6);
          padding: 35px;
          border-radius: 16px;
          border: 2px solid rgba(139, 92, 246, 0.4);
        }

        .library-icon-large {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3.5rem;
          flex-shrink: 0;
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
        }

        .library-title {
          flex: 1;
        }

        .library-title h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 15px;
          line-height: 1.2;
          color: white;
        }

        .library-meta {
          display: flex;
          gap: 25px;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          color: rgba(255, 255, 255, 0.8);
          background: rgba(139, 92, 246, 0.1);
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid rgba(139, 92, 246, 0.3);
        }

        .info-section {
          background: rgba(30, 27, 75, 0.6);
          border-radius: 16px;
          padding: 35px;
          margin-bottom: 30px;
          border: 2px solid rgba(139, 92, 246, 0.4);
        }

        .info-section h2 {
          font-size: 1.8rem;
          color: white;
          margin-bottom: 25px;
          font-weight: 700;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .info-card {
          background: rgba(15, 10, 30, 0.5);
          padding: 24px;
          border-radius: 12px;
          border: 2px solid rgba(139, 92, 246, 0.3);
          transition: all 0.3s ease;
        }

        .info-card:hover {
          border-color: #8b5cf6;
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
        }

        .info-label {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 8px;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .info-value {
          font-size: 18px;
          font-weight: 700;
          color: #a78bfa;
        }

        .similar-section {
          margin-top: 40px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .section-title {
          font-size: 1.8rem;
          color: white;
          font-weight: 700;
        }

        .toggle-button {
          background: rgba(139, 92, 246, 0.2);
          color: #a78bfa;
          border: 2px solid rgba(139, 92, 246, 0.4);
          padding: 10px 24px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .toggle-button:hover {
          background: rgba(139, 92, 246, 0.3);
          border-color: #8b5cf6;
          transform: translateY(-2px);
        }

        .similar-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .similar-card {
          background: rgba(30, 27, 75, 0.6);
          border: 2px solid rgba(139, 92, 246, 0.3);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .similar-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 28px rgba(139, 92, 246, 0.3);
          border-color: #8b5cf6;
        }

        .similar-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin-bottom: 16px;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .similar-name {
          font-size: 1.2rem;
          font-weight: 700;
          color: white;
          margin-bottom: 12px;
        }

        .similar-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .similar-info-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        @media (max-width: 768px) {
          .library-header {
            flex-direction: column;
            text-align: center;
          }

          .library-title h1 {
            font-size: 2rem;
          }

          .library-meta {
            justify-content: center;
          }

          .similar-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="detail-page">
        <Container style={{ maxWidth: '1400px' }}>
          <button className="back-button" onClick={() => navigate('/')}>
            ← Orqaga
          </button>

          <div className="library-header">
            <div className="library-icon-large">📚</div>
            <div className="library-title">
              <h1>{library.name}</h1>
              <div className="library-meta">
                <div className="meta-item">
                  <span>📍</span>
                  <span>{library.address}</span>
                </div>
                <div className="meta-item">
                  <span>📖</span>
                  <span>{library.total_books || 0} ta kitob</span>
                </div>
                {library.is_active ? (
                  <div className="meta-item">
                    <span>✅</span>
                    <span>Faol</span>
                  </div>
                ) : (
                  <div className="meta-item">
                    <span>❌</span>
                    <span>Nofaol</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="info-section">
            <h2>Kutubxona haqida</h2>
            <div className="info-grid">
              <div className="info-card">
                <div className="info-label">ID</div>
                <div className="info-value">#{library.id}</div>
              </div>
              <div className="info-card">
                <div className="info-label">Nomi</div>
                <div className="info-value">{library.name}</div>
              </div>
              <div className="info-card">
                <div className="info-label">Manzil</div>
                <div className="info-value">{library.address}</div>
              </div>
              <div className="info-card">
                <div className="info-label">Kitoblar soni</div>
                <div className="info-value">{library.total_books || 0} ta</div>
              </div>
              <div className="info-card">
                <div className="info-label">Holati</div>
                <div className="info-value">
                  {library.is_active ? '✅ Faol' : '❌ Nofaol'}
                </div>
              </div>
            </div>
          </div>

          {similar.length > 0 && (
            <div className="similar-section">
              <div className="section-header">
                <h2 className="section-title">Boshqa kutubxonalar</h2>
                {similar.length > 4 && (
                  <button
                    className="toggle-button"
                    onClick={() => setShowAll(!showAll)}>
                    {showAll
                      ? "Kamroq ko'rish"
                      : `Barchasini ko'rish (${similar.length})`}
                  </button>
                )}
              </div>

              <div className="similar-grid">
                {visible.map((lib) => (
                  <div
                    key={lib.id}
                    className="similar-card"
                    onClick={() => navigate(`/detail/${lib.id}`)}>
                    <div className="similar-icon">📚</div>
                    <h3 className="similar-name">{lib.name}</h3>
                    <div className="similar-info">
                      <div className="similar-info-item">
                        <span>📍</span>
                        <span>{lib.address}</span>
                      </div>
                      <div className="similar-info-item">
                        <span>📖</span>
                        <span>{lib.total_books || 0} ta kitob</span>
                      </div>
                      <div className="similar-info-item">
                        {lib.is_active ? (
                          <>
                            <span>✅</span>
                            <span>Faol</span>
                          </>
                        ) : (
                          <>
                            <span>❌</span>
                            <span>Nofaol</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Container>
      </div>
    </>
  );
};

export default Detail;
