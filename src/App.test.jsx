import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';

// Mock axios
jest.mock('axios');

describe('App Component', () => {
    beforeEach(() => {
        axios.get.mockClear();
    });

    test('renders App component', () => {
        render(<App />);
        expect(screen.getByText('React Pet')).toBeInTheDocument();
    });

    test('handles filter selection correctly', async () => {
        axios.get.mockResolvedValueOnce({
            data: [
                { id: 1, name: 'Dog', status: 'available' },
                { id: 2, name: 'Cat', status: 'pending' }
            ]
        });

        render(<App />);

        const availableCheckbox = screen.getByLabelText('available');
        const pendingCheckbox = screen.getByLabelText('pending');

        fireEvent.click(pendingCheckbox);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining('status=available,pending')
            );
        });
    });

    test('displays error message on API failure', async () => {
        axios.get.mockRejectedValueOnce({
            response: { data: { message: 'API Error' } }
        });

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('Oops! Something went wrong.')).toBeInTheDocument();
        });
    });

    test('resets filters when clicking reset button', () => {
        render(<App />);

        const resetButton = screen.getByText('Reset filters');
        fireEvent.click(resetButton);

        expect(screen.getByText('Select one or more filters to see our pets.')).toBeInTheDocument();
    });
});
