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
