import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Booking from './components/Booking';
import Socials from './components/Socials';
import MailingList from './components/MailingList';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <About />
        <Portfolio />
        <Booking />
        <Socials />
        <MailingList />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
