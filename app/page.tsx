import { Banner } from '@/components/banner';
import { Header } from '@/components/header';
import { Message50Years } from '@/components/messages-50years';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Home() {
  return (
    <ScrollArea viewportClassName="h-screen w-screen snap-y snap-mandatory">
      <div className="h-screen snap-start snap-always">
        <Header />
        <Banner />
      </div>
      <div className="snap-start snap-always bg-green-metalic">
        <div className="bg-white/10 backdrop-blur-xl">
          <Message50Years />
        </div>
      </div>
    </ScrollArea>
  );
}
