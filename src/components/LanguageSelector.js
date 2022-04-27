import React, { useContext } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { Context } from "../components/Wrapper";

export default function LanguageSwitcher() {

    const context = useContext(Context);
    return (
        <FormControl>
            <InputLabel id="test-select-label">{<FormattedMessage id="app.language"></FormattedMessage>}</InputLabel>
            <Select
                labelId="language"
                id="language"
                value={context.locale}
                label={<FormattedMessage id="app.language"></FormattedMessage>}
                onChange={context.selectLanguage}
            >
                <MenuItem value='en-EN'>English</MenuItem>
                <MenuItem value='es-ES'>Español</MenuItem>
            </Select>
        </FormControl>

    )

}