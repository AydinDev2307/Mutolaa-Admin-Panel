import Home from './pages/Home';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import ProtectedRoute from './route/ProtectedRoute';
import AddLibrary from './pages/AddLibrary';
import Detail from './pages/Detail';
import Favorites from './pages/Favorites';
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/addLibrary" element={<AddLibrary />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/favorites" element={<Favorites />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
