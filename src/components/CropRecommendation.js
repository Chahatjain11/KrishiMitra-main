import React, { useContext } from 'react';
import { LanguageContext } from '../App';

const crops = [
  { name: { en: 'Paddy (Swarna, IR64)', hi: 'धान (स्वर्णा, IR64)' }, season: 'Kharif', yield: '35–45 q/ha', note: { en: 'Suitable for Ranchi plateau', hi: 'रांची पठार के लिए उपयुक्त' } },
  { name: { en: 'Maize (HQPM-1)', hi: 'मक्का (HQPM-1)' }, season: 'Kharif/Rabi', yield: '30–40 q/ha', note: { en: 'Well-drained soils', hi: 'अच्छी जल-निकासी वाली मिट्टी' } },
  { name: { en: 'Pigeon Pea (Arhar)', hi: 'अरहर (तूर)' }, season: 'Kharif', yield: '10–15 q/ha', note: { en: 'Intercrop with millets', hi: 'मिलेट के साथ अंतरफसल' } },
  { name: { en: 'Mustard (Pusa Bold)', hi: 'सरसों (पुसा बोल्ड)' }, season: 'Rabi', yield: '12–18 q/ha', note: { en: 'Cold tolerant', hi: 'ठंड सहनशील' } },
  { name: { en: 'Lentil (PL-406)', hi: 'मसूर (PL-406)' }, season: 'Rabi', yield: '10–14 q/ha', note: { en: 'Light soils', hi: 'हल्की मिट्टी' } },
];

export default function CropRecommendation() {
  const { t } = useContext(LanguageContext);
  return (
    <div>
      <div className="km-card">
        <div className="km-section-title">{t('Recommended Crops for Jharkhand', 'झारखंड के लिए अनुशंसित फसलें')}</div>
        <ul className="km-list">
          {crops.map((c, idx) => (
            <li key={idx}>
              <div style={{ fontWeight: 700 }}>{t(c.name.en, c.name.hi)}</div>
              <div>{t('Season', 'ऋतु')}: {c.season} • {t('Expected Yield', 'अपेक्षित उपज')}: {c.yield}</div>
              <div style={{ color: '#2e7d32' }}>{t('Note', 'टिप्पणी')}: {t(c.note.en, c.note.hi)}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


