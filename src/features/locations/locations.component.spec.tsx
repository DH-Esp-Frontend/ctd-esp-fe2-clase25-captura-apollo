import { screen, waitFor } from '@testing-library/react';
import { LocationsComponent } from 'features/locations/index';
import { store } from 'store/store';
import userEvent from '@testing-library/user-event';
import { LocationsTableProps } from 'features/locations/table';
import { GET_LOCATIONS } from './locations.component';
import { renderWithProviders } from 'test/test-utils';
import { locationData1Json } from 'test/mocks/locations/locations.mocks';



const mocks = [
  {
    request:{
      query: GET_LOCATIONS,
      variables: {page: 1}
    },
    result: {
      data: {
        locations: {
          info: {
            pages: 7,
            next: 2,
            prev: null,
            count: 10
          },
          results: [
            locationData1Json
          ]
        }
      }
    }
  },
  {
    request:{
      query: GET_LOCATIONS,
      variables: {page: 2}
    },
    result: {
      data: {
        locations: {
          info: {
            pages: 7,
            next: 3,
            prev: 1,
            count: 10
          },
          results: [
            {
              id: 4,
              name: 'Planet 4',
              type: 'Planet',
              dimension: 'Dimension C-137',
              residents: ['https://rickandmortyapi.com/api/character/38']
            }
          ]
        }
      }
    }
  }
]

const mockLocationsTable = jest.fn();
jest.mock('features/locations/table', () => ({
  LocationsTable: jest.fn((props: LocationsTableProps) => {
    mockLocationsTable(props);
    return (
      <div>
        <h3>Locations loaded</h3>
        {props.locations.map((p) => (
          <div key={p.id}>{p.name}</div>
        ))}
      </div>
    );
  })
}));

describe('Locations', () => {
  describe('when render default loading state', () => {
    it('should have a loading message', async () => {
      renderWithProviders(<LocationsComponent />, { store, mocks });
      //
      expect(screen.getByText('Loading interplanetary locations...')).toBeInTheDocument();
    });
  });
  describe('when api returns success', () => {
    it('should have values displayed', async () => {
      renderWithProviders(<LocationsComponent />, { store, mocks });
      //
      expect(await screen.findByText('Planet 1')).toBeInTheDocument();
      expect(screen.queryByText('Loading interplanetary locations...')).not.toBeInTheDocument();
    });
    it('should not display loading anymore', async () => {
      renderWithProviders(<LocationsComponent />, { store, mocks });
      //
      await waitFor(() => {
        expect(screen.queryByText('Loading interplanetary locations...')).not.toBeInTheDocument();
      });
    });
    it('should display 2 pagination components', async () => {
      renderWithProviders(<LocationsComponent />, { store, mocks });
      expect((await screen.findAllByRole('button', { name: /Previous/i })).length).toBe(2);
      expect((await screen.findAllByRole('button', { name: /Next/i })).length).toBe(2);
    });
    describe('when click on next page', () => {
      it('should display a valid page 2', async () => {
        renderWithProviders(<LocationsComponent />, { store, mocks });
        userEvent.click((await screen.findAllByRole('button', { name: /Next/i }))[0]);
        //
        await waitFor(() => {
          expect(screen.queryByText('Planet 1')).not.toBeInTheDocument();
        });
        expect(screen.getByText('Planet 4')).toBeInTheDocument();
      });
    });
    describe('when click on previous page', () => {
      it('should display a valid page 1 again', async () => {
        renderWithProviders(<LocationsComponent />, { store, mocks });
        userEvent.click((await screen.findAllByRole('button', { name: /Previous/i }))[0]);
        //
        expect(await screen.findByText('Planet 1')).toBeInTheDocument();
      });
    });
  });
});
