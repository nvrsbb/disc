import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Office Personality Quiz',
    short_name: 'DISC Quiz',
    description: 'A noncommercial office personality quiz inspired by the YOUnique workbook.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f8f3ef',
    theme_color: '#a54051',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
