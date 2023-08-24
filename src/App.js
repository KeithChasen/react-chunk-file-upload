import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [dropzoneActive, setDropzoneActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(null);
  const [lastUploadedFileIndex, setLastUploadedFileIndex] = useState(null)
  const [currentChunkIndex, setCurrentChunkIndex] = useState(null); 

  const handleDrop = e => {
    e.preventDefault();
    setFiles([...files, e.dataTransfer.files])
  }

  const readAndUploadCurrentChunk = () => {

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
