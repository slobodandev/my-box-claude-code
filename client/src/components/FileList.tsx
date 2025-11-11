import { List, Card, Button, Space, Typography, Modal, message, Tag } from 'antd';
import {
  DownloadOutlined,
  DeleteOutlined,
  FileOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  FileZipOutlined,
  FileExcelOutlined,
  FileWordOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FileInfo } from '../types';
import { fileAPI } from '../services/api';

dayjs.extend(relativeTime);

const { Text } = Typography;

interface FileListProps {
  files: FileInfo[];
  token: string;
  onFileDeleted: () => void;
}

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return <FileImageOutlined style={{ fontSize: 24, color: '#52c41a' }} />;
  if (type.includes('pdf')) return <FilePdfOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />;
  if (type.includes('zip') || type.includes('rar')) return <FileZipOutlined style={{ fontSize: 24, color: '#faad14' }} />;
  if (type.includes('word') || type.includes('document')) return <FileWordOutlined style={{ fontSize: 24, color: '#1890ff' }} />;
  if (type.includes('excel') || type.includes('spreadsheet')) return <FileExcelOutlined style={{ fontSize: 24, color: '#52c41a' }} />;
  if (type.includes('text')) return <FileTextOutlined style={{ fontSize: 24, color: '#666' }} />;
  return <FileOutlined style={{ fontSize: 24, color: '#666' }} />;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export default function FileList({ files, token, onFileDeleted }: FileListProps) {
  const handleDownload = (file: FileInfo) => {
    const url = fileAPI.getDownloadUrl(token, file.id);
    window.open(url, '_blank');
  };

  const handleDelete = (file: FileInfo) => {
    Modal.confirm({
      title: 'Delete File',
      content: `Are you sure you want to delete "${file.name}"?`,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await fileAPI.delete(token, file.id);
          message.success('File deleted successfully');
          onFileDeleted();
        } catch (error) {
          console.error('Delete error:', error);
          message.error('Failed to delete file');
        }
      },
    });
  };

  if (files.length === 0) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <FileOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
          <p style={{ marginTop: 16, color: '#999' }}>No files uploaded yet</p>
        </div>
      </Card>
    );
  }

  return (
    <List
      grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
      dataSource={files}
      renderItem={(file) => (
        <List.Item>
          <Card
            hoverable
            style={{ height: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {getFileIcon(file.type)}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text strong style={{ fontSize: 16 }} ellipsis={{ tooltip: file.name }}>
                    {file.name}
                  </Text>
                  <div style={{ marginTop: 4 }}>
                    <Tag color="blue">{formatFileSize(file.size)}</Tag>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {dayjs(file.uploadedAt).fromNow()}
                    </Text>
                  </div>
                </div>
              </div>

              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownload(file)}
                >
                  Download
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(file)}
                >
                  Delete
                </Button>
              </Space>
            </Space>
          </Card>
        </List.Item>
      )}
    />
  );
}
