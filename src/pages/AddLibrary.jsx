import { Switch, Button } from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../centerAPI/API';
import AuthStore from '../store/AuthStore';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [telegram, setTelegram] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [canRentBook, setCanRentBook] = useState(false);
  const { setUserData } = AuthStore();
  const navigate = useNavigate();
  function home() {
    navigate('/');
  }

  const handleRegister = async () => {
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
      const res = await API.post('/auth/register-library/', payload);
      setUserData({
        user: res.data.user,
        library: res.data.library,
      });
      console.log(res.data);
      alert("Muvaffaqiyatli ro'yxatdan o'tildi");
      setUserData(payload);
    } catch (err) {
      alert("Ro'yxatdan o'tishda xatolik yuz berdi");
      console.log(err.response?.data);
    }
  };

  return (
    <>
      <style>{`
        .register-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
          padding: 60px 20px;
        }

        .register-container {
          display: flex;
          flex-direction: column;
          width: 63%;
          max-width: 1400px;
          margin: auto;
          gap: 20px;
        }

        .register-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 800;
          color: #FFC107;
          margin-bottom: 30px;
          text-shadow: 0 2px 10px rgba(255, 193, 7, 0.3);
        }

        .form-section {
          background: #2d2d2d;
          border-radius: 20px;
          padding: 40px;
          border: 2px solid rgba(255, 193, 7, 0.2);
          box-shadow: 0 10px 30px rgba(255, 193, 7, 0.2);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-top: 20px;
        }

        .form-column {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .section-subtitle {
          font-size: 1.3rem;
          font-weight: 700;
          color: #FFC107;
          margin-bottom: 15px;
        }

        .mantine-Input-input {
          background: #1a1a1a !important;
          border: 2px solid rgba(255, 193, 7, 0.3) !important;
          color: white !important;
          padding: 12px 16px !important;
          border-radius: 10px !important;
          font-size: 1rem !important;
          transition: all 0.3s ease !important;
        }

        .mantine-Input-input:focus {
          border-color: #FFC107 !important;
          box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.2) !important;
        }

        .mantine-Input-input::placeholder {
          color: rgba(255, 255, 255, 0.4) !important;
        }

        .mantine-PasswordInput-input {
          background: #1a1a1a !important;
          border: 2px solid rgba(255, 193, 7, 0.3) !important;
          color: white !important;
          padding: 12px 16px !important;
          border-radius: 10px !important;
          font-size: 1rem !important;
          transition: all 0.3s ease !important;
        }

        .mantine-PasswordInput-input:focus {
          border-color: #FFC107 !important;
          box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.2) !important;
        }

        .mantine-Switch-track {
          background: rgba(255, 193, 7, 0.2) !important;
          border: 2px solid rgba(255, 193, 7, 0.3) !important;
        }

        .mantine-Switch-track[data-checked] {
          background: linear-gradient(135deg, #FFC107 0%, #FFD54F 100%) !important;
        }

        .mantine-Switch-label {
          color: rgba(255, 255, 255, 0.9) !important;
          font-weight: 600 !important;
        }

        .map-section {
          background: #2d2d2d;
          border-radius: 20px;
          padding: 30px;
          border: 2px solid rgba(255, 193, 7, 0.2);
          box-shadow: 0 10px 30px rgba(255, 193, 7, 0.2);
        }

        .coords-display {
          display: flex;
          gap: 30px;
          justify-content: center;
          margin-top: 20px;
        }

        .coords-item {
          color: #FFC107;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .button-group {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 30px;
        }

        .mantine-Button-root {
          background: linear-gradient(135deg, #FFC107 0%, #FFD54F 100%) !important;
          color: #1a1a1a !important;
          font-weight: 700 !important;
          padding: 12px 40px !important;
          border-radius: 10px !important;
          transition: all 0.3s ease !important;
          border: none !important;
          box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3) !important;
        }

        .mantine-Button-root:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 20px rgba(255, 193, 7, 0.5) !important;
        }

        .back-btn {
          background: rgba(255, 193, 7, 0.2) !important;
          color: #FFC107 !important;
          border: 2px solid rgba(255, 193, 7, 0.3) !important;
          width: 120px;
        }

        .back-btn:hover {
          background: transparent !important;
          border-color: #FFC107 !important;
        }

        .cancel-btn {
          background: rgba(220, 38, 38, 0.2) !important;
          color: #dc2626 !important;
          border: 2px solid rgba(220, 38, 38, 0.3) !important;
        }

        .cancel-btn:hover {
          background: #dc2626 !important;
          color: white !important;
        }

        @media (max-width: 1024px) {
          .register-container {
            width: 90%;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="register-page">
        <div className="register-container">
          <h1 className="register-title">Ro'yxatdan O'tish</h1>

          <div className="form-section">
            <div className="form-grid">
              <div className="form-column">
                <h3 className="section-subtitle">Shaxsiy Ma'lumotlar</h3>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Foydalanuvchi ism kiriting..."
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998901234567"
                />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Parol kiriting..."
                />
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Manzilni kiriting..."
                />
              </div>

              <div className="form-column">
                <h3 className="section-subtitle">Ijtimoiy Tarmoqlar</h3>
                <input
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  placeholder="Telegram username"
                />
                <input
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="Instagram username"
                />
                <input
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="Facebook username"
                />
                <Switch
                  checked={canRentBook}
                  onChange={(e) => setCanRentBook(e.currentTarget.checked)}
                  label="Kitob ijarasi"
                  mt={10}
                />
              </div>
            </div>
          </div>

          <div className="button-group">
            <Button className="cancel-btn" onClick={home}>
              Bekor qilish
            </Button>
            <Button onClick={handleRegister}>Ro'yxatdan o'tish</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
