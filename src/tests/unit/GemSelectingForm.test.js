import React from 'react';
import { render, screen } from '@testing-library/react';
import GemSelectingForm from '../components/gem/GemSelectingForm';

test('renders Select Gem header', () => {
  render(<GemSelectingForm />);
  const headerElement = screen.getByText(/Select Gem/i);
  expect(headerElement).toBeInTheDocument();
});
