import { Container } from '@mantine/core';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#151515f6',
        padding: '20px 0',
        marginTop: 'auto',
      }}>
      <Container fluid w={1600}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'yellow', margin: 0 }}>
            © 2024 Mutolaa Admin. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
