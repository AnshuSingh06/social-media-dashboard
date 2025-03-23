import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const Historicalchart = ({ data, dataKey }) => { 
  // Handles Edge Cases (If No Data is Provided)
  if (!Array.isArray(data) || data.length === 0) {
    console.warn("No valid historical data for bar chart.");
    return <p className="text-gray-500">No historical data available.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#ccc" />
        <Bar dataKey={dataKey} fill="#1E90FF" barSize={30} />
      </BarChart>
    </ResponsiveContainer>
    
  );
};

export default Historicalchart;
