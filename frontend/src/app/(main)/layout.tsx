import Header from '@/components/layout/header/Header';
import { Footer } from '@/components/layout/footer/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { FlashSaleBanner } from '@/components/layout/header/FlashSaleBanner'; // TAMBAHKAN

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FlashSaleBanner /> {/* TAMBAHKAN DI ATAS HEADER */}
      <Header />
      <main className="bg-black min-h-screen">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}