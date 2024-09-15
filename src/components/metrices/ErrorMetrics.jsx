import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import Cookies from 'js-cookie';

const fetchErrorMetrics = async (token) => {
  try {
    const response = await axios.get('https://podstar-1.onrender.com/api/metrics/errors', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    return response.data;
  } catch (error) {
    console.error('Error fetching error metrics:', error);
    return {};
  }
};

const ErrorMetricsChart = () => {
  const [errorData, setErrorData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token");
      const data = await fetchErrorMetrics(token);
      setErrorData(data);
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60000); // Fetch data every minute (60000 ms)

    return () => clearInterval(intervalId);
  }, []);

  const data = {
    labels: ['404 Errors', '500 Errors', '409 Errors', '400 Errors', '403 Errors'],
    datasets: [
      {
        label: 'Error Counts',
        data: [errorData['404'] || 0, errorData['500'] || 0, errorData['409'] || 0, errorData['400'] || 0, errorData['403'] || 0],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 10,
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
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
          text: 'Count',
        },
        ticks: {
          padding: 10,
        },
      },
      x: {
        title: {
          display: true,
          text: 'Error Type',
        },
        ticks: {
          padding: 10,
        },
      },
    },
  };

  return (
    <div className='container text-center' style={{ width: '90%', maxWidth: '800px', paddingTop:"0 !important" }}>
      <h5 style={{ marginBottom: '80px', marginBottom:"70px"}}>Error Metrics</h5>
      <Bar style={{marginBottom:"55px"}} data={data} options={options} />
    </div>
  );
};

export default ErrorMetricsChart;
