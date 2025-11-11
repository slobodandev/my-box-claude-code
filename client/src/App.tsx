import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Home from './pages/Home';
import SharedFolder from './pages/SharedFolder';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
        },
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/share/:token" element={<SharedFolder />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
