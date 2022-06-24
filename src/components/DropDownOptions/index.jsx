import * as React from "react";
import { FormattedMessage } from "react-intl";
import Flags from "country-flag-icons/react/3x2";

const createCollectionOptions = [
  {
    label: (
      <FormattedMessage id="app.collection.new_template"></FormattedMessage>
    ),
    value: "New",
    fields: [
      (<FormattedMessage id="app.collection.view_collections_item_name"></FormattedMessage>),
      (<FormattedMessage id="app.collection.view_collections_item_serie"></FormattedMessage>),
      (<FormattedMessage id="app.collection.view_collections_item_price"></FormattedMessage>),
      (<FormattedMessage id="app.collection.view_collections_item_year"></FormattedMessage>),
      (<FormattedMessage id="app.collection.view_collections_item_own"></FormattedMessage>),
      (<FormattedMessage id="app.collection.view_collections_item_wanted"></FormattedMessage>),
      (<FormattedMessage id="app.collection.view_collections_item_image"></FormattedMessage>),
      (<FormattedMessage id="app.collection.view_collections_item_notes"></FormattedMessage>)]
  },
  {
    label: (
      <FormattedMessage id="app.collection.action_figures"></FormattedMessage>
    ),
    value: "Action_Figures",
    fields: [
      (<FormattedMessage id="app.collection.view_collections_item_name"></FormattedMessage>),
      (<FormattedMessage id="app.collection.view_collections_item_serie"></FormattedMessage>),
      (<FormattedMessage id="app.collection.view_collections_item_price"></FormattedMessage>),
      (<FormattedMessage id="app.collection.view_collections_item_year"></FormattedMessage>),
      (<FormattedMessage id="app.collection.view_collections_item_own"></FormattedMessage>),
      (<FormattedMessage id="app.collection.view_collections_item_wanted"></FormattedMessage>),
      (<FormattedMessage id="app.collection.view_collections_item_notes"></FormattedMessage>)]
  },
  {
    label: <FormattedMessage id="app.collection.coins"></FormattedMessage>,
    value: "Coins",
  },
  {
    label: <FormattedMessage id="app.collection.videogames"></FormattedMessage>,
    value: "Videogames",
  },
  {
    label: (
      <FormattedMessage id="app.collection.digital_collection"></FormattedMessage>
    ),
    value: "Digital_Collection",
  },
];

const countriesOptions = [
  {
    value: "en-EN",
    language: "English",
    flag: <Flags.US style={{ width: 20, height: 20 }} title="United States" />,
    currency: "USD",
  },
  {
    value: "es-ES",
    language: "Español",
    flag: <Flags.ES style={{ width: 20, height: 20 }} title="Spain" />,
    currency: "EUR",
  },
];

const OptionsService = {
  createCollectionOptions,
  countriesOptions,
};

export default OptionsService;
