import { Container, Flex } from '@mantine/core';
import { useState } from 'react';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openLogoutModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function confirmLogout() {
    logout();
    setIsModalOpen(false);
    navigate('/');
  }

  function addLibrary() {
    navigate('/addLibrary');
  }

  function home() {
    navigate('/');
  }

  return (
    <>
      <header style={{ backgroundColor: '#151515f6' }}>
        <Container fluid w={'1600px'}>
          <nav
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '15px 0',
            }}>
            <Flex style={{ alignItems: 'center', gap: '20px' }}>
              <h1
                onClick={home}
                style={{ color: 'yellow', margin: 0, cursor: 'pointer' }}>
                Mutolaa Admin
              </h1>
              <button
                onClick={addLibrary}
                style={{
                  backgroundColor: 'yellow',
                  border: 'none',
                  width: '150px',
                  height: '35px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}>
                Kutubxona ochish
              </button>
            </Flex>
            <Flex style={{ alignItems: 'center' }}>
              <h1
                onClick={openLogoutModal}
                style={{ color: 'red', cursor: 'pointer', margin: 0 }}>
                Chiqish
              </h1>
            </Flex>
          </nav>
        </Container>
      </header>

      {isModalOpen && (
        <>
          <div
            onClick={closeModal}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              zIndex: 999,
              animation: 'fadeIn 0.3s ease',
            }}></div>

          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#2a2a2a',
              padding: '40px',
              borderRadius: '20px',
              border: '3px solid #ffa500',
              zIndex: 1000,
              minWidth: '400px',
              maxWidth: '90%',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
              animation: 'slideIn 0.3s ease',
            }}>
            <div
              style={{
                textAlign: 'center',
                marginBottom: '25px',
              }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto',
                  backgroundColor: 'rgba(255, 0, 0, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3px solid red',
                }}>
                <span style={{ fontSize: '3rem' }}>⚠️</span>
              </div>
            </div>

            <h2
              style={{
                color: 'yellow',
                textAlign: 'center',
                margin: '0 0 15px 0',
                fontSize: '24px',
                fontWeight: '700',
              }}>
              Tizimdan chiqish
            </h2>

            <p
              style={{
                color: '#ddd',
                textAlign: 'center',
                margin: '0 0 30px 0',
                fontSize: '16px',
                lineHeight: '1.5',
              }}>
              Haqiqatan ham tizimdan chiqmoqchimisiz?
            </p>

            <div
              style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'center',
              }}>
              <button
                onClick={closeModal}
                style={{
                  backgroundColor: 'transparent',
                  border: '2px solid yellow',
                  color: 'yellow',
                  padding: '12px 30px',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'yellow';
                  e.target.style.color = '#000';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'yellow';
                }}>
                Bekor qilish
              </button>
              <button
                onClick={confirmLogout}
                style={{
                  backgroundColor: 'red',
                  border: '2px solid red',
                  color: 'white',
                  padding: '12px 30px',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#c00';
                  e.target.style.borderColor = '#c00';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'red';
                  e.target.style.borderColor = 'red';
                }}>
                Ha, chiqish
              </button>
            </div>
          </div>

          <style>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }

            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translate(-50%, -60%);
              }
              to {
                opacity: 1;
                transform: translate(-50%, -50%);
              }
            }
          `}</style>
        </>
      )}
    </>
  );
};

export default Header;
