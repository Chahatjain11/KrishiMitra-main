import React, { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../App';

export default function Login({ onLoginSuccess }) {
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [phone, setPhone] = useState(localStorage.getItem('km_phone') || '');
  const [detecting, setDetecting] = useState(false);
  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem('km_location');
    return saved ? JSON.parse(saved) : { district: 'Bangalore', state: 'Karnataka' };
  });

  const canContinue = useMemo(() => phone && phone.length >= 10, [phone]);

  const handleDetect = () => {
    setDetecting(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Mock reverse geocode to Jharkhand region
          const loc = { district: 'Bangalore', state: 'Karnataka' };
          localStorage.setItem('km_location', JSON.stringify(loc));
          setLocation(loc);
          setDetecting(false);
        },
        () => {
          setDetecting(false);
          alert(t('Location permission denied. Using Bangalore, Karnataka.', 'स्थान अनुमति अस्वीकार। बेंगलुरु, कर्नाटक उपयोग हो रहा है।'));
        }
      );
    } else {
      setDetecting(false);
      alert(t('Geolocation not supported. Using Bangalore, Karnataka.', 'भू-स्थान समर्थित नहीं। बेंगलुरु, कर्नाटक उपयोग हो रहा है।'));
    }
  };

  const handleContinue = () => {
    localStorage.setItem('km_phone', phone);
    onLoginSuccess?.();
    navigate('/dashboard', { replace: true });
  };

  return (
    <div>
      <div className="km-card">
        <div className="km-section-title">{t('Welcome to KrishiMitra', 'कृषि मित्र में आपका स्वागत है')}</div>
        <div className="km-form-row">
          <label className="km-label">{t('Phone Number', 'फोन नंबर')}</label>
          <input
            className="km-input"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
            placeholder={t('Enter 10-digit number', '10 अंकों का नंबर दर्ज करें')}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
          />
        </div>
        <div className="km-form-row">
          <label className="km-label">{t('Location', 'स्थान')}</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="km-input" value={`${location.district}, ${location.state}`} readOnly />
            <button className="km-btn" onClick={handleDetect} disabled={detecting} style={{ whiteSpace: 'nowrap', width: 160 }}>
              {detecting ? t('Detecting...', 'पता लगाया जा रहा...') : t('Detect Location', 'स्थान पता करें')}
            </button>
          </div>
        </div>
        <button className="km-btn" onClick={handleContinue} disabled={!canContinue}>{t('Continue', 'जारी रखें')}</button>
      </div>
    </div>
  );
}


