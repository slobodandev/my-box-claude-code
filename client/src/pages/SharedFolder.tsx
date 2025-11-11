import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, Space, Spin, Alert, Divider, Button } from 'antd';
import { CloudOutlined, ReloadOutlined } from '@ant-design/icons';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';
import { fileAPI, linkAPI } from '../services/api';
import { FileInfo, LinkInfo } from '../types';

const { Title, Text } = Typography;

export default function SharedFolder() {
  const { token } = useParams<{ token: string }>();
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [linkInfo, setLinkInfo] = useState<LinkInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      const [filesData, info] = await Promise.all([
        fileAPI.getFiles(token),
        linkAPI.getInfo(token),
      ]);
      setFiles(filesData);
      setLinkInfo(info);
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.response?.status === 404 ? 'Invalid or expired link' : 'Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Card style={{ textAlign: 'center', minWidth: 300 }}>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>Loading shared folder...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Card style={{ maxWidth: 500, width: '100%' }}>
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
          />
        </Card>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Card
          style={{
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            borderRadius: 12,
            marginBottom: 24
          }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <CloudOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
              <Title level={2} style={{ marginBottom: 8 }}>
                Shared Folder
              </Title>
              <Text type="secondary">
                Upload new files or download existing ones
              </Text>
            </div>

            <Divider />

            <div>
              <Title level={4} style={{ marginBottom: 16 }}>
                Upload Files
              </Title>
              <FileUpload token={token!} onUploadSuccess={loadData} />
            </div>

            <Divider />

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>
                  Files ({files.length})
                </Title>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={loadData}
                >
                  Refresh
                </Button>
              </div>
              <FileList files={files} token={token!} onFileDeleted={loadData} />
            </div>
          </Space>
        </Card>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Text style={{ color: 'white' }}>
            Share this link with others to collaborate on files
          </Text>
        </div>
      </div>
    </div>
  );
}
