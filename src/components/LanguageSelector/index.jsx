import React, { useContext } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { Context } from "../Wrapper";
import Flags from 'country-flag-icons/react/3x2'
import OptionsService from "../DropDownOptions";

export default function LanguageSwitcher() {

    const context = useContext(Context);
    return (
        <FormControl size="small">
            <InputLabel id="test-select-label">{<FormattedMessage id="app.language"></FormattedMessage>}</InputLabel>
            <Select
                labelId="language"
                id="language"
                value={context.locale}
                label={<FormattedMessage id="app.language"></FormattedMessage>}
                onChange={context.selectLanguage}
            >
                {OptionsService.countriesOptions?.map(option => {
                    return (
                        <MenuItem key={option.value} value={option.value}>
                            {option.flag}
                            {option.language}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>

    )

}