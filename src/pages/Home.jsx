import React, { useEffect, useState } from 'react';
import { API } from '../centerAPI/API';
import { Container, Flex } from '@mantine/core';

const Home = () => {
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);
  const [filter, setFilter] = useState('all');
  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const res = await API.get('/libraries/libraries/');
        setLibraries(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLibraries();
  }, []);
  if (loading)
    return (
      <Container>
        <div
          style={{
            width: 'full',
            height: '600px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <h1 style={{ color: 'black' }}>Yuklanmoqda...</h1>
        </div>
      </Container>
    );

  if (libraries)
    return (
      <>
        <main style={{ width: '100%', backgroundColor: 'gray' }}>
          <Container fluid w={1600}>
            <div style={{ backgroundColor: '#151515f6', padding: '20px' }}>
              <div
                style={{
                  width: '90%',
                  margin: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px',
                }}>
                <h1 style={{ color: 'yellow' }}>
                  Hamma Kutubxona {libraries.length} ta
                </h1>
                <div
                  style={{
                    width: '22%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <button
                    onClick={() => setFilter('all')}
                    style={{
                      backgroundColor: filter === 'all' ? 'orange' : 'yellow',
                      border: 'none',
                      width: '90px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}>
                    Hammasi
                  </button>
                  <button
                    onClick={() => setFilter('active')}
                    style={{
                      backgroundColor:
                        filter === 'active' ? 'orange' : 'yellow',
                      border: 'none',
                      width: '80px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}>
                    Faollar
                  </button>
                  <button
                    onClick={() => setFilter('inactive')}
                    style={{
                      backgroundColor:
                        filter === 'inactive' ? 'orange' : 'yellow',
                      border: 'none',
                      width: '90px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}>
                    Nofaollar
                  </button>
                </div>
              </div>
              <div
                style={{
                  width: '90%',
                  height: '70px',
                  backgroundColor: '#151515f6',
                  margin: 'auto',
                  borderRadius: '20px',
                  border: '2px solid gray',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '20px',
                  justifyContent: 'space-between',
                }}>
                <p style={{ color: 'yellow', width: '150px' }}>Kutubxona</p>
                <p style={{ color: 'yellow', width: '310px' }}>Manzil</p>
                <p
                  style={{
                    color: 'yellow',
                    width: '80px',
                    paddingLeft: '20px',
                  }}>
                  Holat
                </p>
                <p style={{ color: 'yellow', width: '100px' }}>Kitoblar soni</p>
                <p style={{ color: 'yellow', width: '100px' }}>Amallar</p>
              </div>
              {libraries
                .filter((library) => {
                  if (filter === 'all') return true;
                  if (filter === 'active') return library.is_active;
                  if (filter === 'inactive') return !library.is_active;
                  return true;
                })
                .map((library) => (
                  <div
                    key={library.id}
                    onMouseEnter={() => setHoveredId(library.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      width: '90%',
                      display: 'flex',
                      flexDirection: 'column',
                      margin: 'auto',
                      border: '2px solid gray',
                      padding: '20px',
                      borderRadius: '20px',
                      marginTop: '10px',
                      backgroundColor:
                        hoveredId === library.id ? '#1f1f1f' : '#151515f6',
                      transform:
                        hoveredId === library.id ? 'scale(1.01)' : 'scale(1)',
                      transition: 'all 0.25s ease',
                      cursor: 'pointer',
                    }}>
                    <Flex
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <div style={{ width: '150px' }}>
                        <h2 style={{ color: 'yellow' }}>{library.name}</h2>
                      </div>
                      <div style={{ width: '310px' }}>
                        <p style={{ color: 'yellow' }}>{library.address}</p>
                      </div>
                      <div
                        style={{
                          width: '80px',
                          border: '1px solid yellow',
                          height: '30px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '10px',
                        }}>
                        <p
                          style={{
                            color: library.is_active ? 'green' : 'red',
                          }}>
                          {library.is_active ? 'Faol' : 'Nofaol'}
                        </p>
                      </div>
                      <div>
                        <p style={{ color: 'yellow', width: '100px' }}>
                          {library.total_books} ta
                        </p>
                      </div>
                      <div
                        style={{
                          width: '100px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          paddingLeft: '10px',
                        }}>
                        <button
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px',
                            border: 'yellow 1px solid',
                            borderRadius: '50%',
                            backgroundColor: '#151515f6',
                            color: 'yellow',
                            paddingBottom: '10px',
                            cursor: 'pointer',
                          }}>
                          . . .
                        </button>
                      </div>
                    </Flex>
                  </div>
                ))}
            </div>
          </Container>
        </main>
      </>
    );
};

export default Home;
