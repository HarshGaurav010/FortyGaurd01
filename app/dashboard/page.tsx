import { permanentRedirect } from 'next/navigation';

/**
 * The legacy /dashboard route is retired in favor of the canonical
 * scenario-driven /analysis route.
 */
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  permanentRedirect('/analysis');
}
