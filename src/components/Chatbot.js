import React, { useContext, useRef, useState } from 'react';
import { LanguageContext } from '../App';
import { GoogleGenerativeAI } from '@google/generative-ai';

const faq = [
  { q: { en: 'Best paddy variety?', hi: 'सबसे अच्छी धान किस्म?' }, a: { en: 'Swarna, IR64 perform well in Jharkhand.', hi: 'झारखंड में स्वर्णा, IR64 अच्छा प्रदर्शन करती हैं।' } },
  { q: { en: 'When to sow mustard?', hi: 'सरसों की बुवाई कब करें?' }, a: { en: 'Mid-Oct to Nov in Rabi season.', hi: 'रबी मौसम में अक्टूबर मध्य से नवंबर।' } },
  { q: { en: 'How to control blast?', hi: 'ब्लास्ट रोग नियंत्रण कैसे करें?' }, a: { en: 'Use tricyclazole 0.6g/l spray.', hi: 'ट्राइसायक्लाजोल 0.6g/l का छिड़काव करें।' } },
];

export default function Chatbot() {
  const { t, language } = useContext(LanguageContext);
  const [messages, setMessages] = useState([
    { from: 'bot', text: t('Namaste! Ask your farming question.', 'नमस्ते! अपना कृषि प्रश्न पूछें।') },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const reply = (text) => {
    const lower = text.toLowerCase();
    const normalized = lower
      .replace(/[?।,.!]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Simple intent keywords (English + Hindi) for robust matching
    const intents = [
      // Weather (Bangalore/Bengaluru)
      {
        keys: ['weather', 'mausam', 'bengaluru', 'bengaluru', 'bangalore', 'bengaluru weather', 'bangalore weather'],
        answer: language === 'hi'
          ? 'बेंगलुरु में आज: 29°C, आंशिक बादल, वर्षा ~2 मिमी, नमी 68%.'
          : 'Bangalore today: 29°C, partly cloudy, rain ~2mm, humidity 68%.',
      },
      {
        keys: ['paddy', 'rice', 'धान', 'dhan', 'variety', 'किस्म'],
        answer: language === 'hi' ? 'झारखंड/कर्नाटक के लिए स्वर्णा, IR64 किस्में लोकप्रिय हैं।' : 'Swarna and IR64 are popular varieties for Jharkhand/Karnataka.',
      },
      {
        keys: ['maize', 'corn', 'मक्का', 'maka'],
        answer: language === 'hi' ? 'मक्का के लिए HQPM-1 जैसे उच्च-गुणवत्ता प्रोटीन हाइब्रिड अच्छे रहते हैं।' : 'For maize, HQPM-1 and similar HQP hybrids perform well.',
      },
      {
        keys: ['wheat', 'गेहूं', 'gehun'],
        answer: language === 'hi' ? 'गेहूं के लिए HD 2967/ PBW 550 जैसी किस्में लोकप्रिय हैं (सिंचित क्षेत्रों में)।' : 'For wheat, HD 2967 / PBW 550 are popular (in irrigated areas).',
      },
      {
        keys: ['mustard', 'सरसों', 'sowing', 'बुवाई', 'when'],
        answer: language === 'hi' ? 'सरसों की बुवाई रबी में अक्टूबर मध्य से नवंबर तक करें।' : 'Sow mustard in mid-Oct to November (Rabi season).',
      },
      {
        keys: ['blast', 'ब्लास्ट', 'disease', 'रोग', 'tricyclazole'],
        answer: language === 'hi' ? 'ब्लास्ट नियंत्रण हेतु ट्राइसायक्लाजोल 0.6g/l का छिड़काव करें।' : 'For blast, spray tricyclazole 0.6g/l.',
      },
      {
        keys: ['fertilizer', 'npk', 'उर्वरक', 'नाइट्रोजन', 'फॉस्फोरस', 'पोटाश'],
        answer: language === 'hi' ? 'NPK सलाह के लिए उर्वरक कैलकुलेटर स्क्रीन देखें।' : 'For NPK guidance, use the Fertilizer Calculator screen.',
      },
      {
        keys: ['price', 'market', 'mandi', 'कीमत', 'भाव', 'मंडी'],
        answer: language === 'hi' ? 'वर्तमान उदाहरण कीमतों हेतु मार्केट प्राइस स्क्रीन देखें।' : 'Check Market Prices screen for sample prices.',
      },
      {
        keys: ['which crops', 'crops perform', 'jharkhand crops', 'झारखंड', 'कौन सी फसल', 'फसलें'],
        answer: language === 'hi'
          ? 'झारखंड में प्रमुख फसलें: धान, मक्का, अरहर, सरसों, मसूर।'
          : 'In Jharkhand: paddy, maize, pigeon pea, mustard, lentil perform well.',
      },
    ];

    const hit = intents.find((intent) => intent.keys.some((k) => normalized.includes(k)));
    if (hit) return hit.answer;

    // Fallback to defined faq list if user message closely resembles any
    const faqHit = faq.find((f) => normalized.includes(f.q.en.toLowerCase().split(' ')[0]) || normalized.includes(f.q.hi.toLowerCase().split(' ')[0]));
    if (faqHit) return language === 'hi' ? faqHit.a.hi : faqHit.a.en;

    return language === 'hi' ? 'क्षमा करें, मैं समझ नहीं पाया। कृपया फिर से पूछें या मेन्यू देखें।' : 'Sorry, I did not understand. Please try again or use the menu.';
  };

  const onSend = () => {
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput('');

    const apiKey = localStorage.getItem('km_gemini_key');
    if (apiKey) {
      setLoading(true);
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = language === 'hi'
          ? `आप एक कृषि सहायक हैं। सरल हिंदी में संक्षिप्त उत्तर दें। प्रश्न: ${userMsg.text}`
          : `You are an agriculture assistant for Indian farmers. Answer briefly and clearly. Question: ${userMsg.text}`;
        model.generateContent(prompt).then((res) => {
          const text = res.response?.text?.() || res.response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          setMessages((m) => [...m, { from: 'bot', text: text || reply(userMsg.text) }]);
        }).catch(() => {
          setMessages((m) => [...m, { from: 'bot', text: reply(userMsg.text) }]);
        }).finally(() => {
          setLoading(false);
          setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
        });
      } catch (e) {
        setLoading(false);
        setMessages((m) => [...m, { from: 'bot', text: reply(userMsg.text) }]);
        setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      }
    } else {
      const botMsg = { from: 'bot', text: reply(userMsg.text) };
      setMessages((m) => [...m, botMsg]);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  };

  return (
    <div className="km-card">
      <div className="km-section-title">{t('KrishiMitra Chat', 'कृषि मित्र चैट')}</div>
      <div className="km-chat">
        <div className="km-chat-window">
          {messages.map((m, idx) => (
            <div key={idx} className={`km-msg ${m.from === 'user' ? 'user' : 'bot'}`}>{m.text}</div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="km-actions-row">
          <input
            className="km-input"
            placeholder={t('Type message...', 'संदेश लिखें...')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSend()}
          />
          <button className="km-btn" style={{ width: 120 }} onClick={onSend} disabled={loading}>{loading ? t('Thinking...', 'सोच रहा...') : t('Send', 'भेजें')}</button>
        </div>
      </div>
    </div>
  );
}


