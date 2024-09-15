import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import axios from 'axios';
import Cookies from 'js-cookie'; // To handle cookies

const fetchApiData = async (token) => {
  const startTime = performance.now(); // Start timer
  try {
    const response = await axios.get('http://localhost:5000/api/metrics/total-users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const endTime = performance.now(); // End timer
    const latency = endTime - startTime; // Calculate latency
    // console.log(`API Latency: ${latency} ms`);

    return { data: response.data, latency }; // Return both data and latency
  } catch (error) {
    console.error('Error fetching API:', error);
    return null; // Return null in case of error
  }
};

const LatencyChart = ({ selectedRange }) => {
  const [latencyData, setLatencyData] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token");
      const result = await fetchApiData(token);
      if (result) { // Check if the result is not null
        const { latency } = result;
        setLatencyData((prevData) => [...prevData, latency]);
        setLabels((prevLabels) => [...prevLabels, new Date().toLocaleTimeString()]);
      }
    };

    fetchData(); // Fetch data on component mount
    const intervalId = setInterval(fetchData, 900000); // Fetch data every 15 minutes (900,000 ms)

    return () => clearInterval(intervalId);
  }, [selectedRange]); // Run effect whenever selectedRange changes

  // Define chart data and options
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'API Latency (ms)',
        data: latencyData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += Math.round(context.parsed.y) + ' ms';
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Latency (ms)',
          padding: { top: 10 }
        },
        ticks: {
          padding: 10
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time',
          padding: { bottom: 10 }
        },
        ticks: {
          padding: 10
        }
      },
    },
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20
      }
    }
  };

  return (
    <div className="container text-center" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h5>API Latency Stats</h5>
      <div style={{ position: 'relative', height: '300px' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default LatencyChart;
