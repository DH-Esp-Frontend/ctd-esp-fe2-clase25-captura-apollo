import { screen } from '@testing-library/react';
import { CharacterCardProps } from 'features/characters/card';
import {  CharactersComponent } from 'features/characters/index';
import { renderWithProviders } from 'test/test-utils';
import { MockedProvider } from '@apollo/client/testing';
import { store } from 'store/store';
import { GET_CHARACTERS } from './characters.component';

const mocks = [
  {
    request:{
      query: GET_CHARACTERS,
      variables: {
        ids: [1]
      }
    },
    result: {
      data: {
        charactersByIds: {id: 1, name: "Rick", image: "any"}
      }
    }
  }
]

const mockCharacterCardComponent = jest.fn();
jest.mock('features/characters/card', () => ({
  CharacterCardComponent: jest.fn((props: CharacterCardProps) => {
    mockCharacterCardComponent(props);
    return <div>Character card</div>;
  })
}));

describe('CharactersComponent', () => {

  describe('when fetching characters', () => {
    it('should render loading', async () => {
      renderWithProviders(
        <MockedProvider mocks={mocks} addTypename={false}>
          <CharactersComponent ids={[1]} />
        </MockedProvider>, { store })
      //
      expect(screen.getByText('Loading characters...')).toBeInTheDocument();
    });
  });
  describe('when finish loading with only one id', () => {
    it('should render one card', async () => {
      renderWithProviders( <MockedProvider mocks={mocks} addTypename={false}>
        <CharactersComponent ids={[1]}  />
      </MockedProvider>, { store });
      expect(await screen.findByText('Character card')).toBeInTheDocument();
    });
  });
  describe('when finish loading with multiple ids', () => {
    it('should render multiple cards', async () => {
      const moreIdsMock = [
        {
          request:{
            query: GET_CHARACTERS,
            variables: {
              ids: [1,2]
            }
          },
          result: {
            data: {
              charactersByIds: [{id: 1, name: "Rick", image: "any"}, {id: 2, name: "Morty", image: "any"}]
            }
          }
        }
      ]
      renderWithProviders( <MockedProvider mocks={moreIdsMock} addTypename={false}>
        <CharactersComponent ids={[1,2]}  />
      </MockedProvider>, { store });
      //
      expect((await screen.findAllByText('Character card')).length).toBe(2);
    });
  });
  describe("when there is an error", ()=>{
    it("should handle the error", async()=>{
      const errorMock = [
        {
          request:{
            query: GET_CHARACTERS,
            variables: {
              ids: [1]
            }
          },
          error: new Error('An error occurred'),
        }
      ]
      renderWithProviders( <MockedProvider mocks={errorMock} addTypename={false}>
        <CharactersComponent ids={[1]}  />
      </MockedProvider>, { store });
      //
      expect((await screen.findByText('Error when loading. Please try again later.'))).toBeInTheDocument();
    })
  })
});
