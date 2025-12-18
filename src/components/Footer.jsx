import { Container } from '@mantine/core';

const Footer = () => {
  return (
    <>
      <style>{`
        .admin-footer {
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
          border-top: 2px solid rgba(139, 92, 246, 0.3);
          padding: 30px 40px;
          margin-top: auto;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
        }

        .footer-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer-logo {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .footer-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .footer-brand {
          color: white;
          font-weight: 700;
          font-size: 16px;
        }

        .footer-copyright {
          color: rgba(255, 255, 255, 0.6);
          font-size: 13px;
        }

        .footer-right {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .footer-link {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
          cursor: pointer;
          text-decoration: none;
        }

        .footer-link:hover {
          color: #a78bfa;
        }

        .footer-divider {
          width: 1px;
          height: 20px;
          background: rgba(139, 92, 246, 0.3);
        }

        @media (max-width: 768px) {
          .footer-content {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }

          .footer-left {
            flex-direction: column;
          }

          .footer-right {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>

      <footer className="admin-footer">
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-logo">📚</div>
            <div className="footer-text">
              <div className="footer-brand">Mutolaa Admin</div>
              <div className="footer-copyright">
                © 2025 Barcha huquqlar himoyalangan
              </div>
            </div>
          </div>

          <div className="footer-right">
            <a className="footer-link" href="#" onClick={(e) => e.preventDefault()}>
              Yordam
            </a>
            <div className="footer-divider"></div>
            <a className="footer-link" href="#" onClick={(e) => e.preventDefault()}>
              Texnik qo'llab-quvvatlash
            </a>
            <div className="footer-divider"></div>
            <a className="footer-link" href="#" onClick={(e) => e.preventDefault()}>
              Aloqa
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;