import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const chunkSize = 10 * 1024;

function App() {
  const [dropzoneActive, setDropzoneActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(null);
  const [lastUploadedFileIndex, setLastUploadedFileIndex] = useState(null)
  const [currentChunkIndex, setCurrentChunkIndex] = useState(null); 

  const handleDrop = e => {
    e.preventDefault();
    setFiles([...files, e.dataTransfer.files[0]])
  }

  const readAndUploadCurrentChunk = () => {
    const reader = new FileReader();
    const file = files[currentFileIndex];

    if (!files) {
      return;
    }

    // 0 => 0
    // 1 => 1024
    // 2 => 2048
    // ...
    const from = currentChunkIndex * chunkSize; 
    
    const to = from + chunkSize;

    // binary part
    const blob = file.slice(from, to);

    reader.onload = e => uploadChunk(e);
    reader.readAsDataURL(blob);
  }

  const uploadChunk = readerEvent => {
    // need to know file which chunk we about to upload
    const file = files[currentFileIndex];
    const data = readerEvent.target.result;
    const params = new URLSearchParams();

    params.set('name', file.name);
    params.set('size', file.size);
    params.set('currentChunkIndex', currentChunkIndex);
    params.set('totalChunks', Math.ceil(file.size / chunkSize));

    const headers = {'Content-Type': 'application/octet-stream'};
    const url = `http://localhost:4000/upload?${params.toString()}`;

    axios.post(url, data, { headers })
    .then(response => {

      console.log(response, 'resp')
      
    })
  }

  useEffect(() => {
    if (files.length > 0) {
      if (currentFileIndex === null) {
        setCurrentFileIndex(
            lastUploadedFileIndex === null 
            ? 0 
            : lastUploadedFileIndex + 1
          );
      }
    }
    // when we drop new file 
    // length of files changes
    // so we're updating current file index
  }, [files.length]);

  useEffect(() => {
    if (currentFileIndex !== null) {
      setCurrentChunkIndex(0);
    }
    
    // so when current file index changed
    // we need to start uploading this file
  }, [currentFileIndex]);

  useEffect(() => {
    if (currentChunkIndex !== null) {
      readAndUploadCurrentChunk();
    }
    // if chunk index changed
    // start uploading it
  }, [currentChunkIndex]);

  return (
    <div>
      <div 
        onDragOver={e => {
          e.preventDefault();
          setDropzoneActive(true);
        }}
        onDragLeave={e => {
          e.preventDefault();
          setDropzoneActive(false);
        }}
        onDrop={handleDrop}
        className={`dropzone ${dropzoneActive ? ' active' : ''}`}
        >
          Drop your files here
        </div>
    </div>
  );
}

export default App;
