import ProfileCard from "./ProfileCard";
import { useNavigate } from "react-router-dom";



const ProfileList = ({ profiles, onSelect }) => {
  const navigate = useNavigate(); // ✅ Initialize navigate
  const handleProfileClick = (profile) => {
    navigate(`/profile/${profile.id}`);
  };
  return (
    <div className="grid grid-cols-3 gap-4">
      {profiles.map((profile) => (
        
        <ProfileCard profile={profile} onClick={() => handleProfileClick(profile)} />

      ))}
    </div>
  );
};

export default ProfileList;
