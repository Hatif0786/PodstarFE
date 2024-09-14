import React, { useState, useEffect, useCallback } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend);

const MetricsDoughnutChart = ({ dataPoints, title }) => {
  const data = {
    labels: ["New Users", "Remaining"],
    datasets: [
      {
        label: title,
        data: dataPoints,
        backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

const NewUsersMetrics = ({
  selectedRange,
  setMenuOpened,
  logout,
  setUserlogged,
  setPlayerVisible,
  darkMode,
  onPreviousUsersChange,
  onNewUserSignupsChange,
}) => {
  const [doughnutData, setDoughnutData] = useState([0, 100]);
  const [totalUsers, setTotalUsers] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTotalUsers = async () => {
      if (!Cookies.get("token")) {
        logout();
        setPlayerVisible(false);
        setMenuOpened(false);
        setUserlogged(false);
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          "https://podstar-1.onrender.com/api/metrics/total-users",
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        const total = response.data;
        setTotalUsers(total);
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    };

    fetchTotalUsers();
  }, [logout, navigate, setMenuOpened, setPlayerVisible, setUserlogged]);

  // Memoize fetchNewUserPreviousSignups
  const fetchNewUserPreviousSignups = useCallback(async (currentSignups) => {
    if (!Cookies.get("token")) {
      logout();
      setPlayerVisible(false);
      setMenuOpened(false);
      setUserlogged(false);
      navigate("/login");
      return;
    }
    let url = "";
    switch (selectedRange) {
      case "lastDay":
        url = "https://podstar-1.onrender.com/api/metrics/new-user-signups?range=lastTolastDay";
        break;
      case "lastWeek":
        url = "https://podstar-1.onrender.com/api/metrics/new-user-signups?range=lastTolastWeek";
        break;
      case "lastMonth":
        url = "https://podstar-1.onrender.com/api/metrics/new-user-signups?range=lastTolastMonth";
        break;
      case "lastYear":
        url = "https://podstar-1.onrender.com/api/metrics/new-user-signups?range=lastTolastYear";
        break;
      default:
        url = "https://podstar-1.onrender.com/api/metrics/new-user-signups?range=lastTolastDay";
    }

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      const previousUserSignups = response.data;

      // Calculate percentage change (+ or -)
      const percentageChange =
        previousUserSignups > 0
          ? ((currentSignups - previousUserSignups) / previousUserSignups) * 100
          : 0;

      if (onPreviousUsersChange) onPreviousUsersChange(percentageChange);
    } catch (error) {
      console.error("Error fetching previous user signups:", error);
    }
  }, [selectedRange, logout, navigate, setMenuOpened, setPlayerVisible, setUserlogged, onPreviousUsersChange]);

  // Memoize fetchNewUserSignups and include fetchNewUserPreviousSignups in the dependency array
  const fetchNewUserSignups = useCallback(async () => {
    if (!Cookies.get("token")) {
      logout();
      setPlayerVisible(false);
      setMenuOpened(false);
      setUserlogged(false);
      navigate("/login");
      return;
    }
    let url = "";
    switch (selectedRange) {
      case "lastDay":
        url = "https://podstar-1.onrender.com/api/metrics/new-user-signups?range=lastDay";
        break;
      case "lastWeek":
        url = "https://podstar-1.onrender.com/api/metrics/new-user-signups?range=lastWeek";
        break;
      case "lastMonth":
        url = "https://podstar-1.onrender.com/api/metrics/new-user-signups?range=lastMonth";
        break;
      case "lastYear":
        url = "https://podstar-1.onrender.com/api/metrics/new-user-signups?range=lastYear";
        break;
      default:
        url = "https://podstar-1.onrender.com/api/metrics/new-user-signups?range=lastDay";
    }

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      const newUserSignups = response.data;
      const signupPercentage =
        totalUsers > 0 ? (newUserSignups / totalUsers) * 100 : 0;
      const remainingPercentage = 100 - signupPercentage;

      setDoughnutData([signupPercentage, remainingPercentage]);
      if (onNewUserSignupsChange) onNewUserSignupsChange(newUserSignups);

      // Fetch the previous period signups for comparison
      fetchNewUserPreviousSignups(newUserSignups);
    } catch (error) {
      console.error("Error fetching new user signups:", error);
    }
  }, [selectedRange, totalUsers, logout, navigate, setMenuOpened, setPlayerVisible, setUserlogged, onNewUserSignupsChange, fetchNewUserPreviousSignups]);

  useEffect(() => {
    if (totalUsers > 0) {
      fetchNewUserSignups();
    }
  }, [selectedRange, totalUsers, fetchNewUserSignups]);

  return (
    <Box sx={{ textAlign: "center" }}>
      <h5 variant="h5" gutterBottom>
        New Users
      </h5>
      <MetricsDoughnutChart
        title="New Users Percentage"
        dataPoints={doughnutData}
      />
    </Box>
  );
};

export default NewUsersMetrics;
