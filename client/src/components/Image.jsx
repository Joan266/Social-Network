import { useState, useEffect } from 'react';
import { filesApi } from '../services/api';
import { useAuthContext } from '../hooks/useAuthContext';

const ImageComponent = ({ fileId }) => {
  const [imageUrl, setImageUrl] = useState('');
  const { user } = useAuthContext();
  
  useEffect(() => {
    async function fetchImage() {
      try {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        };
        const response = await filesApi.image(fileId, headers);
        console.log(response)
        const objectURL = URL.createObjectURL(response);
        setImageUrl(objectURL);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    }

    fetchImage();

    // Clean up to revoke the Object URL when component unmounts
    return () => {
      URL.revokeObjectURL(imageUrl);
    };
  }, [fileId, user]);

  return (
    imageUrl && <img src={imageUrl} alt="Uploaded" />
  );
};

export default ImageComponent;
