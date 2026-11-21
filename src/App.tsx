/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AppProvider, useApp } from './context/AppContext';
import { PRODUCT_CATEGORIES } from './data/termicoreData';
import { findModelByRoute } from './utils/modelSpecifications';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { RfqDrawer } from './components/RfqDrawer';
import { InitialLoader } from './components/InitialLoader';
import { INDUSTRIAL_EASE } from './components/MotionPrimitives';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { ModelDetailPage } from './pages/ModelDetailPage';
import { AccessoriesPage } from './pages/AccessoriesPage';
import { QualityPage } from './pages/QualityPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage, QuotePage } from './pages/ContactQuotePages';

const STATIC_ROUTE_TITLES: Record<string, string> = {
  '/': 'TermiCore — Precision Terminal Block Connectors & Industrial Wiring Systems',
  '/products': 'Terminal Block Product Catalog | TermiCore',
  '/accessories': 'DIN Rail Accessories, Jumpers & End Plates | TermiCore',
  '/quality': 'Quality Testing, UL 1059 & IEC 60947-7-1 Compliance | TermiCore',
  '/about': 'About TermiCore | Industrial Connectivity Manufacturer',
  '/contact': 'Contact Engineering & Sales | TermiCore',
  '/quote': 'Request a Factory-Direct Quote | TermiCore',
};

function RouteView() {
  const { route } = useApp();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={route}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.14, ease: INDUSTRIAL_EASE }}
        onAnimationComplete={() => ScrollTrigger.refresh()}
      >
        {renderPageRoute(route)}
      </motion.div>
    </AnimatePresence>
  );
}

function renderPageRoute(route: string) {
  const matchingCategory = PRODUCT_CATEGORIES.find((c) => c.slug === route);
  if (matchingCategory) {
    return <CategoryDetailPage category={matchingCategory} />;
  }

  const matchedModel = findModelByRoute(route);
  if (matchedModel) {
    return (
      <ModelDetailPage
        sku={matchedModel.sku}
        category={matchedModel.category}
      />
    );
  }

  switch (route) {
    case '/products':
      return <ProductsPage />;
    case '/accessories':
      return <AccessoriesPage />;
    case '/quality':
      return <QualityPage />;
    case '/about':
      return <AboutPage />;
    case '/contact':
      return <ContactPage />;
    case '/quote':
      return <QuotePage />;
    case '/':
    default:
      return <HomePage />;
  }
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <MotionConfig reducedMotion="user">
      <AppProvider>
        <div className="min-h-screen flex flex-col bg-[#F5F7F9] text-[#101D2B] relative">
          {/* Intro animation: single logo starts centered, flies to header, then disappears */}
          {isLoading && <InitialLoader onComplete={() => setIsLoading(false)} />}

          {/* Page content */}
          <motion.div
            className="flex flex-col flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoading ? 0 : 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Header />
            <main className="flex-1">
              <RouteView />
            </main>
            <Footer />
            <RfqDrawer />
          </motion.div>
        </div>
      </AppProvider>
    </MotionConfig>
  );
}
