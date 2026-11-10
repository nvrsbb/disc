import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import './style.css';
export const metadata: Metadata = { title: 'Office Personality Quiz', description: 'A noncommercial office personality quiz inspired by the YOUnique workbook.', appleWebApp: { capable: true, title: 'DISC Quiz', statusBarStyle: 'default' } };
export const viewport: Viewport = { themeColor: '#a54051', width: 'device-width', initialScale: 1 };
export default function Layout({ children }: { children: ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
