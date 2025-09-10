import MainLayout from '@/components/MainLayout';
import SiadilHeader from '@/components/SiadilHeader';

export default function Home() {
  return (
    <MainLayout>
      <div className="min-h-screen">
        <SiadilHeader />
      </div>
    </MainLayout>
  );
}
