import React, { useEffect } from 'react';
import esLocale from 'date-fns/locale/es';
import enLocale from 'date-fns/locale/en-US';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CurrencyChecker } from '../../utils/generic';

const localeMap = {
  en: enLocale,
  es: esLocale,
};


export default function BasicDatePicker(props) {
  const [value, setValue] = React.useState(null);
  const [locale, setLocale] = React.useState('es');
  //const c = CurrencyChecker();

  const selectLocale = (newLocale) => {
    setLocale(newLocale);
  };

  useEffect(() => {
    //console.log(esLocale);
  }, [])

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={localeMap[locale]}>
      <DatePicker
        type="datetime-local"
        id={props.id}
        dateFormat="yyyy-MM-dd"
        name={props.name}
        label={props.label}
        value={props.value}
        size={props.size}
        onChange={props.onChange}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}