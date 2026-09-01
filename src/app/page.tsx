import SiteHeader from "@/components/SiteHeader";
import EscenaDia from "@/components/EscenaDia";
import Marquee from "@/components/Marquee";
import ItcaDigital from "@/components/ItcaDigital";
import EnlacesGenerales from "@/components/EnlacesGenerales";
import Comunicados from "@/components/Comunicados";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">
        <EscenaDia />
        <Marquee />
        <ItcaDigital />
        <EnlacesGenerales />
        <Comunicados />
      </main>
      <Footer />
    </div>
  );
}
