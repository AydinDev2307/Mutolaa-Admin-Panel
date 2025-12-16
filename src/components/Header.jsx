import { Container, Flex } from '@mantine/core';

const Header = () => {
  return (
    <>
      <header style={{ backgroundColor: '#151515f6' }}>
        <Container fluid w={'1600px'}>
          <nav style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Flex style={{ alignItems: 'center', gap: '20px' }}>
              <h1 style={{ color: 'yellow' }}>Mutolaa Admin</h1>
              <button
                style={{
                  backgroundColor: 'yellow',
                  border: 'none',
                  width: '100px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '17px',
                  cursor: 'pointer',
                }}>
                Menyu
              </button>
            </Flex>
            <Flex>
              <h1 style={{ color: 'yellow' }}>Admin</h1>
            </Flex>
          </nav>
        </Container>
      </header>
    </>
  );
};

export default Header;
