'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const CENTER = [34.0151, 71.9747];

export default function MapPage() {
  const [points, setPoints] = useState([]);
  const [error, setError] = useState('');
  const [heat, setHeat] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/issues/geo', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setPoints(d.data || []))
      .catch(() => setError('Could not load map data. Is the backend running?'));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const leafletCss = document.createElement('link');
    leafletCss.rel = 'stylesheet';
    leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(leafletCss);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      const L = window.L;
      const existing = document.getElementById('mahalai-map');
      if (!existing || existing._leaflet_id) return;
      const map = L.map('mahalai-map').setView(CENTER, 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);
      points.forEach((p) => {
        const color = p.priority_level === 'CRITICAL' || p.priority_level === 'high' ? '#dc2626' : '#2563eb';
        L.circleMarker([p.latitude, p.longitude], {
          radius: heat ? 18 : 8,
          color,
          fillColor: color,
          fillOpacity: heat ? 0.25 : 0.85,
        })
          .bindPopup(`<strong>${p.title}</strong><br/>${p.category} · ${p.status}<br/><a href="/issues/${p._id}">Open</a>`)
          .addTo(map);
      });
    };
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, [points, heat]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-black">Civic Issue Map</h1>
            <p className="text-sm text-slate-500">Live markers from reported GPS coordinates. {points.length} mapped issues.</p>
          </div>
          <button
            onClick={() => setHeat((v) => !v)}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold"
          >
            {heat ? 'Show markers' : 'Heat-style view'}
          </button>
        </div>
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <div id="mahalai-map" className="w-full h-[70vh] rounded-2xl border border-slate-200 overflow-hidden bg-slate-200" />
        <p className="text-xs text-slate-400 mt-3">
          Issues without GPS are omitted. Report with location to appear here.{' '}
          <Link href="/report" className="text-blue-600">Report an issue</Link>
        </p>
      </div>
    </div>
  );
}
