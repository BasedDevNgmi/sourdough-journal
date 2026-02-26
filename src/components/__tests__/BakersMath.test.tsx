import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BakersMath from '../BakersMath';

describe('BakersMath Component', () => {
    it('calculates water hydration, salt, and starter correctly based on flour', () => {
        const data = {
            flour: 500,
            waterHydration: 75,
            saltPercentage: 2,
            starterPercentage: 20
        };
        const mockOnChange = vi.fn();

        render(<BakersMath data={data} onChange={mockOnChange} />);

        expect(screen.getByDisplayValue('500')).toBeInTheDocument();
        expect(screen.getByDisplayValue('375')).toBeInTheDocument();
        expect(screen.getByDisplayValue('10.0')).toBeInTheDocument();
        expect(screen.getByDisplayValue('100')).toBeInTheDocument();

        // The total weight rendering has a regular <span> inside, so we use a custom matcher or string containing text match
        // 500 + 375 + 10 + 100 = 985
        expect(screen.getByText(/985/)).toBeInTheDocument();
    });

    it('updates hydration percentage when water grams are changed', () => {
        const data = { flour: 500, waterHydration: 75, saltPercentage: 2, starterPercentage: 20 };
        const mockOnChange = vi.fn();
        render(<BakersMath data={data} onChange={mockOnChange} />);

        // Get the input for water grams (375)
        const waterInput = screen.getByDisplayValue('375');
        fireEvent.change(waterInput, { target: { value: '400' } });

        // 400 / 500 = 0.8 => 80%
        expect(mockOnChange).toHaveBeenCalledWith({
            ...data,
            waterHydration: 80
        });
    });
});
