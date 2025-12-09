import React, { useContext, useState } from 'react';
import { LanguageContext } from '../App';

const mockResults = [
  { crop: 'Paddy', disease: { en: 'Blast', hi: 'ब्लास्ट' }, action: { en: 'Use tricyclazole 0.6g/l', hi: 'ट्राइसायक्लाजोल 0.6g/l प्रयोग करें' } },
  { crop: 'Maize', disease: { en: 'Leaf Blight', hi: 'लीफ ब्लाइट' }, action: { en: 'Spray mancozeb 2.5g/l', hi: 'मैंकोजेब 2.5g/l छिड़कें' } },
  { crop: 'Mustard', disease: { en: 'Alternaria Blight', hi: 'अल्टरनेरिया ब्लाइट' }, action: { en: 'Propiconazole 1ml/l', hi: 'प्रोपिकोनाजोल 1ml/l' } },
];

export default function DiseaseDetection() {
  const { t } = useContext(LanguageContext);
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImage(url);
    setLoading(true);
    setTimeout(() => {
      const res = mockResults[Math.floor(Math.random() * mockResults.length)];
      setResult(res);
      setLoading(false);
    }, 1200);
  };

  return (
    <div>
      <div className="km-card">
        <div className="km-section-title">{t('Detect Crop Disease', 'फसल रोग पहचानें')}</div>
        <input className="km-input" type="file" accept="image/*" capture="environment" onChange={onFile} />
        {image && (
          <div style={{ marginTop: 10 }}>
            <img src={image} alt="leaf" style={{ width: '100%', borderRadius: 10 }} />
          </div>
        )}
        {loading && <div style={{ marginTop: 10 }}>{t('Analyzing image...', 'चित्र का विश्लेषण हो रहा है...')}</div>}
        {result && !loading && (
          <div className="km-card" style={{ marginTop: 10 }}>
            <div><b>{t('Crop', 'फसल')}:</b> {result.crop}</div>
            <div><b>{t('Disease', 'रोग')}:</b> {t(result.disease.en, result.disease.hi)}</div>
            <div><b>{t('Recommendation', 'सिफारिश')}:</b> {t(result.action.en, result.action.hi)}</div>
          </div>
        )}
      </div>
    </div>
  );
}


