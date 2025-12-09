import React, { useContext, useMemo, useState } from 'react';
import { LanguageContext } from '../App';

const recommendations = {
  paddy: { N: 100, P: 60, K: 40 },
  maize: { N: 120, P: 60, K: 40 },
  mustard: { N: 80, P: 40, K: 40 },
  lentil: { N: 20, P: 40, K: 20 },
  pigeonpea: { N: 25, P: 50, K: 25 },
};

const productNPK = {
  urea: { N: 46, P: 0, K: 0 },
  dap: { N: 18, P: 46, K: 0 },
  mop: { N: 0, P: 0, K: 60 },
};

export default function FertilizerCalculator() {
  const { t } = useContext(LanguageContext);
  const [crop, setCrop] = useState('paddy');
  const [area, setArea] = useState(1); // in acres

  const need = useMemo(() => {
    const rec = recommendations[crop];
    const hectare = area * 0.404686; // acre to hectare
    return {
      N: Math.round(rec.N * hectare),
      P: Math.round(rec.P * hectare),
      K: Math.round(rec.K * hectare),
    };
  }, [crop, area]);

  const products = useMemo(() => {
    // Simple proportional split
    const ureaKg = Math.round((need.N / productNPK.urea.N) * 100) / 100;
    const dapKg = Math.round((need.P / productNPK.dap.P) * 100) / 100;
    const mopKg = Math.round((need.K / productNPK.mop.K) * 100) / 100;
    return { ureaKg, dapKg, mopKg };
  }, [need]);

  return (
    <div>
      <div className="km-card">
        <div className="km-section-title">{t('Fertilizer Calculator (per season)', 'उर्वरक कैलकुलेटर (प्रति मौसम)')}</div>
        <div className="km-form-row">
          <label className="km-label">{t('Crop', 'फसल')}</label>
          <select className="km-select" value={crop} onChange={(e) => setCrop(e.target.value)}>
            <option value="paddy">{t('Paddy', 'धान')}</option>
            <option value="maize">{t('Maize', 'मक्का')}</option>
            <option value="mustard">{t('Mustard', 'सरसों')}</option>
            <option value="lentil">{t('Lentil', 'मसूर')}</option>
            <option value="pigeonpea">{t('Pigeon Pea', 'अरहर')}</option>
          </select>
        </div>
        <div className="km-form-row">
          <label className="km-label">{t('Area (acres)', 'क्षेत्र (एकड़)')}</label>
          <input className="km-input" type="number" min={0.1} step={0.1} value={area} onChange={(e) => setArea(parseFloat(e.target.value || '0'))} />
        </div>
        <div className="km-card" style={{ background: '#f9fff9' }}>
          <div><b>NPK {t('Nutrient Need', 'पोषक तत्व आवश्यकता')}</b> (kg): N {need.N}, P {need.P}, K {need.K}</div>
          <div style={{ marginTop: 8 }}>
            <b>{t('Product Guidance', 'उत्पाद मार्गदर्शन')}</b> (kg): {t('Urea', 'यूरिया')} {products.ureaKg}, {t('DAP', 'डीएपी')} {products.dapKg}, {t('MOP', 'एमओपी')} {products.mopKg}
          </div>
          <div style={{ marginTop: 8, color: '#2e7d32' }}>
            {t('Split N into 3 doses at basal, tillering, panicle initiation for paddy.', 'धान में नाइट्रोजन को 3 खुराकों में दें: बुवाई, टिलरिंग, पैनिकल बनने पर।')}
          </div>
        </div>
      </div>
    </div>
  );
}


