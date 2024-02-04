import { useParams } from 'react-router-dom'
const Profile = () => {
  const { username } = useParams()
  
  return (
    <div>
      <h2>User Profile: {username}</h2>
    </div>
  );
};

export default Profile
