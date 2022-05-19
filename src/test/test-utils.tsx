import { render } from '@testing-library/react';
import React, { FC } from 'react';
import { Provider } from 'react-redux';
import { EnhancedStore } from '@reduxjs/toolkit';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';


type Props = {
  store: EnhancedStore;
  mocks?: ReadonlyArray<MockedResponse>
};


function renderWithProviders(ui: React.ReactElement, { store, mocks=[] }: Props ) {
  const Wrapper: FC = ({ children }) => (
    <MockedProvider mocks={mocks} addTypename={false}>
      <Provider store={store}>{children}</Provider>
    </MockedProvider>
  );
  return { store, ...render(ui, { wrapper: Wrapper }) };
}

export { renderWithProviders };
