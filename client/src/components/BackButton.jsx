import styles from './BackButton.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export const BackButtonComponent = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button className={styles.BackButton} onClick={handleBack}>
      <FontAwesomeIcon icon={faArrowLeft} />
    </button>
  );
};
