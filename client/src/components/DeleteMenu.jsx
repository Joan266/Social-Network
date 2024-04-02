import { useNavigate } from 'react-router-dom'; 
import styles from './DeleteMenu.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { postApi } from '../services/postApi';
import { useAuthContext } from '../hooks/useAuthContext';
const DeleteMenu = ({postId, setIsDeleteMenuVisible }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate()
  const handleDeletePost =  async () => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`,
    };
    const response = await postApi.delete({postId}, headers);
  }
  return (
    <div className={styles.deleteMenuOverlay}onClick={(e)=>e.stopPropagation()}>
    <div className={styles.deleteMenuContainer}>
      <div className={styles.deleteMenu} >
        <div className={styles.navContainer}>
          <div className={styles.xMark} onClick={()=>setIsDeleteMenuVisible(false)}>
            <FontAwesomeIcon
              className={styles.cancelSearch}
              icon={faXmark}
            />
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.container}>
           <p>Seguro que quieres borrar el post?</p> 
          </div>
        </div>
        <div className={styles.controls}>
          <div className={styles.acceptButtonContainer} onClick={()=>handleDeletePost()}>
            <button>Accept</button>
          </div>
          <div className={styles.declineButtonContainer} onClick={()=>setIsDeleteMenuVisible(false)}>
            <button >Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default DeleteMenu