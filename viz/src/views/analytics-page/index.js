import React, { useState, useEffect } from 'react';
// import Draggable from 'react-draggable';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import { Grid } from '@mui/material';
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

    // useEffect(() => {
    //   localStorage.setItem("containers", JSON.stringify(containers));
    // }, [containers]);

    // useEffect(() => {
    //   const savedContainers = localStorage.getItem("containers");
    //   if (savedContainers) {
    //     setContainers(savedContainers);
    //   }
    // }, []);

    // function addContainer() {
    //     const newContainer = (
    //         <Draggable>
    //             <div className="container" style={{ height: '600px', width: '600px', backgroundColor: 'white' }}>
    //                 New Container
    //             </div>
    //         </Draggable>
    //     );
    //     setContainers([...containers, newContainer]);
    // }
    const vizElement = ['chart1', 'chart2', 'chart3', 'chart4'];
    return (
        <MainCard title="Report Dashboard">
            <Grid container spacing={gridSpacing}>
                {vizElement.map((element, index) => {
                    const storedData = JSON.parse(localStorage.getItem(element));
                    const { x, y, aggregator, chartType } = storedData[element];
                    return (
                        <Grid item xs={12} md={6} lg={6} key={index}>
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
