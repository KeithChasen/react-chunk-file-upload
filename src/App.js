import { useState } from 'react';
import './App.css';

function App() {
  const [dropzoneActive, setDropzoneActive] = useState(false);
  const [files, setFiles] = useState([]);

  const handleDrop = e => {
    e.preventDefault();
    setFiles([...files, e.dataTransfer.files])
  }

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
