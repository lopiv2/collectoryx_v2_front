import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { FormattedMessage } from 'react-intl';
import { Typography } from '@mui/material';

function createData(name, type) {
    return { name, type };
}

const rows = [
    createData('Frozen yoghurt', 159),
];

export default function TableCustomFields(props) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 120 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Typography style={{ fontWeight: 600 }}>
                                <FormattedMessage id="app.collection.add_collection_field_name"></FormattedMessage>
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography style={{ fontWeight: 600 }}>
                                <FormattedMessage id="app.collection.add_collection_field_type"></FormattedMessage>
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="center">{row.type}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
