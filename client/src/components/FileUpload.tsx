import { useState } from 'react';
import { Upload, message, Progress } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { fileAPI } from '../services/api';

const { Dragger } = Upload;

interface FileUploadProps {
  token: string;
  onUploadSuccess: () => void;
}

export default function FileUpload({ token, onUploadSuccess }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    beforeUpload: async (file) => {
      setUploading(true);
      setProgress(0);

      try {
        await fileAPI.upload(token, file, (progress) => {
          setProgress(progress);
        });

        message.success(`${file.name} uploaded successfully`);
        onUploadSuccess();
      } catch (error) {
        console.error('Upload error:', error);
        message.error(`${file.name} upload failed`);
      } finally {
        setUploading(false);
        setProgress(0);
      }

      return false; // Prevent default upload behavior
    },
  };

  return (
    <div>
      <Dragger {...uploadProps} disabled={uploading}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for single file upload. Maximum file size: 100MB
        </p>
      </Dragger>
      {uploading && (
        <div style={{ marginTop: 16 }}>
          <Progress percent={progress} status="active" />
        </div>
      )}
    </div>
  );
}
