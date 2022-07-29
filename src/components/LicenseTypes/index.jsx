import * as React from "react";
import { FormattedMessage } from "react-intl";
import Flags from "country-flag-icons/react/3x2";

const LicenseTypes = [
  {
    label: "Trial",
    value: "Trial",
    price: 0
  },
  {
    label: "Monthly",
    value: "Monthly",
    price: 4
  },
  {
    label: "Yearly",
    value: "Yearly",
    price: 40
  },
  {
    label: "Lifetime",
    value: "Lifetime",
    price: 150
  },
]

const LicenseService = {
  LicenseTypes
};

export default LicenseService;
