import React, { useState, useEffect } from 'react';
// import Draggable from 'react-draggable';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import { Grid, Typography } from '@mui/material';
import { gridSpacing } from 'store/constant';
import LinearChart from './chart/linearChart';
import config from 'config';

const AnalyticsPage = () => {
    const [data, setData] = useState({});

    useEffect(() => {
        fetch(`${config.endpoint}/report_query`, {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((resp_json) => setData(resp_json))
            .catch((error) => console.error(error));
    }, []);

    const vizElement = ['chart1', 'chart2', 'chart3', 'chart4'];
    if (!data) return <Typography>Please (re)load data </Typography>;
    return (
        <MainCard title="Report Dashboard">
            <Grid container spacing={gridSpacing}>
                {vizElement.map((element, index) => {
                    const storedData = JSON.parse(localStorage.getItem(element)) || {};
                    const { x, y, aggregator, chartType } = storedData[element] || { x: '', y: '', aggregator: 'sum', chartType: 'line' };
                    return (
                        <Grid item xs={12} md={6} lg={6} key={element}>
                            <SubCard>
                                <LinearChart
                                    data={data}
                                    chartID={element}
                                    xState={x}
                                    yState={y}
                                    aggState={aggregator}
                                    chartState={chartType}
                                />
                            </SubCard>
                        </Grid>
                    );
                })}
            </Grid>
        </MainCard>
    );
};

export default AnalyticsPage;
