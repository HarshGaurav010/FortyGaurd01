import React from 'react';
import { DigitalTwinConsole } from '@/components/digital-twin/digital-twin-console';

export const metadata = {
  title: '3D Digital Twin — HeatRetrofit AI',
  description:
    'Immersive Building Management System console. Explore the 3D digital twin of Desert Commerce Center powered by FortyGuard hyperlocal heat telemetry.',
};

export default function DigitalTwinPage() {
  return <DigitalTwinConsole />;
}
