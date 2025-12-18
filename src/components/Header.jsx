import { Container, Flex } from '@mantine/core';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  function chiqish() {
    logout();
    navigate('/login');
  }
  function addLibrary() {
    navigate('https://mutolaa-azure.vercel.app/register');
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
              <h1 style={{ color: 'yellow', margin: 0 }}>Mutolaa Admin</h1>
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
                Kutubxona Qo'shish
              </button>
            </Flex>
            <Flex style={{ alignItems: 'center' }}>
              <h1
                onClick={chiqish}
                style={{ color: 'red', cursor: 'pointer', margin: 0 }}>
                Chiqish
              </h1>
            </Flex>
          </nav>
        </Container>
      </header>
    </>
  );
};

export default Header;
