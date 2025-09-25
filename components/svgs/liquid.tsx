export interface LiquidBackgroundProps {
  variant?: 'deepBlue' | 'golden' | 'lightGolden' | 'skyBlue';
  width?: number;
  height?: number;
}

const colorSchemes = {
  deepBlue: {
    primary: '#3b82f6',
    secondary: '#1e40af',
    tertiary: '#3b82f6',
    wave1: {
      start: '#3b82f640',
      middle: '#1e40af80',
      end: '#3b82f660',
    },
    wave2: {
      start: '#1e40af30',
      middle: '#3b82f650',
      end: '#1e40af40',
    },
  },
  golden: {
    primary: '#f59e0b',
    secondary: '#d97706',
    tertiary: '#f59e0b',
    wave1: {
      start: '#f59e0b40',
      middle: '#d9770680',
      end: '#f59e0b60',
    },
    wave2: {
      start: '#d9770630',
      middle: '#f59e0b50',
      end: '#d9770640',
    },
  },
  lightGolden: {
    primary: '#fbbf24',
    secondary: '#f59e0b',
    tertiary: '#fde047',
    wave1: {
      start: '#fbbf2440',
      middle: '#f59e0b80',
      end: '#fde04760',
    },
    wave2: {
      start: '#f59e0b30',
      middle: '#fbbf2450',
      end: '#f59e0b40',
    },
  },
  skyBlue: {
    primary: '#0ea5e9',
    secondary: '#0284c7',
    tertiary: '#0ea5e9',
    wave1: {
      start: '#0ea5e940',
      middle: '#0284c780',
      end: '#0ea5e960',
    },
    wave2: {
      start: '#0284c730',
      middle: '#0ea5e950',
      end: '#0284c740',
    },
  },
};

export const LiquidBackground = ({ variant = 'deepBlue', width = 400, height = 200 }: LiquidBackgroundProps) => {
  const colors = colorSchemes[variant];
  const gradientId = `liquidGradient-${variant}`;
  const waveGradient1Id = `waveGradient1-${variant}`;
  const waveGradient2Id = `waveGradient2-${variant}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} />
          <stop offset="50%" stopColor={colors.secondary} />
          <stop offset="100%" stopColor={colors.tertiary} />
        </linearGradient>
        <linearGradient id={waveGradient1Id} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.wave1.start} />
          <stop offset="50%" stopColor={colors.wave1.middle} />
          <stop offset="100%" stopColor={colors.wave1.end} />
        </linearGradient>
        <linearGradient id={waveGradient2Id} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.wave2.start} />
          <stop offset="50%" stopColor={colors.wave2.middle} />
          <stop offset="100%" stopColor={colors.wave2.end} />
        </linearGradient>
      </defs>
      {/* Background liquid */}
      <rect width="100%" height="100%" fill={`url(#${gradientId})`} />
      {/* Animated wave layer 1 */}
      <path fill={`url(#${waveGradient1Id})`} opacity="0.6">
        <animate
          attributeName="d"
          dur="3s"
          repeatCount="indefinite"
          values={`M0,${height / 2} Q${width / 4},${height * 0.4} ${width / 2},${height / 2} T${width},${height / 2} L${width},${height} L0,${height} Z;
                M0,${height / 2} Q${width / 4},${height * 0.6} ${width / 2},${height / 2} T${width},${height / 2} L${width},${height} L0,${height} Z;
                M0,${height / 2} Q${width / 4},${height * 0.4} ${width / 2},${height / 2} T${width},${height / 2} L${width},${height} L0,${height} Z`}
        />
      </path>
      {/* Animated wave layer 2 */}
      <path fill={`url(#${waveGradient2Id})`} opacity="0.4">
        <animate
          attributeName="d"
          dur="2s"
          repeatCount="indefinite"
          values={`M0,${height * 0.6} Q${width * 0.375},${height / 2} ${width * 0.75},${height * 0.6} T${width * 1.5},${height * 0.6} L${width * 1.5},${height} L0,${height} Z;
                M0,${height * 0.6} Q${width * 0.375},${height * 0.7} ${width * 0.75},${height * 0.6} T${width * 1.5},${height * 0.6} L${width * 1.5},${height} L0,${height} Z;
                M0,${height * 0.6} Q${width * 0.375},${height / 2} ${width * 0.75},${height * 0.6} T${width * 1.5},${height * 0.6} L${width * 1.5},${height} L0,${height} Z`}
        />
      </path>
      {/* Surface waves */}
      <path fill={`url(#${waveGradient1Id})`} opacity="0.3">
        <animate
          attributeName="d"
          dur="1s"
          repeatCount="indefinite"
          values={`M0,${height * 0.45} Q${width / 2},${height * 0.35} ${width},${height * 0.45} L${width},${height * 0.55} Q${width / 2},${height * 0.65} 0,${height * 0.55} Z;
                M0,${height * 0.45} Q${width / 2},${height * 0.55} ${width},${height * 0.45} L${width},${height * 0.55} Q${width / 2},${height * 0.45} 0,${height * 0.55} Z;
                M0,${height * 0.45} Q${width / 2},${height * 0.35} ${width},${height * 0.45} L${width},${height * 0.55} Q${width / 2},${height * 0.65} 0,${height * 0.55} Z`}
        />
      </path>
      {/* Floating bubbles */}
      <circle r="3" fill="#ffffff40">
        <animateMotion
          dur="3s"
          repeatCount="indefinite"
          path={`M${width * 0.125},${height * 0.75} Q${width / 2},${height * 0.25} ${width * 0.875},${height * 0.75} Q${width / 2},${height / 2} ${width * 0.125},${height * 0.75}`}
        />
      </circle>
      <circle r="2" fill="#ffffff30">
        <animateMotion
          dur="4s"
          repeatCount="indefinite"
          path={`M${width * 0.25},${height * 0.85} Q${width * 0.625},${height * 0.35} ${width},${height * 0.85} Q${width * 0.625},${height * 0.6} ${width * 0.25},${height * 0.85}`}
        />
      </circle>
      <circle r="4" fill="#ffffff20">
        <animateMotion
          dur="2.5s"
          repeatCount="indefinite"
          path={`M${width * 0.375},${height * 0.8} Q${width * 0.75},${height * 0.3} ${width * 1.125},${height * 0.8} Q${width * 0.75},${height * 0.55} ${width * 0.375},${height * 0.8}`}
        />
      </circle>
      <circle r="1.5" fill="#ffffff50">
        <animateMotion
          dur="3.5s"
          repeatCount="indefinite"
          path={`M${width * 0.2},${height * 0.7} Q${width * 0.55},${height * 0.4} ${width * 0.9},${height * 0.7} Q${width * 0.55},${height * 0.45} ${width * 0.2},${height * 0.7}`}
        />
      </circle>
    </svg>
  );
};
