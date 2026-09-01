
'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

// 📍 Target Region Center (Swabi, Lahor, Jehangira, Tordher Region)
const REGION_CENTER = [34.0500, 72.3200];

// 🗺️ Active Target Locations (Coordinates for Quick Zoom)
const TARGET_LOCATIONS = {
  All: { name: 'All Regions', center: [34.0500, 72.3200], zoom: 11 },
  Lahor: { name: '', center: [34.0537, 72.3644], zoom: 13 },
  Jehangira: { name: '', center: [33.9610, 72.2227], zoom: 13 },
  Tordher: { name: '', center: [34.0167, 72.3167], zoom: 13 },
  Swabi: { name: '', center: [34.1200, 72.4667], zoom: 12 },
};

// 🎨 Category Config (Mahol AI Styled Icons & Vibrant Colors)
const CATEGORY_MAP = {
  Electricity: { icon: '⚡', color: '#eab308', bg: 'bg-amber-50 text-amber-800 border-amber-200' },
  Water: { icon: '💧', color: '#06b6d4', bg: 'bg-cyan-50 text-cyan-800 border-cyan-200' },
  Road: { icon: '🛣️', color: '#64748b', bg: 'bg-slate-100 text-slate-800 border-slate-200' },
  TMA: { icon: '🗑️', color: '#16a34a', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  Sanitation: { icon: '🧹', color: '#10b981', bg: 'bg-teal-50 text-teal-800 border-teal-200' },
  Default: { icon: '📍', color: '#2563eb', bg: 'bg-blue-50 text-blue-800 border-blue-200' },
};

// 🛡️ Boundary Check for IP Fallbacks
const isWithinTargetRegion = (lat, lng) => {
  const minLat = 33.80;
  const maxLat = 34.35;
  const minLng = 71.90;
  const maxLng = 72.70;
  return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
};

export default function MapPage() {
  const [points, setPoints] = useState([]);
  const [error, setError] = useState('');
  const [heat, setHeat] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [outOfBoundsCount, setOutOfBoundsCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  const getBackendUrl = () => {
    if (typeof window !== 'undefined') {
      return process.env.NEXT_PUBLIC_API_URL || `http://${window.location.hostname}:8000`;
    }
    return 'http://localhost:8000';
  };

  // 🛑 Filter out RESOLVED / SOLVED / CLOSED issues so only ACTIVE issues are counted & mapped
  const activePoints = points.filter((p) => {
    const isValidGeo = p.latitude && p.longitude && !isNaN(p.latitude) && !isNaN(p.longitude);
    const statusUpper = p.status?.toUpperCase() || '';
    const isResolved = statusUpper === 'RESOLVED' || statusUpper === 'SOLVED' || statusUpper === 'CLOSED';
    return isValidGeo && !isResolved;
  });

  // Fullscreen Handler
  const toggleFullScreen = () => {
    const container = document.getElementById('mahalai-map-wrapper');
    if (!document.fullscreenElement) {
      container?.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  // 1. Fetch Issues Data from Backend
  useEffect(() => {
    const backendUrl = getBackendUrl();
    fetch(`${backendUrl}/issues/geo`, { credentials: 'include' })
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load map points');
        return r.json();
      })
      .then((d) => {
        const dataPoints = Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : [];
        setPoints(dataPoints);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Could not load map data. Is the backend running?');
        setLoading(false);
      });
  }, []);

  // 2. Initialize Leaflet Map Instance
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!document.getElementById('leaflet-css')) {
      const css = document.createElement('link');
      css.id = 'leaflet-css';
      css.rel = 'stylesheet';
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(css);
    }

    const initMap = () => {
      const L = window.L;
      if (!L || mapInstanceRef.current) return;

      const container = document.getElementById('mahalai-map');
      if (!container) return;

      if (container._leaflet_id) {
        container._leaflet_id = null;
      }

      const map = L.map('mahalai-map', { zoomControl: false }).setView(REGION_CENTER, 11);

      L.control.zoom({ position: 'topright' }).addTo(map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      mapInstanceRef.current = map;
      layerGroupRef.current = L.featureGroup().addTo(map);
    };

    if (window.L) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => initMap();
      document.body.appendChild(script);
    }
  }, []);

  // 3. Render Custom Markers for ACTIVE Points Only
  useEffect(() => {
    const L = window.L;
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;

    if (!L || !map || !layerGroup) return;

    layerGroup.clearLayers();

    let outCount = 0;
    const coordCountMap = {};

    activePoints.forEach((p) => {
      let lat = parseFloat(p.latitude);
      let lng = parseFloat(p.longitude);

      // 📍 Duplicate coordinate jitter fix
      const coordKey = `${lat.toFixed(5)}_${lng.toFixed(5)}`;
      if (coordCountMap[coordKey]) {
        const count = coordCountMap[coordKey];
        lat += count * 0.00018;
        lng += count * 0.00018;
        coordCountMap[coordKey] += 1;
      } else {
        coordCountMap[coordKey] = 1;
      }

      const inTargetRegion = isWithinTargetRegion(lat, lng);
      if (!inTargetRegion) {
        outCount++;
      }

      const catConfig = CATEGORY_MAP[p.category] || CATEGORY_MAP.Default;
      const isHighPriority =
        p.priority_level === 'CRITICAL' ||
        p.priority_level === 'high' ||
        p.priority === 'high';

      let marker;

      if (heat) {
        const color = isHighPriority ? '#ef4444' : catConfig.color;
        marker = L.circleMarker([lat, lng], {
          radius: 18,
          color: color,
          fillColor: color,
          fillOpacity: 0.4,
          weight: 2,
        });
      } else {
        const pinHtml = `
          <div style="
            background: linear-gradient(135deg, ${catConfig.color}, #059669);
            width: 38px;
            height: 38px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            box-shadow: 0 8px 20px rgba(5, 150, 105, 0.3);
            border: 2.5px solid #ffffff;
            position: relative;
            transition: transform 0.2s ease;
          ">
            ${catConfig.icon}
            ${isHighPriority ? `<span style="position: absolute; top: -2px; right: -2px; width: 11px; height: 11px; background-color: #ef4444; border-radius: 50%; border: 2px solid white;"></span>` : ''}
          </div>
        `;

        const customIcon = L.divIcon({
          className: 'custom-cat-pin',
          html: pinHtml,
          iconSize: [38, 38],
          iconAnchor: [19, 19],
          popupAnchor: [0, -20],
        });

        marker = L.marker([lat, lng], { icon: customIcon });
      }

      const popupContent = `
        <div style="font-family: sans-serif; padding: 6px; min-width: 170px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
            <span style="background-color: ${catConfig.color}; color: white; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
              ${catConfig.icon} ${p.category || 'General'}
            </span>
            ${!inTargetRegion ? `<span style="background-color: #ef4444; color: white; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: 700;">IP Fallback</span>` : ''}
          </div>
          <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 4px; line-height: 1.2;">
            ${p.title || 'Civic Issue'}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 10px;">
            Status: <strong style="color: #059669; text-transform: uppercase;">${p.status || 'PENDING'}</strong>
          </div>
          <a href="/issues/${p._id || p.id}" style="display: block; text-align: center; background: #059669; color: white; font-size: 11px; font-weight: 700; padding: 6px 12px; border-radius: 8px; text-decoration: none; box-shadow: 0 2px 8px rgba(5, 150, 105, 0.3);">
            View Details →
          </a>
        </div>
      `;

      marker.bindPopup(popupContent);
      layerGroup.addLayer(marker);
    });

    setOutOfBoundsCount(outCount);

    // Auto Zoom based on active points
    if (selectedRegion === 'All') {
      const regionPoints = activePoints.filter((p) =>
        isWithinTargetRegion(parseFloat(p.latitude), parseFloat(p.longitude))
      );

      if (regionPoints.length > 0) {
        try {
          const targetGroup = L.featureGroup(
            regionPoints.map((p) => L.marker([p.latitude, p.longitude]))
          );
          map.fitBounds(targetGroup.getBounds(), { padding: [50, 50], maxZoom: 13 });
        } catch (err) {
          map.setView(REGION_CENTER, 11);
        }
      } else {
        map.setView(REGION_CENTER, 11);
      }
    } else {
      const target = TARGET_LOCATIONS[selectedRegion];
      if (target) {
        map.setView(target.center, target.zoom);
      }
    }
  }, [points, heat, selectedRegion]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#f0fdf4] via-[#f4fbf7] to-[#e6f4ed] text-slate-900 pb-12 pt-3 px-2 sm:px-6">
      <div className="w-full max-w-[1700px] mx-auto">
        
        {/* 🌿 Mahol AI Styled Header Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-emerald-100/80 rounded-3xl p-4 sm:p-6 shadow-xl shadow-emerald-950/5 mb-4 transition-all">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Title & Live Badge */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                </span>
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-800">
                  FixMyCity · Live GPS Coverage
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Civic Issue Intelligence Map
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                Monitoring Swabi, Chota Lahor, Jehangira & Tordher · <strong className="text-emerald-700 font-bold">{activePoints.length} Active Reports</strong>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setHeat((v) => !v)}
                className="px-4 py-2.5 rounded-2xl bg-white border border-emerald-200 text-slate-700 text-xs font-bold shadow-sm hover:bg-emerald-50 hover:border-emerald-300 transition cursor-pointer flex items-center gap-2"
              >
                <span>{heat ? '📍 Category Pins View' : '🔥 Heatmap Analysis'}</span>
              </button>

              <button
                onClick={toggleFullScreen}
                className="px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition cursor-pointer flex items-center gap-2"
              >
                <span>{isFullscreen ? '↙️ Exit Fullscreen' : '⛶ Fullscreen Map'}</span>
              </button>
            </div>
          </div>

          {/* Controls Bar: Focus Locations & Categories */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            
            {/* Quick Focus Pill Selector */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mr-2">
                Region Focus:
              </span>
              {Object.entries(TARGET_LOCATIONS).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setSelectedRegion(key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    selectedRegion === key
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105'
                      : 'bg-slate-100/80 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Category Badges */}
            <div className="flex flex-wrap items-center gap-1.5">
              {Object.entries(CATEGORY_MAP).map(([key, val]) => {
                if (key === 'Default') return null;
                return (
                  <span
                    key={key}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold border ${val.bg}`}
                  >
                    <span>{val.icon}</span>
                    <span>{key}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Warning Banner for IP Fallbacks */}
        {outOfBoundsCount > 0 && (
          <div className="p-3 bg-amber-500/10 border border-amber-300/60 text-amber-900 text-xs font-semibold rounded-2xl mb-3 flex items-center justify-between backdrop-blur-md">
            <span className="flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span><strong>{outOfBoundsCount}</strong> issue(s) submitted with browser IP fallback coordinates (Outside active Swabi/Jehangira bounds).</span>
            </span>
            <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-1 rounded-lg font-extrabold uppercase tracking-wider">
              Auto-Centered
            </span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold rounded-2xl mb-3">
            {error}
          </div>
        )}

        {/* 🗺️ Main Full-Screen Map Canvas Container */}
        <div 
          id="mahalai-map-wrapper"
          className="relative w-full rounded-[2.5rem] border-2 border-emerald-500/20 overflow-hidden shadow-2xl shadow-emerald-950/10 bg-slate-100 transition-all"
        >
          {loading && (
            <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-md flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-3xl shadow-2xl border border-emerald-100">
                <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                <span className="text-xs font-black text-slate-800 tracking-wide uppercase">
                  Loading Mahol AI Map Intelligence...
                </span>
              </div>
            </div>
          )}

          {/* Map canvas dynamically sized for desktop and mobile */}
          <div id="mahalai-map" className="w-full h-[75vh] md:h-[80vh] z-10" />
        </div>

        {/* Footer Link */}
        <div className="flex items-center justify-between mt-4 px-2 text-xs font-medium text-slate-500">
          <span>ℹ️ Showing live GPS reported incidents in Swabi district.</span>
          <Link href="/report" className="text-emerald-700 font-extrabold hover:text-emerald-800 transition underline underline-offset-4">
            + Report New Civic Problem
          </Link>
        </div>

      </div>
    </div>
  );
}