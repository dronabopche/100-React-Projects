import React, { useMemo } from 'react';
import styles from './MountainVistaParallax.module.css';

// Data Configuration
const layersData = [
  { className: 'layer-6', speed: '120s', size: '222px', zIndex: 1, image: '6' },
  { className: 'layer-5', speed: '95s',  size: '311px', zIndex: 1, image: '5' },
  { className: 'layer-4', speed: '75s',  size: '468px', zIndex: 1, image: '4' },
  { className: 'bike-1',  speed: '10s',  size: '75px',  zIndex: 2, image: 'bike', animation: 'parallax_bike', bottom: '100px', noRepeat: true },
  { className: 'bike-2',  speed: '15s',  size: '75px',  zIndex: 2, image: 'bike', animation: 'parallax_bike', bottom: '100px', noRepeat: true },
  { className: 'layer-3', speed: '55s',  size: '158px', zIndex: 3, image: '3' },
  { className: 'layer-2', speed: '30s',  size: '145px', zIndex: 4, image: '2' },
  { className: 'layer-1', speed: '20s',  size: '136px', zIndex: 5, image: '1' },
];

export const MountainVistaParallax = ({ theme, onClose, title = '', subtitle = '' }) => {
  // Generate dynamic CSS for each layer + global keyframes
  const dynamicStyles = useMemo(() => {
    const layersCSS = layersData
      .map(layer => {
        const url = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/24650/${layer.image}.png`;
        return `
          .${layer.className} {
            background-image: url(${url});
            animation-duration: ${layer.speed};
            background-size: auto ${layer.size};
            z-index: ${layer.zIndex};
            ${layer.animation ? `animation-name: ${layer.animation};` : ''}
            ${layer.bottom ? `bottom: ${layer.bottom};` : ''}
            ${layer.noRepeat ? 'background-repeat: no-repeat;' : ''}
          }
        `;
      })
      .join('\n');

    return `
      ${layersCSS}
      @keyframes parallax_scroll {
        from { background-position-x: 0; }
        to { background-position-x: -2048px; }
      }
      @keyframes parallax_bike {
        from { left: -100px; }
        to { left: 110%; }
      }
    `;
  }, []);

  const filterStyle = useMemo(() => {
    return theme === 'light'
      ? 'sepia(0.3) saturate(0.85) contrast(0.95) brightness(1.02)'
      : 'invert(0.9) hue-rotate(190deg) brightness(0.4) contrast(1.15)';
  }, [theme]);

  return (
    <div className={styles.fullScreenOverlay}>
      {/* Inject dynamic layer styles */}
      <style>{dynamicStyles}</style>

      {/* Parallax Container */}
      <section
        className="hero-container"
        style={{ filter: filterStyle }}
        aria-label="An animated parallax landscape of mountains and cyclists."
      >
        {/* Render each parallax layer */}
        {layersData.map(layer => (
          <div
            key={layer.className}
            className={`parallax-layer ${layer.className}`}
          />
        ))}

        {/* Hero text */}
        {(title || subtitle) && (
          <div className="hero-content">
            <h1 className="hero-title">{title}</h1>
            <p className="hero-subtitle">{subtitle}</p>
          </div>
        )}
      </section>

      {/* Back Button */}
      <button className={styles.backButton} onClick={onClose}>
        ✦ Close Vista
      </button>
    </div>
  );
};

export default React.memo(MountainVistaParallax);
