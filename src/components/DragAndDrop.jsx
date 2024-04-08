import { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import '../styles/DragAndDrop.css';
import axios from 'axios';
const { Dragger } = Upload;
import ProgressBar from './ProgressBar'

const DragAndDrop = ({ setHasUploaded, setLineItems }) => {
  const [fileList, setFileList] = useState([]);
  const [progress, setProgress] = useState(0)

  const handleChange = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    setFileList(fileList);
  };

  const customRequest = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    // from taggun
    formData.append('file', file);
    console.log(file)
    const config = {
      onUploadProgress: (progressEvent) => {
        const percentage = ((progressEvent.loaded * 100) / progressEvent.total)
        setProgress(+percentage.toFixed(2))
      }
    }

    // update url from backend
    try {
      const response = await axios.post('/api/upload', formData, config);
      message.success(`${file.name}, file uploaded successfully`);
      console.log('Server Response: ', response.data);
      if (response.data) {
        setLineItems(response.data);
      }
      setHasUploaded(true);
      onSuccess(response.data);
    } catch (error) {
      console.error('Server Response: ', error);
      message.error(`${file.name}, file upload failed`);
      setHasUploaded(false);
      onError(error);
    }
  };

  return (
    <>
     <Dragger name="file" multiple={false} fileList={fileList} onChange={handleChange} customRequest={customRequest} onRemove={() => setFileList([])} id="drag-and-drop">
      <p className="ant-upload-drag-icon">
        <InboxOutlined style={{ color: '#f19cbb' }} />
      </p>
      <p className="ant-upload-text" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint" style={{ color: 'rgba(255, 255, 255, 0.55)' }}>
        {' '}
        Support for a single upload. Strictly prohibited from uploading company data or other banned files.
      </p>
    </Dragger>
    <div className="progress-container">{progress > 0 && <ProgressBar percent={progress} setPercent={setProgress} className="progress-bar" />}</div>
    </>
  );
};
export default DragAndDrop;

// const props = {
//   name: file,
//   multiple: false,
//   action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
//   onChange(info) {
//     const { status } = info.file;
//     if (status !== 'uploading') {
//       console.log(info.file, info.fileList);
//     }
//     if (status === 'done') {
//       message.success(`${info.file.name} file uploaded successfully.`);
//     } else if (status === 'error') {
//       message.error(`${info.file.name} file upload failed.`);
//     }
//   },
//   onDrop(e) {
//     console.log('Dropped files', e.dataTransfer.files);
//   },
// };
