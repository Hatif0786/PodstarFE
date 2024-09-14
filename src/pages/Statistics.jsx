import React, { useState } from 'react';
import { Grid, Box, Paper, Typography } from '@mui/material';
import {ShoppingCartRounded, GroupsRounded, EmojiPeopleRounded} from '@mui/icons-material'; // Example icon, you can customize as per your need
import NewUsersMetrics from '../components/metrices/NewUsersMetrics';
import "../css/Statistics.css";
import ActiveUserMetrics from '../components/metrices/ActiveUserMetrics';

// Reusable Card Component for Top Metrics
const StatCard = ({ title, value, percentage, icon }) => {
  return (
    <Paper elevation={3} sx={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '12px' }}>
      <Box>
        <h5 variant="subtitle1">{title}</h5>
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginTop: '8px' }}>{value}</Typography>
        <Typography variant="body2" color={percentage > 0 ? 'green' : 'red'} sx={{ marginTop: '4px' }}>
          {percentage > 0 ? `↑ ${percentage}% since last period` : `↓ ${Math.abs(percentage)}% since last period`}
        </Typography>
      </Box>
      <Box sx={{ fontSize: '3rem' }}>
        {icon}
      </Box>
    </Paper>
  );
};

const Statistics = ({ setMenuOpened, logout, setUserlogged, setPlayerVisible, darkMode }) => {
  const [selectedRange, setSelectedRange] = useState('lastDay'); // Global state for the dropdown
  const [previousUsers, setPreviousUsers] = useState(0);
  const [newUserSignups, setNewUserSignups] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [previousActiveUsers, setPreviousActiveUsers] = useState(0);

  const handlePreviousUsersChange = (total) => {
    setPreviousUsers(total);
  };

  const handleNewUserSignupsChange = (signups) => {
    setNewUserSignups(signups);
  };

  const handlePreviousActiveUsersChange = (total) => {
    setPreviousActiveUsers(total);
  };

  const handleActiveUsersChange = (active) => {
    setActiveUsers(active);
  };

  return (
    <div className="statsContainer">
      {/* Top Cards Section */}
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={2}>
          {/* First Card */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Sales Turnover"
              value="RP. 3,600,000"
              percentage={-13.8}
              icon={<ShoppingCartRounded sx={{ fontSize: 40, color: 'green' }} />} // Example icon
            />
          </Grid>

          {/* Second Card */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="New Users"
              value={newUserSignups}
              percentage={previousUsers}
              icon={<GroupsRounded sx={{ fontSize: 40, color: 'blue' }} />} // Replace icon
            />
          </Grid>

          {/* Third Card */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Users"
              value={activeUsers}
              percentage={previousActiveUsers}
              icon={<EmojiPeopleRounded sx={{ fontSize: 40, color: 'orange' }} />} // Replace icon
            />
          </Grid>

          {/* Fourth Card */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Churn Rate"
              value="5%"
              percentage={-1.2}
              icon={<ShoppingCartRounded sx={{ fontSize: 40, color: 'red' }} />} // Replace icon
            />
          </Grid>
        </Grid>
      </Box>

      {/* Global dropdown for selecting the time range */}
      <Box sx={{ padding: '16px', display: 'flex', justifyContent: 'flex-end' }}>
        <label htmlFor="timeRange">Filter: </label>
        <select
          id="timeRange"
          value={selectedRange}
          onChange={(e) => setSelectedRange(e.target.value)}
          style={{ marginLeft: '8px', padding: '4px' }} // Styling for the dropdown
        >
          <option value="lastDay">Last Day</option>
          <option value="lastWeek">Last Week</option>
          <option value="lastMonth">Last Month</option>
          <option value="lastYear">Last Year</option>
        </select>
      </Box>

      {/* Main Metrics Section */}
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              elevation={4} // Slight shadow for the popping-out effect
              sx={{
                padding: '20px', // More padding for a cleaner look
                borderRadius: '12px', // Smooth corners
                marginBottom: '24px', // Spacing between cards
                backgroundColor: '#fff', 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '350px', // Increased height for better readability
                minWidth: '320px', // Medium size width
                maxWidth: '100%',  // Ensure it is responsive to container size
              }}
            >
              {/* Pass the selected time range and other props to NewUsersMetrics */}
              <NewUsersMetrics 
                selectedRange={selectedRange} 
                setMenuOpened={setMenuOpened} 
                logout={logout} 
                setUserlogged={setUserlogged} 
                setPlayerVisible={setPlayerVisible} 
                darkMode={darkMode} 
                onPreviousUsersChange={handlePreviousUsersChange}
                onNewUserSignupsChange={handleNewUserSignupsChange}
              />
            </Paper>
          </Grid>

          {/* Add more Grid items here, passing the same props if necessary */}

          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              elevation={4} // Slight shadow for the popping-out effect
              sx={{
                padding: '20px', // More padding for a cleaner look
                borderRadius: '12px', // Smooth corners
                marginBottom: '24px', // Spacing between cards
                backgroundColor: '#fff', 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '350px', // Increased height for better readability
                minWidth: '320px', // Medium size width
                maxWidth: '100%',  // Ensure it is responsive to container size
              }}
            >
              {/* Pass the selected time range and other props to NewUsersMetrics */}
              <ActiveUserMetrics 
                selectedRange={selectedRange} 
                setMenuOpened={setMenuOpened} 
                logout={logout} 
                setUserlogged={setUserlogged} 
                setPlayerVisible={setPlayerVisible} 
                darkMode={darkMode} 
                onPreviousUsersChange={handlePreviousUsersChange}
                onNewUserSignupsChange={handleNewUserSignupsChange}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              elevation={4} // Slight shadow for the popping-out effect
              sx={{
                padding: '20px', // More padding for a cleaner look
                borderRadius: '12px', // Smooth corners
                marginBottom: '24px', // Spacing between cards
                backgroundColor: '#fff', 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '350px', // Increased height for better readability
                minWidth: '320px', // Medium size width
                maxWidth: '100%',  // Ensure it is responsive to container size
              }}
            >
              {/* Pass the selected time range and other props to NewUsersMetrics */}
              <ActiveUserMetrics 
                selectedRange={selectedRange} 
                setMenuOpened={setMenuOpened} 
                logout={logout} 
                setUserlogged={setUserlogged} 
                setPlayerVisible={setPlayerVisible} 
                darkMode={darkMode} 
                onPreviousActiveUsersChange={handlePreviousActiveUsersChange}
                onActiveUsersChange={handleActiveUsersChange}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Statistics;
