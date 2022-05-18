import { FC } from 'react';
import CharacterGrid from './characters.styles';
import { CharacterCardComponent } from 'features/characters/card';
import { gql, useQuery } from '@apollo/client';

export type CharactersComponentProps = {
  ids: number[];
};

export const GET_CHARACTERS = gql`
  query getCharacters($ids: [ID!]!){
    charactersByIds(ids: $ids){
      name
      id
      image 
    }
  }
`



const CharactersComponent: FC<CharactersComponentProps> = ({ ids }: CharactersComponentProps) => {
  const {loading, data, error} = useQuery(GET_CHARACTERS, {
    variables: {ids}
  })
  console.log(ids, "ids");  
  const characters = data?.charactersByIds
  if (loading) return <div>Loading characters...</div>;
  if (error || !characters) {
    console.log(error)
    return <div>Error when loading. Please try again later.</div>};
  const character = !Array.isArray(characters) ? characters : undefined;

  return (
    <CharacterGrid>
      {Array.isArray(characters) &&
        characters.map((character) => (
          <CharacterCardComponent character={character} key={character.id} />
        ))}
      {character && <CharacterCardComponent character={character} />}
    </CharacterGrid>
  );
};

export default CharactersComponent;
