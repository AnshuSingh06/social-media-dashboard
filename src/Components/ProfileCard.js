import { FaYoutube, FaTwitch, FaInstagram } from "react-icons/fa";

const ProfileCard = ({ profile, onClick }) => {
  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "YouTube": return <FaYoutube className="text-red-500 text-xl" />;
      case "Twitch": return <FaTwitch className="text-purple-500 text-xl" />;
      case "Instagram": return <FaInstagram className="text-pink-500 text-xl" />;
      default: return null;
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-100" onClick={() => onClick(profile)}>
      <div className="flex items-center gap-4">
        <img src={profile.profileImageUrl || "/default-avatar.png"} alt={profile.username} className="w-16 h-16 rounded-full" />
        <div>
          <h3 className="font-bold">{profile.displayName}</h3>
          <p className="text-gray-600 flex items-center gap-2">
            {getPlatformIcon(profile.platform)} {profile.platform}
          </p>
          <p className="text-gray-700">Subscribers/Fans: {profile.subscriberCount || profile.followerCount}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
