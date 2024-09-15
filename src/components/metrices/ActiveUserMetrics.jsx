import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { debounce } from "../../utils/debounce"; // Adjust the path as necessary

const ActiveUserMetrics = ({
  selectedRange,
  setMenuOpened,
  logout,
  setUserlogged,
  setPlayerVisible,
  darkMode,
  onPreviousActiveUsersChange,
  onActiveUsersChange,
}) => {
  const [totalUsers, setTotalUsers] = useState(0);
  const navigate = useNavigate();

  const fetchTotalUsers = useCallback(async () => {
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
  }, [logout, navigate, setMenuOpened, setPlayerVisible, setUserlogged]);

  const fetchActiveUsers = useCallback(async () => {
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
        url = "https://podstar-1.onrender.com/api/metrics/active-users?range=lastDay";
        break;
      case "lastWeek":
        url = "https://podstar-1.onrender.com/api/metrics/active-users?range=lastWeek";
        break;
      case "lastMonth":
        url = "https://podstar-1.onrender.com/api/metrics/active-users?range=lastMonth";
        break;
      case "lastYear":
        url = "https://podstar-1.onrender.com/api/metrics/active-users?range=lastYear";
        break;
      default:
        url = "https://podstar-1.onrender.com/api/metrics/active-users?range=lastDay";
    }

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      const activeUsers = response.data;

      if (onActiveUsersChange) onActiveUsersChange(activeUsers);

      // Fetch the previous period signups for comparison
      fetchPreviousActiveUsers(activeUsers);
    } catch (error) {
      console.error("Error fetching active users:", error);
    }
  }, [selectedRange, logout, navigate, setMenuOpened, setPlayerVisible, setUserlogged, onActiveUsersChange]);

  const fetchPreviousActiveUsers = useCallback(async (currentActive) => {
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
        url = "https://podstar-1.onrender.com/api/metrics/active-users?range=lastTolastDay";
        break;
      case "lastWeek":
        url = "https://podstar-1.onrender.com/api/metrics/active-users?range=lastTolastWeek";
        break;
      case "lastMonth":
        url = "https://podstar-1.onrender.com/api/metrics/active-users?range=lastTolastMonth";
        break;
      case "lastYear":
        url = "https://podstar-1.onrender.com/api/metrics/active-users?range=lastTolastYear";
        break;
      default:
        url = "https://podstar-1.onrender.com/api/metrics/active-users?range=lastTolastDay";
    }

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      const previousActiveUsers = response.data;

      // Calculate percentage change (+ or -)
      const percentageChange =
        previousActiveUsers > 0
          ? ((currentActive - previousActiveUsers) / previousActiveUsers) * 100
          : 0;

      if (onPreviousActiveUsersChange) onPreviousActiveUsersChange(percentageChange);
    } catch (error) {
      console.error("Error fetching previous user signups:", error);
    }
  }, [selectedRange, logout, navigate, setMenuOpened, setPlayerVisible, setUserlogged, onPreviousActiveUsersChange]);

  useEffect(() => {
    if (totalUsers > 0) {
      const debouncedFetchActiveUsers = debounce(fetchActiveUsers, 500); // Adjust delay as needed
      debouncedFetchActiveUsers();
    }
  }, [selectedRange, totalUsers, fetchActiveUsers]);

  useEffect(() => {
    fetchTotalUsers();
  }, [fetchTotalUsers]);

  return (
    <div>ActiveUserMetrics</div>
  );
}

export default ActiveUserMetrics;
