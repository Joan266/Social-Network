import { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import styles from './EditMedia.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function EditMedia({ imgSrc, endOfEdit, inputImageType }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState()
  const [ aspect, setAspect ] = useState(null)

  useEffect(()=>{
    if (inputImageType === "banner") {
      setAspect(3);  
    } else if (inputImageType === "profilepic") {
      setAspect(1);  
    } else if (inputImageType === "postimage") {
      setAspect(1);  
    }
  },[inputImageType])
  
  const onCropComplete = useCallback(
    (croppedAreaPercentages, croppedAreaPixels) => {
      setCroppedArea(croppedAreaPixels)
    },
    []
  )

  const handleApply = () => {
    if (!croppedArea || !imgSrc) {
        // If cropped area is invalid or image source is missing, return
        endOfEdit();
        return;
    }

    const image = new Image();
    image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let width = croppedArea.width;
        let height = croppedArea.height;

        if (inputImageType === "postimage") {
            // Set width and height to 500x500
            width = 500;
            height = 500;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(
            image,
            croppedArea.x,
            croppedArea.y,
            croppedArea.width,
            croppedArea.height,
            0,
            0,
            width,
            height
        );

        canvas.toBlob((blob) => {
            const file = new File([blob], 'cropped-image.webp', { type: 'image/webp' });
            const imageUrl = URL.createObjectURL(file); // Create a URL for the File
            endOfEdit({ file, imageUrl }); // Pass both the File and the URL to the endOfEdit function
        }, 'image/webp');
    };

    // Set the src of the image element to trigger the onload event
    image.src = imgSrc;
};

  
  
  
  return (
    <div className={styles.editMediaContainer}>
      <div className={styles.navContainer}>
        <div className={styles.xMark} onClick={()=>endOfEdit()}>
          <FontAwesomeIcon icon={faXmark} />
        </div>
        <div className={styles.editMediaLabel}>Edit media</div>
        <div className={styles.applyButton}><button onClick={handleApply}>Apply</button></div>
      </div>
      <div className={styles.cropContainer}>
        <Cropper
          image={imgSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className={styles.controls}>
        <input
          type="range"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e) => setZoom(e.target.value)}
          className="zoom-range"
        />
      </div>
    </div>
  );
}
