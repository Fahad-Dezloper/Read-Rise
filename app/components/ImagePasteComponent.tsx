"use client"
import React, { useState } from 'react';

const ImagePasteComponent = () => {
  const [imageSrc, setImageSrc] = useState('');

  const handlePaste = (event) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageSrc(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div>
      <h2>Paste an Image</h2>
      <div
        onPaste={handlePaste}
        style={{
          border: '2px dashed #ccc',
          padding: '20px',
          textAlign: 'center',
          marginBottom: '20px',
        }}
      >
        Paste your image here (Ctrl + V)
      </div>
      {imageSrc && (
        <img
          src={imageSrc}
          alt="Pasted Image"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      )}
    </div>
  );
};

export default ImagePasteComponent;