import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../centerAPI/API';
import { Container, Flex, Loader } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

const Home = () => {
  const navigate = useNavigate();
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchLibraries();
  }, []);

  const fetchLibraries = async () => {
    try {
      console.log('📚 Kutubxonalarni yuklash...');
      const res = await API.get('/libraries/libraries/');
      console.log('✅ Kutubxonalar yuklandi:', res.data);
      setLibraries(res.data);
    } catch (err) {
      console.error('❌ Kutubxonalarni yuklashda xato:', err);

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
            err.response?.data?.detail || 'Kutubxonalarni yuklashda xatolik',
          color: 'red',
          autoClose: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const updateActiveStatus = async (library, status) => {
    if (updatingId === library.id) {
      console.log('⏳ Bu kutubxona allaqachon yangilanmoqda...');
      return;
    }

    try {
      setUpdatingId(library.id);
      console.log(
        `🔄 Kutubxona ${
          status ? 'faollashtirilmoqda' : 'faolsizlantirilmoqda'
        }:`,
        library
      );

      const url = status
        ? `/libraries/library/activate/${library.id}/`
        : `/libraries/library/deactivate/${library.id}/`;

      console.log("🌐 So'rov URL:", API.defaults.baseURL + url);
      console.log('📦 Yuborilayotgan data:', { is_active: status });

      const response = await API.patch(url, {
        is_active: status,
      });

      console.log('✅ Server javobi:', response.data);

      setLibraries((prev) =>
        prev.map((item) =>
          item.id === library.id ? { ...item, is_active: status } : item
        )
      );

      setOpenMenuId(null);

      notifications.show({
        title: 'Muvaffaqiyatli!',
        message: status
          ? `"${library.name}" kutubxonasi faollashtirildi ✅`
          : `"${library.name}" kutubxonasi faolsizlantirildi ⛔`,
        color: 'green',
        autoClose: 3000,
      });
    } catch (err) {
      console.error('❌ Faollashtirishda xato:', err);
      console.error('📋 Xato response:', err.response);
      console.error('📊 Status:', err.response?.status);
      console.error('📄 Data:', err.response?.data);

      let errorMessage = 'Faollashtirishda xatolik yuz berdi';

      if (err.response?.status === 400) {
        const errorData = err.response?.data;
        if (errorData?.is_active) {
          errorMessage = `is_active xatosi: ${errorData.is_active[0]}`;
        } else {
          const errorDetail =
            errorData?.detail ||
            errorData?.message ||
            errorData?.error ||
            JSON.stringify(errorData);
          errorMessage = `Noto'g'ri so'rov: ${errorDetail}`;
        }
      } else if (err.response?.status === 404) {
        errorMessage = 'Kutubxona topilmadi';
      } else if (err.response?.status === 403) {
        errorMessage =
          "Bu amalni bajarish uchun sizda ruxsat yo'q. Admin bilan bog'laning.";
      } else if (err.response?.status === 401) {
        errorMessage = 'Sessiya tugagan, qaytadan login qiling';
        setTimeout(() => {
          localStorage.clear();
          window.location.href = '/login';
        }, 2000);
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      notifications.show({
        title: 'Xato!',
        message: errorMessage,
        color: 'red',
        autoClose: 5000,
      });
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId !== null && !event.target.closest('.menu-container')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  if (loading) {
    return (
      <Container>
        <div
          style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
          }}>
          <Loader size="xl" color="yellow" />
          <h1 style={{ color: '#333' }}>Kutubxonalar yuklanmoqda...</h1>
        </div>
      </Container>
    );
  }

  const filteredLibraries = libraries.filter((library) => {
    if (filter === 'all') return true;
    if (filter === 'active') return library.is_active;
    if (filter === 'inactive') return !library.is_active;
    return true;
  });

  const totalPages = Math.ceil(filteredLibraries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLibraries = filteredLibraries.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          style={{
            padding: '10px 15px',
            margin: '0 5px',
            border: '2px solid yellow',
            borderRadius: '8px',
            backgroundColor: '#1a1a1a',
            color: 'yellow',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.3s',
          }}>
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="dots1" style={{ color: 'yellow', margin: '0 5px' }}>
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          style={{
            padding: '10px 15px',
            margin: '0 5px',
            border: `2px solid ${i === currentPage ? 'orange' : 'yellow'}`,
            borderRadius: '8px',
            backgroundColor: i === currentPage ? 'orange' : '#1a1a1a',
            color: i === currentPage ? '#000' : 'yellow',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.3s',
          }}>
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="dots2" style={{ color: 'yellow', margin: '0 5px' }}>
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          style={{
            padding: '10px 15px',
            margin: '0 5px',
            border: '2px solid yellow',
            borderRadius: '8px',
            backgroundColor: '#1a1a1a',
            color: 'yellow',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.3s',
          }}>
          {totalPages}
        </button>
      );
    }

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '30px 0',
          gap: '10px',
        }}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: '10px 20px',
            border: '2px solid yellow',
            borderRadius: '8px',
            backgroundColor: '#1a1a1a',
            color: 'yellow',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            opacity: currentPage === 1 ? 0.5 : 1,
            transition: 'all 0.3s',
          }}>
          ← Oldingi
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: '10px 20px',
            border: '2px solid yellow',
            borderRadius: '8px',
            backgroundColor: '#1a1a1a',
            color: 'yellow',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            opacity: currentPage === totalPages ? 0.5 : 1,
            transition: 'all 0.3s',
          }}>
          Keyingi →
        </button>
      </div>
    );
  };

  return (
    <>
      <Notifications position="top-right" zIndex={1000} />
      <main
        style={{
          width: '100%',
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
        }}>
        <Container fluid w={1600}>
          <div
            style={{
              backgroundColor: '#151515f6',
              padding: '20px',
              minHeight: '100vh',
            }}>
            <div
              style={{
                width: '90%',
                margin: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 10px',
              }}>
              <h1 style={{ color: 'yellow', margin: 0, fontSize: '28px' }}>
                Kutubxonalar: {filteredLibraries.length} ta
                {filter !== 'all' && (
                  <span style={{ fontSize: '18px', color: '#ffa500' }}>
                    {' '}
                    (Jami: {libraries.length} ta)
                  </span>
                )}
              </h1>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                <button
                  onClick={() => setFilter('all')}
                  style={{
                    backgroundColor: filter === 'all' ? 'orange' : 'yellow',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    fontSize: '15px',
                  }}>
                  Hammasi ({libraries.length})
                </button>
                <button
                  onClick={() => setFilter('active')}
                  style={{
                    backgroundColor: filter === 'active' ? 'orange' : 'yellow',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    fontSize: '15px',
                  }}>
                  Faollar ({libraries.filter((l) => l.is_active).length})
                </button>
                <button
                  onClick={() => setFilter('inactive')}
                  style={{
                    backgroundColor:
                      filter === 'inactive' ? 'orange' : 'yellow',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    fontSize: '15px',
                  }}>
                  Nofaollar ({libraries.filter((l) => !l.is_active).length})
                </button>
              </div>
            </div>

            <div
              style={{
                width: '90%',
                height: '70px',
                backgroundColor: '#2a2a2a',
                margin: '10px auto 20px auto',
                borderRadius: '15px',
                border: '2px solid #ffa500',
                display: 'flex',
                alignItems: 'center',
                padding: '0 20px',
                justifyContent: 'space-between',
              }}>
              <p
                style={{
                  color: 'yellow',
                  width: '150px',
                  margin: 0,
                  fontWeight: 'bold',
                  fontSize: '16px',
                }}>
                Kutubxona
              </p>
              <p
                style={{
                  color: 'yellow',
                  width: '310px',
                  margin: 0,
                  fontWeight: 'bold',
                  fontSize: '16px',
                }}>
                Manzil
              </p>
              <p
                style={{
                  color: 'yellow',
                  width: '80px',
                  margin: 0,
                  fontWeight: 'bold',
                  fontSize: '16px',
                }}>
                Holat
              </p>
              <p
                style={{
                  color: 'yellow',
                  width: '100px',
                  margin: 0,
                  fontWeight: 'bold',
                  fontSize: '16px',
                }}>
                Kitoblar
              </p>
              <p
                style={{
                  color: 'yellow',
                  width: '100px',
                  margin: 0,
                  fontWeight: 'bold',
                  fontSize: '16px',
                }}>
                Amallar
              </p>
            </div>

            {filteredLibraries.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '80px 20px',
                  color: 'yellow',
                  backgroundColor: '#2a2a2a',
                  borderRadius: '15px',
                  width: '90%',
                  margin: 'auto',
                }}>
                <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>
                  {filter === 'active' && 'Faol kutubxonalar topilmadi'}
                  {filter === 'inactive' && 'Nofaol kutubxonalar topilmadi'}
                  {filter === 'all' && 'Hech qanday kutubxona topilmadi'}
                </h2>
                <p style={{ color: '#ccc', fontSize: '16px' }}>
                  {filter !== 'all' && "Boshqa filterlarni sinab ko'ring"}
                </p>
              </div>
            ) : (
              <>
                {currentLibraries.map((library) => (
                  <div
                    key={library.id}
                    onClick={() => navigate(`/detail/${library.id}`)}
                    onMouseEnter={() => setHoveredId(library.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      width: '90%',
                      display: 'flex',
                      flexDirection: 'column',
                      margin: '0 auto 15px auto',
                      border: `2px solid ${
                        library.is_active ? '#4CAF50' : '#f44336'
                      }`,
                      padding: '20px',
                      borderRadius: '15px',
                      backgroundColor:
                        hoveredId === library.id ? '#2a2a2a' : '#1a1a1a',
                      transform:
                        hoveredId === library.id ? 'scale(1.02)' : 'scale(1)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      boxShadow:
                        hoveredId === library.id
                          ? '0 8px 16px rgba(255,165,0,0.3)'
                          : '0 2px 4px rgba(0,0,0,0.3)',
                    }}>
                    <Flex
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        position: 'relative',
                      }}>
                      <div style={{ width: '150px' }}>
                        <h2
                          style={{
                            color: 'yellow',
                            margin: 0,
                            fontSize: '18px',
                          }}>
                          {library.name}
                        </h2>
                      </div>
                      <div style={{ width: '310px' }}>
                        <p
                          style={{
                            color: '#ddd',
                            margin: 0,
                            fontSize: '14px',
                          }}>
                          {library.address}
                        </p>
                      </div>
                      <div
                        style={{
                          width: '80px',
                          border: `2px solid ${
                            library.is_active ? '#4CAF50' : '#f44336'
                          }`,
                          height: '35px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '10px',
                          backgroundColor: library.is_active
                            ? 'rgba(76, 175, 80, 0.1)'
                            : 'rgba(244, 67, 54, 0.1)',
                        }}>
                        <p
                          style={{
                            color: library.is_active ? '#4CAF50' : '#f44336',
                            margin: 0,
                            fontWeight: 'bold',
                            fontSize: '14px',
                          }}>
                          {library.is_active ? '✓ Faol' : '✗ Nofaol'}
                        </p>
                      </div>
                      <div style={{ width: '100px' }}>
                        <p
                          style={{
                            color: 'yellow',
                            margin: 0,
                            fontSize: '15px',
                            fontWeight: '600',
                          }}>
                          📚 {library.total_books || 0} ta
                        </p>
                      </div>
                      <div
                        className="menu-container"
                        style={{
                          width: '100px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          paddingLeft: '10px',
                          position: 'relative',
                        }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(
                              openMenuId === library.id ? null : library.id
                            );
                          }}
                          disabled={updatingId === library.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px',
                            border: '2px solid yellow',
                            borderRadius: '50%',
                            backgroundColor: '#1a1a1a',
                            color: 'yellow',
                            fontSize: '24px',
                            cursor:
                              updatingId === library.id ? 'wait' : 'pointer',
                            transition: 'all 0.3s',
                            opacity: updatingId === library.id ? 0.5 : 1,
                          }}>
                          {updatingId === library.id ? '⏳' : '⋮'}
                        </button>
                        {openMenuId === library.id &&
                          updatingId !== library.id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                width: '180px',
                                position: 'absolute',
                                top: '-90px',
                                right: '0',
                                backgroundColor: '#2a2a2a',
                                border: '2px solid #ffa500',
                                borderRadius: '12px',
                                padding: '12px',
                                zIndex: '150',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
                              }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateActiveStatus(library, true);
                                }}
                                disabled={library.is_active}
                                style={{
                                  width: '100%',
                                  marginBottom: '8px',
                                  backgroundColor: library.is_active
                                    ? '#555'
                                    : '#4CAF50',
                                  color: library.is_active ? '#888' : 'white',
                                  border: 'none',
                                  borderRadius: '10px',
                                  padding: '10px',
                                  cursor: library.is_active
                                    ? 'not-allowed'
                                    : 'pointer',
                                  fontWeight: '600',
                                  fontSize: '14px',
                                  transition: 'all 0.3s',
                                }}>
                                {library.is_active
                                  ? '✓ Faol'
                                  : '✓ Faollashtirish'}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateActiveStatus(library, false);
                                }}
                                disabled={!library.is_active}
                                style={{
                                  width: '100%',
                                  backgroundColor: !library.is_active
                                    ? '#555'
                                    : '#f44336',
                                  color: !library.is_active ? '#888' : 'white',
                                  border: 'none',
                                  borderRadius: '10px',
                                  padding: '10px',
                                  cursor: !library.is_active
                                    ? 'not-allowed'
                                    : 'pointer',
                                  fontWeight: '600',
                                  fontSize: '14px',
                                  transition: 'all 0.3s',
                                }}>
                                {!library.is_active
                                  ? '✗ Nofaol'
                                  : '✗ Faolsizlantirish'}
                              </button>
                            </div>
                          )}
                      </div>
                    </Flex>
                  </div>
                ))}
                {renderPagination()}
              </>
            )}
          </div>
        </Container>
      </main>
    </>
  );
};

export default Home;
