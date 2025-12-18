import { Button, PasswordInput, Input } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { API } from '../centerAPI/API';
import { notifications } from '@mantine/notifications';
import { Notifications } from '@mantine/notifications';
import useAuthStore from '../store/authStore';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import '@mantine/notifications/styles.css';

const Login = () => {
  const { login, isAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: '',
      password: '',
    },
  });

  const { mutate: loginMut, isPending } = useMutation({
    mutationFn: async (body) => {
      const res = await API.post('/auth/login/', body);
      return res.data;
    },
    onSuccess: (res) => {
      const userData = {
        accessToken:
          res.accessToken || res.access_token || res.access || res.token,
        refreshToken: res.refreshToken || res.refresh_token || res.refresh,
        user: res.user || res,
      };

      if (!userData.accessToken) {
        notifications.show({
          title: 'Xato',
          message: 'Token topilmadi. Backend javobini tekshiring.',
          color: 'red',
        });
        return;
      }

      login(userData);
      notifications.show({
        title: 'Muvaffaqiyatli!',
        message: 'Tizimga muvaffaqiyatli kirdingiz',
        color: 'green',
      });
    },
    onError: (err) => {
      let errorMessage = 'Login yoki parol xato';

      if (err.response?.data) {
        errorMessage =
          err.response.data.message ||
          err.response.data.detail ||
          err.response.data.error ||
          (err.response.data.phone &&
            `Telefon: ${err.response.data.phone[0]}`) ||
          (err.response.data.password &&
            `Parol: ${err.response.data.password[0]}`) ||
          JSON.stringify(err.response.data);
      } else if (err.message) {
        errorMessage = err.message;
      }

      notifications.show({
        title: 'Xato',
        message: errorMessage,
        color: 'red',
        autoClose: 5000,
      });
    },
  });

  if (isAuth) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = (data) => {
    loginMut({
      phone: data.phone,
      password: data.password,
    });
  };

  return (
    <>
      <Notifications position="top-right" zIndex={1000} />
      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f0a1e 0%, #1e1b4b 100%);
          padding: 20px;
        }

        .login-container {
          width: 100%;
          max-width: 480px;
        }

        .login-card {
          background: rgba(30, 27, 75, 0.6);
          border: 2px solid rgba(139, 92, 246, 0.4);
          border-radius: 24px;
          padding: 50px 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .login-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .login-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          margin: 0 auto 20px;
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);
        }

        .login-title {
          font-size: 2rem;
          font-weight: 800;
          color: white;
          margin-bottom: 8px;
        }

        .login-subtitle {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.6);
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
        }

        .mantine-Input-wrapper,
        .mantine-PasswordInput-wrapper {
          width: 100%;
        }

        .mantine-Input-input,
        .mantine-PasswordInput-input {
          background: rgba(15, 10, 30, 0.6) !important;
          border: 2px solid rgba(139, 92, 246, 0.3) !important;
          color: white !important;
          padding: 14px 18px !important;
          border-radius: 12px !important;
          font-size: 15px !important;
          transition: all 0.3s ease !important;
        }

        .mantine-Input-input:focus,
        .mantine-PasswordInput-input:focus {
          border-color: #8b5cf6 !important;
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2) !important;
        }

        .mantine-Input-input::placeholder,
        .mantine-PasswordInput-input::placeholder {
          color: rgba(255, 255, 255, 0.3) !important;
        }

        .error-message {
          color: #ef4444;
          font-size: 13px;
          margin-top: 4px;
        }

        .mantine-Button-root {
          background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%) !important;
          color: white !important;
          font-weight: 700 !important;
          padding: 16px 24px !important;
          border-radius: 12px !important;
          font-size: 16px !important;
          border: none !important;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4) !important;
          transition: all 0.3s ease !important;
          margin-top: 10px !important;
        }

        .mantine-Button-root:hover:not(:disabled) {
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5) !important;
        }

        .mantine-Button-root:disabled {
          opacity: 0.6 !important;
          cursor: not-allowed !important;
        }

        .login-footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 25px;
          border-top: 1px solid rgba(139, 92, 246, 0.2);
        }

        .login-footer-text {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          margin-bottom: 10px;
        }

        .login-footer-brand {
          color: #a78bfa;
          font-weight: 700;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 35px 25px;
          }

          .login-title {
            font-size: 1.6rem;
          }
        }
      `}</style>

      <div className="login-page">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <div className="login-icon">📚</div>
              <h1 className="login-title">Xush kelibsiz</h1>
              <p className="login-subtitle">
                Tizimga kirish uchun ma'lumotlaringizni kiriting
              </p>
            </div>

            <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label className="form-label">Telefon raqam</label>
                <Input
                  placeholder="+998 90 123 45 67"
                  size="md"
                  {...register('phone', {
                    required: 'Telefon raqam majburiy',
                    pattern: {
                      value:
                        /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                      message: "Telefon raqam formati noto'g'ri",
                    },
                  })}
                />
                {errors.phone && (
                  <span className="error-message">{errors.phone.message}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Parol</label>
                <PasswordInput
                  placeholder="Parolingizni kiriting"
                  size="md"
                  {...register('password', {
                    required: 'Parol majburiy',
                    minLength: {
                      value: 4,
                      message:
                        "Parol kamida 4 ta belgidan iborat bo'lishi kerak",
                    },
                  })}
                />
                {errors.password && (
                  <span className="error-message">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <Button type="submit" fullWidth loading={isPending} size="md">
                {isPending ? 'Tekshirilmoqda...' : 'Kirish'}
              </Button>
            </form>

            <div className="login-footer">
              <p className="login-footer-text">Powered by</p>
              <div className="login-footer-brand">
                <span>📚</span>
                <span>Mutolaa Admin Panel</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
