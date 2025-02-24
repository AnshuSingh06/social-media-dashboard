import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getProfileById } from "../Services/api";
import Historicalchart from "./Historicalchart"; // ✅ Import Historicalchart
import PNavbar from "../Common/PNavbar";
import "../css/profileDetails.css";

const ProfileDetails = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(false); // ✅ Track errors
  const [loading, setLoading] = useState(true); // ✅ Track loading state

  useEffect(() => {
    let isMounted = true; // ✅ Prevent state update after unmount

    getProfileById(id)
      .then((data) => {
        console.log("Fetched Profile Data:", data);
        if (isMounted) {
          if (data) {
            setProfile(data);
          } else {
            setError(true);
          }
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false; // ✅ Cleanup function
    };
  }, [id]);

  if (loading) {
    return (
      <div className="text-center text-blue-500 font-bold mt-10">Loading...</div>
    );
  }

  if (error || !profile) {
    return (
      <div className="text-center text-red-500 font-bold mt-10">
        ⚠️ Failed to load profile data. Please try again later.
      </div>
    );
  }

  // 🔹 Determine historical data key & data key dynamically
  const historicalDataKey =
    profile.platform === "youtube"
      ? "historicalSubscriberData"
      : "historicalFollowerData";

  const dataKey =
    profile.platform === "youtube" ? "subscribers" : "followers";

  const historicalData = profile[historicalDataKey] || [];

  // 🔹 Get min & max values for dynamic Y-axis scaling
  const minValue =
    historicalData.length > 0
      ? Math.min(...historicalData.map((d) => d[dataKey] || 0))
      : 0;
  const maxValue =
    historicalData.length > 0
      ? Math.max(...historicalData.map((d) => d[dataKey] || 0))
      : 1000;

  // 🔹 Function to format Y-axis values dynamically (Millions, Thousands)
  const formatYAxis = (value) => {
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value;
  };

  return (
    <>
      <PNavbar />
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <img
            src={
              profile.profileImageUrl && profile.profileImageUrl.startsWith("http")
                ? profile.profileImageUrl
                : "https://via.placeholder.com/150"
            }
            alt={profile.username}
            className="profile-image"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/150";
            }} // ✅ Fallback image
          />
          <div className="profile-info">
            <h2>{profile.displayName || "N/A"}</h2>
            <p>{profile.description || "No description available"}</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="metric-box">
            <p className="metric-value">
              {profile.subscriberCount || profile.followerCount || "0"}
            </p>
            <p className="metric-label">Subscribers / Followers</p>
          </div>
          <div className="metric-box">
            <p className="metric-value">{profile.viewCount || profile.totalViews || "0"}</p>
            <p className="metric-label">Total Views</p>
          </div>
        </div>

        {/* 🔹 Line Chart (Follower Growth) */}
        <div className="chart-container large-chart">
          <h3>Follower Growth Over Time</h3>
          {historicalData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={historicalData}>
                <XAxis dataKey="date" />
                <YAxis domain={[minValue, maxValue]} tickFormatter={formatYAxis} />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <CartesianGrid stroke="#ccc" />
                <Line
                  type="monotone"
                  dataKey={dataKey}
                  stroke="#1E90FF"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No historical data available.</p>
          )}
        </div>

        {/* 🔹 Bar Chart (Historical Data) */}
        <div className="chart-container large-chart">
          <h3>Historical Data</h3>
          <Historicalchart data={historicalData} dataKey={dataKey} />
        </div>
      </div>
    </>
  );
};

export default ProfileDetails;
