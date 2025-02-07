/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const UploadCustom: React.FC<{ setFile: (file: File | null) => void }> = ({ setFile }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setLoading(false);
      setFile(info.file.originFileObj || null); // Truyền file về component cha
      // Hiển thị preview ảnh (nếu cần)
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(info.file.originFileObj as File);
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <Upload
      name="imageFile"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      beforeUpload={() => true} // Chấp nhận mọi file upload
      onChange={handleChange}
    >
      {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
    </Upload>
  );
};

export default UploadCustom;
