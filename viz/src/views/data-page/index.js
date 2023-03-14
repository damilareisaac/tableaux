// material-ui
import { Input } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

import DenseTable from './data-table';

// ==============================|| DATA PAGE ||============================== //

const DataPage = () => {
    const [file, setFile] = useState(null);
    const [data, setData] = useState({});

    useEffect(() => {
        const storedData = localStorage.getItem('data');
        if (storedData !== null) {
            setData(JSON.parse(storedData));
        }
    }, []);

    useEffect(() => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file[0]);
            fetch('http://localhost:8000/upload', {
                method: 'POST',
                body: formData
            })
                .then((response) => response.json())
                .then((resp_json) => {
                    setData(resp_json);
                })
                .catch((error) => console.error(error));
        }
    }, [file]);

    useEffect(() => {
        localStorage.setItem('data', JSON.stringify(data));
        if (data.categories) {
            localStorage.setItem('categories', JSON.stringify(data.categories));
        }
        if (data.measures) {
            localStorage.setItem('measures', JSON.stringify(data.measures));
        }
    }, [data]);

    return (
        <MainCard title="Load Data">
            <SubCard title="Upload Data File">
                <Input type="file" inputProps={{ accept: '.csv, .xlsx, .xls' }} onChange={(e) => setFile(e.target.files)} />
            </SubCard>
            {data && Object.keys(data).length > 0 && (
                <>
                    <SubCard title="Data Grid" sx={{ mb: 5, mt: 5 }}>
                        <div style={{ height: 500, width: '100%' }}>
                            <DataGrid
                                rows={data.data_rows}
                                columns={data.data_columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                density="comfortable"
                            />
                        </div>
                    </SubCard>
                    <DenseTable summary_columns={data.numeric_summary_columns} summary_rows={data.numeric_summary_rows} />
                    <DenseTable
                        summary_columns={data.cat_summary_columns}
                        summary_rows={data.cat_summary_rows}
                        type="categorical"
                        title="Categorical Data Summary"
                    />
                </>
            )}
        </MainCard>
    );
};

export default DataPage;
