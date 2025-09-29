import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        bounce: {
          "0%, 20%, 50%, 80%, 100%": { 
            transform: "translateY(0)" 
          },
          "40%": { 
            transform: "translateY(-10px)" 
          },
          "60%": { 
            transform: "translateY(-5px)" 
          },
        },
        fadeIn: {
          "0%": { 
            opacity: "0" 
          },
          "100%": { 
            opacity: "1" 
          },
        },
        slideUp: {
          "0%": { 
            opacity: "0",
            transform: "translateY(20px)" 
          },
          "100%": { 
            opacity: "1",
            transform: "translateY(0)" 
          },
        },
        pulse: {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.5",
          },
        },
        "spin-slow": {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "bounce": "bounce 2s infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin-slow 3s linear infinite",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
      backdropBlur: {
        "xs": "2px",
      },
      transitionProperty: {
        "height": "height",
        "spacing": "margin, padding",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), 
    require("@tailwindcss/typography"),
    function({ addUtilities }: any) {
      const newUtilities = {
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.gradient-bg': {
          'background': 'linear-gradient(135deg, hsl(264 83% 58%) 0%, hsl(217 91% 60%) 100%)',
        },
        '.code-block': {
          'background': 'linear-gradient(135deg, hsl(217 32% 12%) 0%, hsl(222 15% 8%) 100%)',
        },
        '.glow-effect': {
          'box-shadow': '0 0 20px rgba(66, 211, 146, 0.3)',
        },
        '.ai-badge': {
          'background': 'linear-gradient(135deg, hsl(264 83% 58%) 0%, hsl(142 76% 36%) 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.builder-canvas': {
          'background-image': 'radial-gradient(circle at 20px 20px, hsl(217 32% 17%) 1px, transparent 0)',
          'background-size': '40px 40px',
        },
        '.glass': {
          'backdrop-filter': 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
          'background-color': 'rgba(255, 255, 255, 0.1)',
        },
        '.glass-dark': {
          'backdrop-filter': 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
          'background-color': 'rgba(0, 0, 0, 0.1)',
        },
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ],
} satisfies Config;
