import * as React from "react";
import { FormattedMessage } from "react-intl";
import Flags from "country-flag-icons/react/3x2";

const LicenseTypes = [
  {
    label: "Free",
    value: "FREE",
    price: 0
  },
  {
    label: "Monthly",
    value: "MONTHLY",
    price: 4
  },
  {
    label: "Yearly",
    value: "YEARLY",
    price: 40
  },
  {
    label: "Lifetime",
    value: "LIFETIME",
    price: 150
  },
]

const LicenseService = {
  LicenseTypes
};

export default LicenseService;
