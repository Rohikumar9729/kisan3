import React, { useState } from 'react';
import { dummyvideo } from '../assets/assets';
import BlurCircle from './Blurcircle';
import { PlayCircle, Video, Sparkles, CheckCircle2 } from 'lucide-react';

const videoTitles = [
  { title: 'Best Rice Plantation & Nursery Methods', duration: '12 mins', host: 'Krishi Vigyan Kendra' },
  { title: 'High-Yield Wheat Sowing Techniques', duration: '15 mins', host: 'Punjab Ag University' },
  { title: 'Potato True Seed (TPS) Cultivation', duration: '9 mins', host: 'Central Potato Institute' },
  { title: 'Green Chilli Germination & Pest Defense', duration: '14 mins', host: 'Horticulture Bureau' },
];

const getEmbedUrl = (url) => {
  if (!url) return '';
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1].split('?')[0];
    return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
  }
  if (url.includes('watch?v=')) {
    const id = url.split('watch?v=')[1].split('&')[0];
    return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
  }
  return url;
};

const Recommended = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentTechnique = dummyvideo[currentIndex] || dummyvideo[0];
  const meta = videoTitles[currentIndex] || videoTitles[0];

  return (
    <section className="relative py-20 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto overflow-hidden">
      <BlurCircle top="-10%" right="-5%" color="gold" />
      <BlurCircle bottom="-10%" left="-5%" color="emerald" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CEC382]/15 border border-[#CEC382]/30 text-[#CEC382] text-xs font-semibold uppercase tracking-wider mb-2.5">
            <Video className="w-3.5 h-3.5" />
            <span>Farming Masterclasses</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Scientific Crop Techniques &amp; Farmer Guides
          </h2>
          <p className="text-gray-400 text-sm mt-1.5 max-w-xl">
            Watch verified agronomy tutorials on seed treatment, soil preparation, and disease prevention.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Curated by Agricultural Specialists</span>
        </div>
      </div>

      {/* Responsive Video Player Container */}
      <div className="relative rounded-3xl overflow-hidden bg-black/60 border border-white/10 shadow-2xl">
        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={getEmbedUrl(currentTechnique.videoUrl)}
            title={meta.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Video Information Bar */}
        <div className="p-4 sm:p-6 bg-[#0f1713] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#CEC382]/20 text-[#CEC382] uppercase">
                Now Playing
              </span>
              <span className="text-xs text-gray-400">{meta.duration}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {meta.title}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Presented by: {meta.host}</p>
          </div>

          <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
            Free Knowledge Resource
          </div>
        </div>
      </div>

      {/* Video Playlist Selector Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {dummyvideo.map((rec, idx) => {
          const isSelected = idx === currentIndex;
          const info = videoTitles[idx] || { title: `Guide #${idx + 1}`, duration: '10 mins' };

          return (
            <div
              key={rec.image + idx}
              onClick={() => setCurrentIndex(idx)}
              className={`group relative rounded-2xl p-2.5 bg-[#111814]/80 border transition-all duration-300 cursor-pointer overflow-hidden ${
                isSelected
                  ? 'border-[#CEC382] bg-[#16221c] shadow-lg shadow-[#CEC382]/15 scale-[1.02]'
                  : 'border-white/8 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black/40 mb-2">
                <img
                  src={rec.image}
                  alt={info.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <PlayCircle
                    className={`w-8 h-8 transition-transform group-hover:scale-110 ${
                      isSelected ? 'text-[#CEC382] fill-black/60' : 'text-white/80'
                    }`}
                  />
                </div>
                <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[10px] text-white font-mono">
                  {info.duration}
                </span>
              </div>

              <h4 className="text-xs font-semibold text-white line-clamp-2 group-hover:text-[#CEC382] transition-colors">
                {info.title}
              </h4>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Recommended;
