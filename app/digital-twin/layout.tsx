import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '3D Digital Twin — HeatRetrofit AI',
  description:
    'Immersive Building Management System console. Explore thermal stress, retrofit layers, and 24-hour microclimate dynamics on the Nexus Horizon Villa 3D digital twin.',
};

/**
 * Digital Twin route segment layout.
 *
 * The DigitalTwinConsole fills the entire viewport below the
 * global navbar using height: calc(100svh - 72px). We suppress
 * the global footer here by overflowing the body and hiding
 * content below the console via CSS. The overflow-hidden on the
 * root and a wrapper approach achieves this cleanly.
 */
export default function DigitalTwinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // overflow-hidden at route-segment level prevents the footer
    // from being visible when the console fills the viewport
    <div className="overflow-hidden">
      {children}
    </div>
  );
}
