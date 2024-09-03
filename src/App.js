import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import './App.css';

function CandlestickChart({ data, name, symbol }) {
  const options = {
    chart: {
      type: 'candlestick',
      height: 350,
      background: '#000000',
      foreColor: '#ffffff',
    },
    title: {
      text: `${name} (${symbol.toUpperCase()}) Price Chart`,
      align: 'left',
      style: { color: '#ffffff' },
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      tooltip: { enabled: true },
    },
    tooltip: { theme: 'dark' },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#00B746',
          downward: '#EF403C',
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <ReactApexChart options={options} series={[{ data }]} type="candlestick" height={350} />
    </div>
  );
}

function App() {
  const [chartData, setChartData] = useState({
    bitcoin: [],
    ethereum: [],
    solana: [],
  });

  useEffect(() => {
    const fetchData = async (coin) => {
      try {
        const response = await axios.get(`/api/coins/${coin}/ohlc?vs_currency=usd&days=1`);
        return response.data.map(([timestamp, open, high, low, close]) => ({
          x: new Date(timestamp),
          y: [open, high, low, close],
        }));
      } catch (error) {
        console.error(`Error fetching data for ${coin}:`, error);
        return [];
      }
    };

    const updateChartData = async () => {
      const bitcoinData = await fetchData('bitcoin');
      const ethereumData = await fetchData('ethereum');
      const solanaData = await fetchData('solana');

      setChartData({
        bitcoin: bitcoinData,
        ethereum: ethereumData,
        solana: solanaData,
      });
    };

    updateChartData();
    const interval = setInterval(updateChartData, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <h1>Cryptocurrency Prices</h1>
      <CandlestickChart data={chartData.bitcoin} name="Bitcoin" symbol="btc" />
      <CandlestickChart data={chartData.ethereum} name="Ethereum" symbol="eth" />
      <CandlestickChart data={chartData.solana} name="Solana" symbol="sol" />
    </div>
  );
}

export default App;
