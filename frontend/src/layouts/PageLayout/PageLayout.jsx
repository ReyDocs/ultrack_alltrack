import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

export default function PageLayout({ children }) {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}
