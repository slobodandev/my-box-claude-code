import { useState } from 'react';
import { Card, Button, Input, Space, Typography, message, Spin } from 'antd';
import { LinkOutlined, MailOutlined } from '@ant-design/icons';
import { linkAPI } from '../services/api';
import { LinkInfo } from '../types';

const { Title, Paragraph, Text } = Typography;

export default function Home() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<LinkInfo | null>(null);

  const handleCreateLink = async () => {
    setLoading(true);
    try {
      const link = await linkAPI.create(email || undefined);
      setGeneratedLink(link);
      if (email) {
        message.success('Link created and email sent!');
      } else {
        message.success('Link created successfully!');
      }
    } catch (error) {
      console.error('Error creating link:', error);
      message.error('Failed to create link');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedLink?.url) {
      navigator.clipboard.writeText(generatedLink.url);
      message.success('Link copied to clipboard!');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card
        style={{
          maxWidth: 600,
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          borderRadius: 12
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <LinkOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
            <Title level={2} style={{ marginBottom: 8 }}>
              Box File Sharing
            </Title>
            <Paragraph type="secondary">
              Create a secure link to share files. Anyone with the link can view and upload files.
            </Paragraph>
          </div>

          {!generatedLink ? (
            <>
              <div>
                <Text strong>Email (optional)</Text>
                <Input
                  size="large"
                  placeholder="recipient@example.com"
                  prefix={<MailOutlined />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ marginTop: 8 }}
                />
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
                  If provided, we'll send the link via email
                </Text>
              </div>

              <Button
                type="primary"
                size="large"
                block
                onClick={handleCreateLink}
                loading={loading}
                icon={<LinkOutlined />}
              >
                Create Sharing Link
              </Button>
            </>
          ) : (
            <div>
              <Card style={{ background: '#f0f2f5' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>Your sharing link is ready!</Text>
                  <Input.TextArea
                    value={generatedLink.url}
                    readOnly
                    autoSize={{ minRows: 2, maxRows: 3 }}
                    style={{ fontFamily: 'monospace' }}
                  />
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Button onClick={copyToClipboard}>
                      Copy Link
                    </Button>
                    <Button
                      type="primary"
                      href={generatedLink.url}
                      target="_blank"
                    >
                      Open Link
                    </Button>
                  </Space>
                </Space>
              </Card>

              <Button
                block
                onClick={() => {
                  setGeneratedLink(null);
                  setEmail('');
                }}
              >
                Create Another Link
              </Button>
            </div>
          )}
        </Space>
      </Card>
    </div>
  );
}
