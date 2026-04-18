import '@testing-library/jest-dom'
import * as React from 'react'
import { render, screen } from '@testing-library/react';
import MyComponent from './mock/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    const linkElement = screen.getByText(/some text/i);
    expect(linkElement).toBeInTheDocument();
  });
});
