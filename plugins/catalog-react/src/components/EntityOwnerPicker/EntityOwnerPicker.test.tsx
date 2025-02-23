/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Entity, parseEntityRef } from '@backstage/catalog-model';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { MockEntityListContextProvider } from '../../testUtils/providers';
import { EntityOwnerFilter } from '../../filters';
import { EntityOwnerPicker } from './EntityOwnerPicker';

const sampleEntities: Entity[] = [
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-1',
    },
    relations: [
      {
        type: 'ownedBy',
        targetRef: 'group:default/some-owner',
      },
      {
        type: 'ownedBy',
        targetRef: 'group:default/some-owner-2',
      },
    ],
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-2',
    },
    relations: [
      {
        type: 'ownedBy',
        targetRef: 'group:default/another-owner',
      },
    ],
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-3',
    },
    relations: [
      {
        type: 'ownedBy',
        targetRef: 'group:default/some-owner',
      },
    ],
  },
];

describe('<EntityOwnerPicker/>', () => {
  it('renders all owners', () => {
    render(
      <MockEntityListContextProvider
        value={{ entities: sampleEntities, backendEntities: sampleEntities }}
      >
        <EntityOwnerPicker />
      </MockEntityListContextProvider>,
    );
    expect(screen.getByText('Owner')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('owner-picker-expand'));
    sampleEntities
      .flatMap(e => e.relations?.map(r => parseEntityRef(r.targetRef).name))
      .forEach(owner => {
        expect(screen.getByText(owner as string)).toBeInTheDocument();
      });
  });

  it('renders unique owners in alphabetical order', () => {
    render(
      <MockEntityListContextProvider
        value={{ entities: sampleEntities, backendEntities: sampleEntities }}
      >
        <EntityOwnerPicker />
      </MockEntityListContextProvider>,
    );
    expect(screen.getByText('Owner')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('owner-picker-expand'));

    expect(screen.getAllByRole('option').map(o => o.textContent)).toEqual([
      'another-owner',
      'some-owner',
      'some-owner-2',
    ]);
  });

  it('respects the query parameter filter value', () => {
    const updateFilters = jest.fn();
    const queryParameters = { owners: ['another-owner'] };
    render(
      <MockEntityListContextProvider
        value={{
          entities: sampleEntities,
          backendEntities: sampleEntities,
          updateFilters,
          queryParameters,
        }}
      >
        <EntityOwnerPicker />
      </MockEntityListContextProvider>,
    );

    expect(updateFilters).toHaveBeenLastCalledWith({
      owners: new EntityOwnerFilter(['another-owner']),
    });
  });

  it('adds owners to filters', () => {
    const updateFilters = jest.fn();
    render(
      <MockEntityListContextProvider
        value={{
          entities: sampleEntities,
          backendEntities: sampleEntities,
          updateFilters,
        }}
      >
        <EntityOwnerPicker />
      </MockEntityListContextProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      owners: undefined,
    });

    fireEvent.click(screen.getByTestId('owner-picker-expand'));
    fireEvent.click(screen.getByText('some-owner'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      owners: new EntityOwnerFilter(['some-owner']),
    });
  });

  it('removes owners from filters', () => {
    const updateFilters = jest.fn();
    render(
      <MockEntityListContextProvider
        value={{
          entities: sampleEntities,
          backendEntities: sampleEntities,
          updateFilters,
          filters: { owners: new EntityOwnerFilter(['some-owner']) },
        }}
      >
        <EntityOwnerPicker />
      </MockEntityListContextProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      owners: new EntityOwnerFilter(['some-owner']),
    });
    fireEvent.click(screen.getByTestId('owner-picker-expand'));
    expect(screen.getByLabelText('some-owner')).toBeChecked();

    fireEvent.click(screen.getByLabelText('some-owner'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      owner: undefined,
    });
  });

  it('responds to external queryParameters changes', () => {
    const updateFilters = jest.fn();
    const rendered = render(
      <MockEntityListContextProvider
        value={{
          updateFilters,
          queryParameters: { owners: ['team-a'] },
        }}
      >
        <EntityOwnerPicker />
      </MockEntityListContextProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      owners: new EntityOwnerFilter(['team-a']),
    });
    rendered.rerender(
      <MockEntityListContextProvider
        value={{
          updateFilters,
          queryParameters: { owners: ['team-b'] },
        }}
      >
        <EntityOwnerPicker />
      </MockEntityListContextProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      owners: new EntityOwnerFilter(['team-b']),
    });
  });
});
