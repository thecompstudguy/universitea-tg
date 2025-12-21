import type { FC } from 'react';
import { useInRouterContext } from 'react-router-dom';

import { bem } from '@/css/bem.ts';
import { publicUrl } from '@/helpers/publicUrl.ts';
import { Link } from '@/components/Link/Link.tsx';

import './BrandMark.css';

const [b, e] = bem('brand-mark');

export const BrandMark: FC<{ alt?: string; height?: number; to?: string }> = ({
  alt = 'UniversiTEA',
  height = 28,
  to = '/',
}) => (
  <BrandMarkLink to={to}>
    <img
      className={b()}
      src={publicUrl('universitea-logo.png')}
      alt={alt}
      height={height}
      style={{ height, width: 'auto' }}
      decoding="async"
      draggable={false}
    />
  </BrandMarkLink>
);

function BrandMarkLink({ children, to }: { children: React.ReactNode; to: string }) {
  const inRouter = useInRouterContext();
  const href = `#${to.startsWith('/') ? to : `/${to}`}`;

  if (inRouter) {
    return (
      <Link to={to} className={e('link')} aria-label="Back to feed">
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={e('link')} aria-label="Back to feed">
      {children}
    </a>
  );
}
