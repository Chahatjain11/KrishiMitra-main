import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../App';

export default function Dashboard() {
  const { t } = useContext(LanguageContext);

  const location = useMemo(() => {
    const saved = localStorage.getItem('km_location');
    return saved ? JSON.parse(saved) : { district: 'Bangalore', state: 'Karnataka' };
  }, []);

  const weather = useMemo(() => ({
    temp: 29,
    condition: t('Partly Cloudy', 'आंशिक बादल'),
    rainfall: t('2 mm', '2 मिमी'),
    humidity: '68%',
  }), [t]);

  return (
    <div>
      <div className="km-card km-weather">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="km-section-title">{t('Today in', 'आज यहाँ')} {location.district}, {location.state}</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{weather.temp}°C</div>
            <div>{weather.condition} • {t('Rain', 'वर्षा')}: {weather.rainfall} • {t('Humidity', 'नमी')}: {weather.humidity}</div>
          </div>
          <div style={{ fontSize: 40 }}>☁️</div>
        </div>
      </div>

      <div className="km-grid">
        <Link to="/crops" className="km-btn">
          🌱 {t('Crop Advice', 'फसल सलाह')}
        </Link>
        <Link to="/disease" className="km-btn orange">
          🧪 {t('Disease', 'रोग')}
        </Link>
        <Link to="/fertilizer" className="km-btn brown">
          🧮 {t('Fertilizer', 'उर्वरक')}
        </Link>
        <Link to="/market" className="km-btn blue">
          💹 {t('Market Prices', 'बाज़ार मूल्य')}
        </Link>
      </div>

      <div className="km-card">
        <div className="km-section-title">{t('Tips for Jharkhand farmers', 'झारखंड किसानों के लिए सुझाव')}</div>
        <ul className="km-list">
          <li>• {t('Use mulching to retain soil moisture during dry spells.', 'सूखे समय में मिट्टी की नमी बनाए रखने हेतु मल्चिंग करें।')}</li>
          <li>• {t('Adopt line sowing for better yield in paddy and pulses.', 'धान और दालों में बेहतर उपज हेतु लाइन बुवाई अपनाएँ।')}</li>
          <li>• {t('Use community irrigation scheduling to optimize water use.', 'समुदाय आधारित सिंचाई शेड्यूलिंग से पानी का बेहतर उपयोग करें।')}</li>
        </ul>
      </div>
    </div>
  );
}


