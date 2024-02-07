import { usePostsContext } from "../hooks/usePostsContext"
import { useAuthContext } from "../hooks/useAuthContext"
import { postApi } from "../services/api"
import styles from './PostDetails.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { timeSince } from "../utils/useTimeSinceString";
const PostDetails = ({post}) => {
  const {username,_id,content,likesCount ,createdAt} = post;
  const { dispatch } = usePostsContext()
  const { user } = useAuthContext()
  const handleClick = async () => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`,
    };
    const response = await postApi.delete({postId:_id}, headers)
    if (response) {
      dispatch({type: 'DELETE_WORKOUT', payload: response})
    }
  }

  return (
    <div className={styles.postDetailsContainer}>
      <div className={styles.profilePicContainer}>
        <div className={styles.profilePic}>
          <FontAwesomeIcon icon={faUser} className="rounded me-2"/>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.header}>
          <div className={styles.name}>
           {username}
          </div>
          <div className={styles.username}>
          @{username}
          </div>
          <div className={styles.dote}>
            ·
          </div>
          <div className={styles.date}>
            {timeSince(createdAt)}
          </div>
        </div>
        <div className={styles.content}>
          {content}
        </div>
        <div className={styles.settings}>

        </div>
      </div>
    </div>
  )
}

export default PostDetails