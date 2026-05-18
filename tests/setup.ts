import "@testing-library/jest-dom/vitest";

// jsdom does not implement IntersectionObserver; framer-motion's whileInView requires it.
const mockIntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
vi.stubGlobal("IntersectionObserver", mockIntersectionObserver);
