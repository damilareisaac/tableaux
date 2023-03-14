// material-ui
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

// project imports
import SubCard from 'ui-component/cards/SubCard';

const numeric_summary_items = ['mean', 'std', 'min', '25%', '50%', '75%', 'max'];

const cat_summary_items = ['unique', 'top', 'frequency'];

// ==============================|| TABLE - DENSE ||============================== //

export default function DenseTable({ summary_columns, summary_rows, type = 'numeric', title = 'Numeric Data Summary' }) {
    const summary_items = type === 'numeric' ? numeric_summary_items : cat_summary_items;
    return (
        <SubCard content={false} title={title} sx={{ mb: 5, mt: 5 }}>
            <TableContainer>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            {summary_columns &&
                                summary_columns.map((column, index) => (
                                    <TableCell key={index} sx={{ typography: 'h3' }}>
                                        {column}
                                    </TableCell>
                                ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {summary_items &&
                            summary_items.map((item, index) => (
                                <TableRow hover key={index}>
                                    <TableCell sx={{ typography: 'h4' }}>{item}</TableCell>
                                    {summary_rows[index] &&
                                        summary_rows[index].map((cell, index) => (
                                            <TableCell key={index}>{parseFloat(cell).toFixed(2)}</TableCell>
                                        ))}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </SubCard>
    );
}
