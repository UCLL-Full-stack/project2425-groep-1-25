import '@testing-library/jest-dom';
import { setConfig } from 'next/config';
import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';

// Mock Next.js router
const mockRouter = {
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn().mockResolvedValue(undefined),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
};

jest.mock('next/router', () => ({
  useRouter() {
    return mockRouter;
  },
}));

// Mock Next.js config
setConfig({
  publicRuntimeConfig: {},
  serverRuntimeConfig: {},
});

// Initialize i18n for testing
i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      translation: {
        general: {
          loading: 'Loading...',
          error: 'Error',
        },
        event: {
          details: {
            price: 'Price',
            minparticipants: 'Min Participants',
            maxparticipants: 'Max Participants',
          },
        },
      },
    },
  },
});