import * as React from "react";
import { FormattedMessage } from "react-intl";
import Flags from "country-flag-icons/react/3x2";

const createCollectionOptions = [
  {
    label: (
      <FormattedMessage id="app.collection.new_template"></FormattedMessage>
    ),
    value: "New",
    metadata: "true",
    fields: [
      {
        key: "name",
        value: (<FormattedMessage id="app.collection.view_collections_item_name"></FormattedMessage>),
      },
      {
        key: "serie",
        value: (<FormattedMessage id="app.collection.view_collections_item_serie"></FormattedMessage>),
      },
      {
        key: "price",
        value: (<FormattedMessage id="app.collection.view_collections_item_price"></FormattedMessage>),
      },
      {
        key: "year",
        value: (<FormattedMessage id="app.collection.view_collections_item_year"></FormattedMessage>),
      },
      {
        key: "acquiringDate",
        value: (<FormattedMessage id="app.collection.view_collections_item_date"></FormattedMessage>),
      },
      {
        key: "own",
        value: (<FormattedMessage id="app.collection.view_collections_item_own"></FormattedMessage>),
      },
      {
        key: "wanted",
        value: (<FormattedMessage id="app.collection.view_collections_item_wanted"></FormattedMessage>),
      },
      {
        key: "image",
        value: (<FormattedMessage id="app.collection.view_collections_item_image"></FormattedMessage>),
      },
      {
        key: "notes",
        value: (<FormattedMessage id="app.collection.view_collections_item_notes"></FormattedMessage>),
      }]
  },
  {
    label: (
      <FormattedMessage id="app.collection.action_figures"></FormattedMessage>
    ),
    value: "Action_Figures",
    metadata: "false",
    fields: [
      {
        key: "name",
        value: (<FormattedMessage id="app.collection.view_collections_item_name"></FormattedMessage>),
      },
      {
        key: "serie",
        value: (<FormattedMessage id="app.collection.view_collections_item_serie"></FormattedMessage>),
      },
      {
        key: "price",
        value: (<FormattedMessage id="app.collection.view_collections_item_price"></FormattedMessage>),
      },
      {
        key: "year",
        value: (<FormattedMessage id="app.collection.view_collections_item_year"></FormattedMessage>),
      },
      {
        key: "acquiringDate",
        value: (<FormattedMessage id="app.collection.view_collections_item_date"></FormattedMessage>),
      },
      {
        key: "own",
        value: (<FormattedMessage id="app.collection.view_collections_item_own"></FormattedMessage>),
      },
      {
        key: "wanted",
        value: (<FormattedMessage id="app.collection.view_collections_item_wanted"></FormattedMessage>),
      },
      {
        key: "image",
        value: (<FormattedMessage id="app.collection.view_collections_item_image"></FormattedMessage>),
      },
      {
        key: "notes",
        value: (<FormattedMessage id="app.collection.view_collections_item_notes"></FormattedMessage>),
      }]
  },
  {
    label: <FormattedMessage id="app.collection.videogames"></FormattedMessage>,
    value: "Videogames",
    metadata: "true",
    fields: [
      {
        key: "name",
        value: (<FormattedMessage id="app.collection.view_collections_item_name"></FormattedMessage>),
      },
      {
        key: "serie",
        value: (<FormattedMessage id="app.collection.view_collections_item_serie"></FormattedMessage>),
      },
      {
        key: "price",
        value: (<FormattedMessage id="app.collection.view_collections_item_price"></FormattedMessage>),
      },
      {
        key: "year",
        value: (<FormattedMessage id="app.collection.view_collections_item_year"></FormattedMessage>),
      },
      {
        key: "acquiringDate",
        value: (<FormattedMessage id="app.collection.view_collections_item_date"></FormattedMessage>),
      },
      {
        key: "own",
        value: (<FormattedMessage id="app.collection.view_collections_item_own"></FormattedMessage>),
      },
      {
        key: "wanted",
        value: (<FormattedMessage id="app.collection.view_collections_item_wanted"></FormattedMessage>),
      },
      {
        key: "image",
        value: (<FormattedMessage id="app.collection.view_collections_item_image"></FormattedMessage>),
      },
      {
        key: "notes",
        value: (<FormattedMessage id="app.collection.view_collections_item_notes"></FormattedMessage>),
      }],
    metaFields: [
      {
        key: "platform",
        value: (<FormattedMessage id="app.collection.view_collections_item_platform"></FormattedMessage>),
        type: "STRING",
      },
      {
        key: "developer",
        value: (<FormattedMessage id="app.collection.view_collections_item_developer"></FormattedMessage>),
        type: "STRING",
      },
      {
        key: "genre",
        value: (<FormattedMessage id="app.collection.view_collections_item_genre"></FormattedMessage>),
        type: "STRING",
      },
    ]
  },
  {
    label: <FormattedMessage id="app.collection.lego"></FormattedMessage>,
    value: "Lego",
    metadata: "true",
    fields: [
      {
        key: "name",
        value: (<FormattedMessage id="app.collection.view_collections_item_name"></FormattedMessage>),
      },
      {
        key: "serie",
        value: (<FormattedMessage id="app.collection.view_collections_item_serie"></FormattedMessage>),
      },
      {
        key: "price",
        value: (<FormattedMessage id="app.collection.view_collections_item_price"></FormattedMessage>),
      },
      {
        key: "year",
        value: (<FormattedMessage id="app.collection.view_collections_item_year"></FormattedMessage>),
      },
      {
        key: "acquiringDate",
        value: (<FormattedMessage id="app.collection.view_collections_item_date"></FormattedMessage>),
      },
      {
        key: "own",
        value: (<FormattedMessage id="app.collection.view_collections_item_own"></FormattedMessage>),
      },
      {
        key: "wanted",
        value: (<FormattedMessage id="app.collection.view_collections_item_wanted"></FormattedMessage>),
      },
      {
        key: "image",
        value: (<FormattedMessage id="app.collection.view_collections_item_image"></FormattedMessage>),
      },
      {
        key: "notes",
        value: (<FormattedMessage id="app.collection.view_collections_item_notes"></FormattedMessage>),
      }],
    metaFields: [
      {
        key: "inventory",
        value: (<FormattedMessage id="app.collection.view_collections_item_inventory"></FormattedMessage>),
        type: "STRING",
      },
      {
        key: "number_id",
        value: (<FormattedMessage id="app.collection.view_collections_item_number_id"></FormattedMessage>),
        type: "STRING",
      },
    ]
  },
  {
    label: "Hot Wheels",
    value: "Hot_Wheels",
    metadata: "true",
    fields: [
      {
        key: "name",
        value: (<FormattedMessage id="app.collection.view_collections_item_name"></FormattedMessage>),
      },
      {
        key: "serie",
        value: (<FormattedMessage id="app.collection.view_collections_item_serie"></FormattedMessage>),
      },
      {
        key: "price",
        value: (<FormattedMessage id="app.collection.view_collections_item_price"></FormattedMessage>),
      },
      {
        key: "year",
        value: (<FormattedMessage id="app.collection.view_collections_item_year"></FormattedMessage>),
      },
      {
        key: "acquiringDate",
        value: (<FormattedMessage id="app.collection.view_collections_item_date"></FormattedMessage>),
      },
      {
        key: "own",
        value: (<FormattedMessage id="app.collection.view_collections_item_own"></FormattedMessage>),
      },
      {
        key: "wanted",
        value: (<FormattedMessage id="app.collection.view_collections_item_wanted"></FormattedMessage>),
      },
      {
        key: "image",
        value: (<FormattedMessage id="app.collection.view_collections_item_image"></FormattedMessage>),
      },
      {
        key: "notes",
        value: (<FormattedMessage id="app.collection.view_collections_item_notes"></FormattedMessage>),
      }],
    metaFields: [
      {
        key: "collection_number",
        value: (<FormattedMessage id="app.collection.view_collections_item_col_number"></FormattedMessage>),
        type: "STRING",
      },
      {
        key: "color",
        value: (<FormattedMessage id="app.collection.view_collections_item_color"></FormattedMessage>),
        type: "STRING",
      },
    ]
  },
  {
    label: (
      <FormattedMessage id="app.collection.minerals"></FormattedMessage>
    ),
    value: "Minerals",
    metadata: "true",
    fields: [
      {
        key: "name",
        value: (<FormattedMessage id="app.collection.view_collections_item_name"></FormattedMessage>),
      },
      {
        key: "serie",
        value: (<FormattedMessage id="app.collection.view_collections_item_serie"></FormattedMessage>),
      },
      {
        key: "price",
        value: (<FormattedMessage id="app.collection.view_collections_item_price"></FormattedMessage>),
      },
      {
        key: "year",
        value: (<FormattedMessage id="app.collection.view_collections_item_year"></FormattedMessage>),
      },
      {
        key: "acquiringDate",
        value: (<FormattedMessage id="app.collection.view_collections_item_date"></FormattedMessage>),
      },
      {
        key: "own",
        value: (<FormattedMessage id="app.collection.view_collections_item_own"></FormattedMessage>),
      },
      {
        key: "wanted",
        value: (<FormattedMessage id="app.collection.view_collections_item_wanted"></FormattedMessage>),
      },
      {
        key: "image",
        value: (<FormattedMessage id="app.collection.view_collections_item_image"></FormattedMessage>),
      },
      {
        key: "notes",
        value: (<FormattedMessage id="app.collection.view_collections_item_notes"></FormattedMessage>),
      }],
    metaFields: [
      {
        key: "formula",
        value: (<FormattedMessage id="app.collection.view_collections_item_formula"></FormattedMessage>),
        type: "STRING",
      },
      {
        key: "ima",
        value: (<FormattedMessage id="app.collection.view_collections_item_ima"></FormattedMessage>),
        type: "STRING",
      },
      {
        key: "color",
        value: (<FormattedMessage id="app.collection.view_collections_item_color"></FormattedMessage>),
        type: "STRING",
      },
    ]
  },
  /*{
    label: <FormattedMessage id="app.collection.coins"></FormattedMessage>,
    value: "Coins",
  },
  {
    label: (
      <FormattedMessage id="app.collection.digital_collection"></FormattedMessage>
    ),
    value: "Digital_Collection",
  },*/
];

const fieldTypes = [
  {
    label: "Integer",
    value: "INTEGER"
  },
  {
    label: "Long",
    value: "LONG"
  },
  {
    label: "Float",
    value: "FLOAT"
  },
  {
    label: "Boolean",
    value: "BOOLEAN"
  },
  {
    label: "Double",
    value: "DOUBLE"
  },
  {
    label: "String",
    value: "STRING"
  },
]

const countriesOptions = [
  {
    value: "en-US",
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
  fieldTypes,
};

export default OptionsService;
