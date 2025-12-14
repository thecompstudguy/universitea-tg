import type { FC } from 'react';

import { bem } from '@/css/bem.ts';
import { publicUrl } from '@/helpers/publicUrl.ts';

import './BrandMark.css';

const [b] = bem('brand-mark');

export const BrandMark: FC<{ alt?: string; height?: number }> = ({
  alt = 'UniversiTEA',
  height = 28,
}) => (
  <img
    className={b()}
    src={publicUrl('universitea-logo.png')}
    alt={alt}
    height={height}
    style={{ height, width: 'auto' }}
    decoding="async"
    draggable={false}
  />
);
