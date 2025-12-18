import { Switch, Button } from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../centerAPI/API';
import AuthStore from '../store/AuthStore';
import { notifications } from '@mantine/notifications';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

const AddLibrary = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [telegram, setTelegram] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [canRentBook, setCanRentBook] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUserData } = AuthStore();
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !phone || !password || !address) {
      notifications.show({
        title: 'Xato',
        message: "Iltimos, barcha majburiy maydonlarni to'ldiring",
        color: 'red',
        autoClose: 3000,
      });
      return;
    }

    const payload = {
      user: {
        name,
        phone,
        password,
      },
      library: {
        address,
        can_rent_books: canRentBook,
        social_media: {
          telegram,
          instagram,
          facebook,
        },
      },
    };

    try {
      setLoading(true);
      const res = await API.post('/auth/register-library/', payload);
      setUserData({
        user: res.data.user,
        library: res.data.library,
      });

      notifications.show({
        title: 'Muvaffaqiyatli!',
        message: "Kutubxona muvaffaqiyatli qo'shildi",
        color: 'green',
        autoClose: 3000,
      });

      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error('❌ Register xato:', err);
      notifications.show({
        title: 'Xato',
        message:
          err.response?.data?.detail || "Ro'yxatdan o'tishda xatolik yuz berdi",
        color: 'red',
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Notifications position="top-right" zIndex={1000} />
      <style>{`
        .add-library-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0a1e 0%, #1e1b4b 100%);
          padding: 40px 20px;
        }

        .add-library-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 10px;
        }

        .page-subtitle {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .form-section {
          background: rgba(30, 27, 75, 0.6);
          border-radius: 20px;
          padding: 40px;
          border: 2px solid rgba(139, 92, 246, 0.4);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          margin-bottom: 25px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        .form-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .section-subtitle {
          font-size: 1.3rem;
          font-weight: 700;
          color: #a78bfa;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .input-wrapper {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 600;
        }

        .custom-input {
          background: rgba(15, 10, 30, 0.6);
          border: 2px solid rgba(139, 92, 246, 0.3);
          color: white;
          padding: 14px 18px;
          border-radius: 12px;
          font-size: 15px;
          transition: all 0.3s ease;
          width: 100%;
        }

        .custom-input:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2);
        }

        .custom-input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .switch-wrapper {
          background: rgba(15, 10, 30, 0.4);
          padding: 16px;
          border-radius: 12px;
          border: 2px solid rgba(139, 92, 246, 0.3);
        }

        .mantine-Switch-track {
          background: rgba(139, 92, 246, 0.2) !important;
          border: 2px solid rgba(139, 92, 246, 0.3) !important;
          cursor: pointer !important;
        }

        .mantine-Switch-track[data-checked] {
          background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%) !important;
          border-color: #8b5cf6 !important;
        }

        .mantine-Switch-label {
          color: rgba(255, 255, 255, 0.9) !important;
          font-weight: 600 !important;
          font-size: 15px !important;
          cursor: pointer !important;
        }

        .button-group {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .btn-primary {
          background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
          color: white;
          font-weight: 700;
          padding: 14px 40px;
          border-radius: 12px;
          transition: all 0.3s ease;
          border: none;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
          font-size: 16px;
          cursor: pointer;
          min-width: 180px;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: rgba(139, 92, 246, 0.2);
          color: #a78bfa;
          border: 2px solid rgba(139, 92, 246, 0.4);
          font-weight: 700;
          padding: 14px 40px;
          border-radius: 12px;
          transition: all 0.3s ease;
          font-size: 16px;
          cursor: pointer;
          min-width: 180px;
        }

        .btn-secondary:hover {
          background: rgba(139, 92, 246, 0.3);
          border-color: #8b5cf6;
        }

        @media (max-width: 1024px) {
          .form-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 2rem;
          }

          .form-section {
            padding: 25px;
          }

          .button-group {
            flex-direction: column;
          }

          .btn-primary,
          .btn-secondary {
            width: 100%;
          }
        }
      `}</style>

      <div className="add-library-page">
        <div className="add-library-container">
          <div className="page-header">
            <h1 className="page-title">Yangi Kutubxona Qo'shish</h1>
            <p className="page-subtitle">
              Tizimga yangi kutubxona qo'shish uchun quyidagi ma'lumotlarni
              kiriting
            </p>
          </div>

          <div className="form-section">
            <div className="form-grid">
              <div className="form-column">
                <h3 className="section-subtitle">
                  <span>👤</span>
                  <span>Shaxsiy Ma'lumotlar</span>
                </h3>

                <div className="input-wrapper">
                  <label className="input-label">Kutubxona nomi *</label>
                  <input
                    className="custom-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masalan: Milliy kutubxona"
                  />
                </div>

                <div className="input-wrapper">
                  <label className="input-label">Telefon raqam *</label>
                  <input
                    className="custom-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                  />
                </div>

                <div className="input-wrapper">
                  <label className="input-label">Parol *</label>
                  <input
                    className="custom-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Kamida 6 ta belgi"
                  />
                </div>

                <div className="input-wrapper">
                  <label className="input-label">Manzil *</label>
                  <input
                    className="custom-input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="To'liq manzilni kiriting"
                  />
                </div>
              </div>

              <div className="form-column">
                <h3 className="section-subtitle">
                  <span>📱</span>
                  <span>Ijtimoiy Tarmoqlar</span>
                </h3>

                <div className="input-wrapper">
                  <label className="input-label">Telegram</label>
                  <input
                    className="custom-input"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    placeholder="@username"
                  />
                </div>

                <div className="input-wrapper">
                  <label className="input-label">Instagram</label>
                  <input
                    className="custom-input"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@username"
                  />
                </div>

                <div className="input-wrapper">
                  <label className="input-label">Facebook</label>
                  <input
                    className="custom-input"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="username"
                  />
                </div>

                <div className="switch-wrapper">
                  <Switch
                    checked={canRentBook}
                    onChange={(e) => setCanRentBook(e.currentTarget.checked)}
                    label="Kitob ijaraga berish imkoniyati"
                    size="md"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="button-group">
            <button
              className="btn-secondary"
              onClick={() => navigate('/')}
              disabled={loading}>
              Bekor qilish
            </button>
            <button
              className="btn-primary"
              onClick={handleRegister}
              disabled={loading}>
              {loading ? 'Yuklanmoqda...' : "Kutubxona qo'shish"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddLibrary;
