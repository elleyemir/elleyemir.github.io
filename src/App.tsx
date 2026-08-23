import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Timeline from './components/Timeline/Timeline';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AskAli from './components/AskAli/AskAli';

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink-950"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <div className="hairline" aria-hidden="true" />
        <About />
        <div className="hairline" aria-hidden="true" />
        <Timeline />
        <div className="hairline" aria-hidden="true" />
        <Contact />
      </main>
      <Footer />
      <AskAli />
    </>
  );
}
