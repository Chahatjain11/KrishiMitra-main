import React, { useContext, useState } from 'react';
import { LanguageContext } from '../App';

export default function Profile() {
  const { t, language, setLanguage } = useContext(LanguageContext);
  const [name, setName] = useState(localStorage.getItem('km_name') || '');
  const [phone] = useState(localStorage.getItem('km_phone') || '');
  const [district, setDistrict] = useState(() => {
    const saved = localStorage.getItem('km_location');
    return saved ? JSON.parse(saved).district : 'Bangalore';
  });
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('km_gemini_key') || '');

  const onSave = () => {
    localStorage.setItem('km_name', name);
    const loc = { district, state: 'Karnataka' };
    localStorage.setItem('km_location', JSON.stringify(loc));
    if (geminiKey) {
      localStorage.setItem('km_gemini_key', geminiKey.trim());
    } else {
      localStorage.removeItem('km_gemini_key');
    }
    alert(t('Profile saved', 'प्रोफ़ाइल सहेजी गई'));
  };

  const onLogout = () => {
    localStorage.removeItem('km_phone');
    alert(t('Logged out. Restart app to login.', 'लॉगआउट हुआ। लॉगिन हेतु ऐप पुनः खोलें।'));
  };

  return (
    <div className="km-card">
      <div className="km-section-title">{t('Profile & Settings', 'प्रोफ़ाइल और सेटिंग्स')}</div>
      <div className="km-form-row">
        <label className="km-label">{t('Name', 'नाम')}</label>
        <input className="km-input" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="km-form-row">
        <label className="km-label">{t('Phone', 'फोन')}</label>
        <input className="km-input" value={phone} readOnly />
      </div>
      <div className="km-form-row">
        <label className="km-label">{t('District', 'ज़िला')}</label>
        <input className="km-input" value={district} onChange={(e) => setDistrict(e.target.value)} />
      </div>
      <div className="km-form-row">
        <label className="km-label">{t('Language', 'भाषा')}</label>
        <select className="km-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
        </select>
      </div>
      <div className="km-form-row">
        <label className="km-label">{t('Gemini API Key (optional)', 'जेमिनी एपीआई की (वैकल्पिक)')}</label>
        <input className="km-input" type="password" value={geminiKey} onChange={(e) => setGeminiKey(e.target.value)} placeholder={t('Paste your key to enable smart answers', 'स्मार्ट उत्तर हेतु अपनी कुंजी चिपकाएँ')} />
      </div>
      <div className="km-actions-row">
        <button className="km-btn" onClick={onSave}>{t('Save', 'सहेजें')}</button>
        <button className="km-btn brown" onClick={onLogout}>{t('Logout', 'लॉगआउट')}</button>
      </div>
    </div>
  );
}


