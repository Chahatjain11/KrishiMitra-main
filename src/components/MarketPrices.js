import React, { useContext, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend } from 'chart.js';
import { LanguageContext } from '../App';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const timeSeries = {
  paddy: { label: { en: 'Paddy', hi: 'धान' }, values: [1850, 1880, 1900, 1920, 1910, 1930] },
  maize: { label: { en: 'Maize', hi: 'मक्का' }, values: [1700, 1750, 1780, 1800, 1820, 1810] },
  mustard: { label: { en: 'Mustard', hi: 'सरसों' }, values: [5400, 5500, 5600, 5650, 5700, 5680] },
  lentil: { label: { en: 'Lentil', hi: 'मसूर' }, values: [6300, 6400, 6500, 6520, 6550, 6570] },
  pigeonpea: { label: { en: 'Pigeon Pea', hi: 'अरहर' }, values: [6800, 6900, 7000, 7050, 7100, 7080] },
};

export default function MarketPrices() {
  const { t, language } = useContext(LanguageContext);
  const [crop, setCrop] = useState('paddy');

  const data = useMemo(() => {
    const series = timeSeries[crop];
    return {
      labels: months,
      datasets: [
        {
          label: `${language === 'hi' ? series.label.hi : series.label.en} — ${t('Price (Rs/quintal)', 'कीमत (रु/क्विंटल)')}`,
          data: series.values,
          borderColor: '#a5d6a7',
          backgroundColor: 'rgba(165,214,167,0.2)',
          pointBackgroundColor: '#66bb6a',
          pointBorderColor: '#2e7d32',
          pointRadius: 4,
          tension: 0.3,
        },
      ],
    };
  }, [crop, language, t]);

  const options = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { display: true, labels: { color: '#e0e0e0' } },
      tooltip: { enabled: true },
    },
    scales: {
      x: { ticks: { color: '#bdbdbd' }, grid: { color: '#222' } },
      y: { beginAtZero: false, ticks: { color: '#bdbdbd' }, grid: { color: '#222' } },
    },
  }), []);

  return (
    <div>
      <div className="km-card">
        <div className="km-section-title">{t('Market Prices - Bangalore Market', 'बाज़ार मूल्य - बेंगलुरु मार्केट')}</div>
        <div className="km-form-row">
          <label className="km-label">{t('Select Crop', 'फसल चुनें')}</label>
          <select className="km-select" value={crop} onChange={(e) => setCrop(e.target.value)}>
            <option value="paddy">{language === 'hi' ? timeSeries.paddy.label.hi : timeSeries.paddy.label.en}</option>
            <option value="maize">{language === 'hi' ? timeSeries.maize.label.hi : timeSeries.maize.label.en}</option>
            <option value="mustard">{language === 'hi' ? timeSeries.mustard.label.hi : timeSeries.mustard.label.en}</option>
            <option value="lentil">{language === 'hi' ? timeSeries.lentil.label.hi : timeSeries.lentil.label.en}</option>
            <option value="pigeonpea">{language === 'hi' ? timeSeries.pigeonpea.label.hi : timeSeries.pigeonpea.label.en}</option>
          </select>
        </div>
        <Line data={data} options={options} height={240} />
      </div>
    </div>
  );
}


