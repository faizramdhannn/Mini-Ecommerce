import Header from '@/components/layout/header/Header';
import { Footer } from '@/components/layout/footer/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { FlashSaleBanner } from '@/components/layout/header/FlashSaleBanner';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* ⭐ FLASH SALE BANNER - ONLY HERE, NOT IN HEADER! */}
      <FlashSaleBanner />
      
      {/* Header - WITHOUT FlashSaleBanner inside */}
      <Header />
      
      {/* Main Content */}
      <main className="bg-black min-h-screen">{children}</main>
      
      {/* Footer */}
      <Footer />
      
      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}