import { Suspense } from 'react';
import StationView from '@/app/_components/game/stations/station-view';
import StationLoading from './loading';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    stationId: string;
  }>;
}

export default async function StationPage({ params }: PageProps) {
  const resolvedParams = await params;
  
  if (!resolvedParams.stationId) {
    notFound();
  }

  return (
    <Suspense fallback={<StationLoading />}>
      <StationView stationId={resolvedParams.stationId} />
    </Suspense>
  );
}