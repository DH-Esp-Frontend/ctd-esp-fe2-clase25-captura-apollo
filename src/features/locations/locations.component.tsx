import { FC } from 'react';
import { LocationsTable } from 'features/locations/table';
import { Pagination } from 'features/pagination';
import { gql, useQuery } from '@apollo/client';


export const GET_LOCATIONS = gql`
 query getLocations($page: Int){
    locations(page: $page){
      info{
        pages
        next
        prev
        count
      }
    	results{
        id
        name
        type
        dimension
        residents{
          name
        }
      }
  }
  }
  `


const LocationsComponent: FC = () => {
  const {data, error, loading, refetch} = useQuery(GET_LOCATIONS, {variables: {page: 1}})
  const locations = data?.locations
  console.log(locations)
  if (loading) return <div>Loading interplanetary locations...</div>;
  if (error || !locations) return <div>Error when loading. Please try again later.</div>;

  const onPreviousPage = () => {
    refetch({page: locations.info?.prev})
  };

  const onNextPage = () => {
    refetch({page: locations.info?.next})
  };

  return (
    <div>
      <Pagination
        pagination={locations.info}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
      />
      <LocationsTable locations={locations.results} />
      <Pagination
        pagination={locations.info}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
      />
    </div>
  );
};

export default LocationsComponent;
