import { MapCanvas } from '@/components/MapCanvas';
import { ManagerChat } from '@/components/ManagerChat';
import { NarrativeEngine } from '@/components/NarrativeEngine';

export default function Home() {
  return (
    <main className="relative w-full h-screen bg-slate-950 overflow-hidden text-slate-50 font-sans flex flex-col md:flex-row">
      {/* 1/3 Side Panel for Chat */}
      <div className="w-full h-[40vh] md:h-full md:w-[380px] lg:w-[450px] shrink-0 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/80 backdrop-blur-3xl relative z-20 shadow-2xl flex flex-col">
        <ManagerChat />
      </div>
      
      {/* 2/3 Map Canvas */}
      <div className="flex-1 h-[60vh] md:h-full relative z-10 w-full overflow-hidden flex flex-col">
        <MapCanvas />
      </div>
      
      <NarrativeEngine />
    </main>
  );
}
