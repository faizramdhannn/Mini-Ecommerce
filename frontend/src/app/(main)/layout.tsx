import { Header } from '@/components/layout/header/Header';
import { Footer } from '@/components/layout/footer/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="bg-black min-h-screen">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}