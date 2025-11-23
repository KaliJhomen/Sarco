import './globals.css';
import '@/services/api/interceptors'; 
import { QueryClientProvider } from '@/providers/QueryClientProvider';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import NavbarController from '@/components/layout/NavbarController';
import Footer from '@/components/Footer';
export const metadata = {
  title: "SARCO'S",
  description: 'Encuentra los mejores productos al mejor precio',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <QueryClientProvider>
          <AuthProvider>
            <AppProvider>
              <NavbarController />
              <main>{children}</main>
              <Footer />
            </AppProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}