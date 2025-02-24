import { Line } from "react-chartjs-2";

import "../css/profileDetails.css";
const ProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfileById(id).then(setProfile);
  }, [id]);

  if (!profile) return <p>Loading...</p>;

  const historicalData = profile.historicalSubscriberData || profile.historicalFollowerData;
  const chartData = {
    labels: historicalData.map((data) => data.date),
    datasets: [
      {
        label: "Followers/Subscribers Over Time",
        data: historicalData.map((data) => data.count),
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
      },
    ],
  };

  return (
    
    <div className="p-4">
      <h2>{profile.displayName}</h2>
      <img src={profile.profileImageUrl} alt={profile.username} className="w-24 h-24 rounded-full" />
      <p>{profile.description}</p>
      <p>Rank: {profile.rank}</p>
      <p>Estimated Earnings: {profile.estimatedEarnings}</p>
      <Line data={chartData} />
    </div>
    
  );
};

export default ProfilePage;
