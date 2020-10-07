/*
 * Copyright 2020 Spotify AB
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

import React from 'react';
import { renderInTestApp } from '@backstage/test-utils';
import AlertActionCard from './AlertActionCard';
import { AlertType, ProjectGrowthAlert } from '../../types';
import { getAlertText } from '../../utils/alerts';
import { MockScrollProvider } from '../../utils/tests';

const alert = {
  id: AlertType.ProjectGrowth,
  aggregation: [500000.8, 970502.8],
  project: 'test-project',
  periodStart: '2019-10-01',
  periodEnd: '2020-03-31',
  change: { ratio: 120, amount: 120000 },
  products: [],
} as ProjectGrowthAlert;

describe('<AlertActionCard/>', () => {
  it('Renders an alert', async () => {
    const rendered = await renderInTestApp(
      <MockScrollProvider>
        <AlertActionCard alert={alert} number={1} />,
      </MockScrollProvider>,
    );

    expect(rendered.getByText('1')).toBeInTheDocument();
    const text = getAlertText(alert);
    expect(text).toBeDefined();
    if (text) {
      expect(rendered.getByText(text.title)).toBeInTheDocument();
      expect(rendered.getByText(text.subtitle)).toBeInTheDocument();
    }
  });
});
