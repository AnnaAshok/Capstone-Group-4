import React, { useEffect, useState } from "react";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
} from "react-icons/bs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

function Home() {
  const [stats, setStats] = useState({
    courses: 0,
    users: 0,
    categories: 0,
  });
  const [userPaymentsData, setUserPaymentsData] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/getCourses").then((res) => res.json()).catch((err) => {
        console.error("Error fetching courses:", err);
        return { count: 0 };
      }),
      fetch("http://localhost:5000/getUsers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json()).catch((err) => {
        console.error("Error fetching users:", err);
        return { count: 0 };
      }),
      fetch("http://localhost:5000/getCategory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json()).catch((err) => {
        console.error("Error fetching categories:", err);
        return { categories: [] };
      }),
      fetch("http://localhost:5000/getAllPayments")
        .then((res) => res.json())
        .catch((err) => {
          console.error("Error fetching user payments:", err);
          return [];
        }),
    ])
      .then(([courses, users, categories, allPayments]) => {
        setStats({
          courses: courses.count ?? (Array.isArray(courses) ? courses.length : 0),
          users: users.count ?? (Array.isArray(users) ? users.length : 0),
          categories: Array.isArray(categories.categories) ? categories.categories.length : 0,
        });

        // ✅ Get latest 10 payments by createdAt
        const latestPayments = [...allPayments]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10);

        setUserPaymentsData(latestPayments);
      })
      .catch((error) => console.error("Error in API requests:", error));
  }, []);

  const data = [
    { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
    { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
    { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
    { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
    { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
  ];

  return (
    <main className="main-container">
      <div className="main-title mt-4">
        <h3>DASHBOARD</h3>
      </div>

      <div className="main-cards">
        <div className="card">
          <div className="card-inner">
            <h3>Courses</h3>
            <BsFillArchiveFill className="card_icon" />
          </div>
          <h1>{stats.courses}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>Users</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <h1>{stats.users}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>Categories</h3>
            <BsFillGrid3X3GapFill className="card_icon" />
          </div>
          <h1>{stats.categories}</h1>
        </div>
      </div>

      <div className="charts">
        {userPaymentsData.length > 0 && (
          <div className="chart-item">
            <h3>Latest 10 User Payments</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userPaymentsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="email"
                  tickFormatter={(email) => email?.split("@")[0]}
                />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Bar dataKey="amount" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="chart-item">
          <h3>Site Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}

export default Home;
