import type {Config} from 'tailwindcss';

const pxToRem = (px: number, base = 16) => `${px / base}rem`;

const range = (start: number, end: number): number[] => {
  const arr: number[] = [];
  for (let i = start; i <= end; i++) {
    arr.push(i);
  }
  return arr;
};

export default {
  darkMode: 'class',
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      boxShadow: {
        'sidenavi-box': '0 4px 16px rgba(17, 34, 17, 0.05)',
      },

      colors: {
        transparent: 'transparent',
        white: 'var(--white)',
        'nomad-black': 'var(--nomad-black)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        'accent-green': 'var(--accent-green)',
        yellow: 'var(--yellow)',

        black: {
          50: '#000000',
          100: '#1B1B1B',
          200: '#1C1B1F',
          300: '#969696',
          400: '#FAFBFC',
        },

        gray: {
          50: '#FAFAFA',
          100: '#EEEEEE',
          200: '#DDDDDD',
          300: '#CBC9CF',
          400: '#ADAEB8',
          500: '#A4A1AA',
          600: '#A1A1A1',
          700: '#79747E',
          800: '#4B4B4B',
          900: '#E8E8E8',
        },

        red: {
          50: '#FFE4E0',
          100: '#FFC2BA',
          200: '#FF472E',
        },

        orange: {
          50: '#FFF4E8',
          100: '#FF7C1D',
        },

        blue: {
          50: '#E5F3FF',
          100: '#2EB4FF',
          200: '#0085FF',
        },

        green: {
          50: '#CED8D5',
          100: '#0B3B2D',
        },

        /*다크모드 */
        'dark-white': '#EAEAEA',
        'dark-nomad-black': '#0D1A0D',
        'dark-primary': '#135546',
        'dark-secondary': '#A5B2AF',
        'dark-accent-green': '#00D914',
        'dark-yellow': '#E0A923',

        'dark-black': {
          50: '#181818',
          100: '#222222',
          200: '#2C2C2C',
          300: '#3B3B3B',
          400: '#A8A8A8',
        },

        'dark-gray': {
          50: '#252525',
          100: '#2E2E2E',
          200: '#3A3A3A',
          300: '#5A5A5A',
          400: '#A3A3A3',
          500: '#B0B0B0',
          600: '#C5C5C5',
          700: '#D0D0D0',
          800: '#E0E0E0',
          900: '#F5F5F5',
        },

        'dark-red': {
          50: '#FF6B6B',
          100: '#FF3B3B',
          200: '#C0392B',
        },

        'dark-orange': {
          50: '#FF8C42',
          100: '#D86E30',
        },

        'dark-blue': {
          50: '#4A90E2',
          100: '#2775B6',
          200: '#1B4F72',
        },

        'dark-green': {
          50: '#1D6B50',
          100: '#144D3B',
        },
      },

      fontSize: {
        '4xl': ['50px', '60px'],
        '3xl': ['32px', '42px'],
        '2xl': ['24px', '32px'],
        xl: ['20px', '32px'],
        '2lg': ['18px', '26px'],
        lg: ['16px', '26px'],
        md: ['14px', '24px'],
        sm: ['13px', '22px'],
        xs: ['12px', '18px'],
      },
      fontWeight: {
        bold: '700',
        semibold: '600',
        medium: '500',
        regular: '400',
      },
      spacing: {
        // 기존 spacing 값에 pxr 단위 추가
        ...range(1, 800).reduce(
          (acc, px) => {
            acc[`${px}pxr`] = pxToRem(px); // 1pxr은 rem으로 변환
            return acc;
          },
          {} as Record<string, string>,
        ),
        '0pxr': '0rem', // 0pxr 추가
      },
      screens: {
        // PC (1200px 이상)
        pc: '1200px',
        // Tablet (745px 이상 ~ 1199px 이하)
        tablet: '745px',
        // Mobile (375px 이상 ~ 744px 이하)
      },
    },
  },
  plugins: [],
} satisfies Config;
