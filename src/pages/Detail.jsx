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
        console.log("📖 Kutubxona ma'lumotlari yuklanmoqda...", id);

        const allLibraries = await API.get('/libraries/libraries/');
        console.log('✅ Barcha kutubxonalar:', allLibraries.data);

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

        console.log('✅ Kutubxona topildi:', foundLibrary);
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
            background: '#151515f6',
          }}>
          <div style={{ textAlign: 'center', color: 'yellow' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                border: '4px solid rgba(255, 193, 7, 0.3)',
                borderTop: '4px solid yellow',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px',
              }}></div>
            <h2>Yuklanmoqda...</h2>
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
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
          }}>
          <div style={{ textAlign: 'center', color: 'white', padding: '40px' }}>
            <h2
              style={{
                fontSize: '2.5rem',
                marginBottom: '20px',
                color: '#FFC107',
              }}>
              ❌
            </h2>
            <h3 style={{ marginBottom: '20px', color: '#FFC107' }}>
              {error || 'Kutubxona topilmadi'}
            </h3>
            <p
              style={{
                marginBottom: '30px',
                opacity: 0.8,
                color: 'rgba(255, 255, 255, 0.7)',
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
                  background:
                    'linear-gradient(135deg, #FFC107 0%, #FFD54F 100%)',
                  color: '#1a1a1a',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                }}>
                Barcha kutubxonalar
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '12px 30px',
                  background: 'rgba(255, 193, 7, 0.2)',
                  color: '#FFC107',
                  border: '2px solid #FFC107',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
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
          background: #151515f6;
        }

        .detail-hero {
          padding: 40px 0 20px;
          color: white;
          position: relative;
        }

        .back-button {
          background: yellow;
          border: none;
          color: #000;
          padding: 12px 24px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s ease;
          margin-bottom: 30px;
        }

        .back-button:hover {
          background: orange;
          transform: translateX(-5px);
        }

        .library-header {
          display: flex;
          align-items: center;
          gap: 30px;
          margin-bottom: 30px;
          background: #2a2a2a;
          padding: 30px;
          border-radius: 15px;
          border: 2px solid #ffa500;
        }

        .library-icon-large {
          width: 100px;
          height: 100px;
          background: yellow;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3.5rem;
          flex-shrink: 0;
        }

        .library-title {
          flex: 1;
        }

        .library-title h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 15px;
          line-height: 1.2;
          color: yellow;
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
          font-size: 1rem;
          color: #ddd;
        }

        .detail-content {
          padding: 30px 0;
        }

        .info-section {
          background: #2a2a2a;
          border-radius: 15px;
          padding: 30px;
          margin-bottom: 30px;
          border: 2px solid #ffa500;
        }

        .info-section h2 {
          font-size: 1.8rem;
          color: yellow;
          margin-bottom: 25px;
          font-weight: 700;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }

        .info-card {
          background: #1a1a1a;
          padding: 20px;
          border-radius: 12px;
          border: 2px solid rgba(255, 193, 7, 0.3);
          transition: all 0.3s ease;
        }

        .info-card:hover {
          border-color: yellow;
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(255, 165, 0, 0.3);
        }

        .info-label {
          font-size: 0.85rem;
          color: #aaa;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .info-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: yellow;
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
          color: yellow;
          font-weight: 700;
        }

        .toggle-button {
          background: yellow;
          color: #000;
          border: none;
          padding: 10px 24px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .toggle-button:hover {
          background: orange;
          transform: translateY(-2px);
        }

        .similar-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .similar-card {
          background: #2a2a2a;
          border: 2px solid rgba(255, 165, 0, 0.3);
          border-radius: 15px;
          padding: 20px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .similar-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(255, 165, 0, 0.3);
          border-color: yellow;
        }

        .similar-icon {
          width: 60px;
          height: 60px;
          background: yellow;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin-bottom: 15px;
        }

        .similar-name {
          font-size: 1.2rem;
          font-weight: 700;
          color: yellow;
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
          font-size: 0.9rem;
          color: #ddd;
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
        <section className="detail-hero">
          <Container style={{ width: '1240px', maxWidth: '100%' }}>
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
          </Container>
        </section>

        <section className="detail-content">
          <Container style={{ width: '1400px', maxWidth: '90%' }}>
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
                  <div className="info-value">
                    {library.total_books || 0} ta
                  </div>
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
        </section>
      </div>
    </>
  );
};

export default Detail;
