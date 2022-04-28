import React, { useContext } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { Context } from "../components/Wrapper";
import Flags from 'country-flag-icons/react/3x2'

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
                <MenuItem value='en-EN'>
                    <Flags.US style={{ width: 20, height: 20 }} title="United States" />
                    English
                </MenuItem>

                <MenuItem value='es-ES'>
                    <Flags.ES style={{ width: 20, height: 20 }} title="Spain" />
                    Español
                </MenuItem>
            </Select>
        </FormControl>

    )

}