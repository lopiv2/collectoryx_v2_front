import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Flags from 'country-flag-icons/react/3x2'

const createCollectionOptions = [
  { label: <FormattedMessage id="app.collection.new_template"></FormattedMessage>, value: 'New' },
  { label: <FormattedMessage id="app.collection.action_figures"></FormattedMessage>, value: 'Action_Figures' },
  { label: <FormattedMessage id="app.collection.coins"></FormattedMessage>, value: 'Coins' },
  { label: <FormattedMessage id="app.collection.videogames"></FormattedMessage>, value: 'Videogames' },
  { label: <FormattedMessage id="app.collection.digital_collection"></FormattedMessage>, value: 'Digital_Collection' },
];

const countriesOptions = [
  { value: 'en-EN', language: "English", flag: <Flags.US style={{ width: 20, height: 20 }} title="United States" /> },
  { value: 'es-ES', language: "Español", flag: <Flags.ES style={{ width: 20, height: 20 }} title="Spain" /> },
];

const OptionsService = {
  createCollectionOptions, countriesOptions
}

export default OptionsService;