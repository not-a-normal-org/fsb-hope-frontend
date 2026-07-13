'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

export default function PageTransition({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  // The motion wrapper can leave a new route at the previous page's scroll
  // position (App Router's default scroll-to-top doesn't fire through it).
  // Force the window back to the top on every navigation. 'instant' avoids the
  // html `scroll-smooth` animating the jump.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
