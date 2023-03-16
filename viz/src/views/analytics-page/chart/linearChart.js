import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IconChartLine, IconChartArea, IconChartBar } from '@tabler/icons';
import { Autocomplete, Grid, TextField, IconButton, Tooltip } from '@mui/material';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';
import config from 'config';

// ==============================|| BAR CHART ||============================== //

const chartTypeMap = {
    line: IconChartLine,
    bar: IconChartBar,
    area: IconChartArea
};

const aggregatorArray = ['mean', 'min', 'max', 'sum', 'count', 'median'];

const LinearChart = ({ data, chartID, xState, yState, aggState, chartState }) => {
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);

    const { navType } = customization;
    const { primary } = theme.palette.text;
    const darkLight = theme.palette.dark.light;
    const grey200 = theme.palette.grey[200];

    const successDark = theme.palette.success.dark;

    const [series, setSeries] = useState([]);
    const [xAxis, setXAxis] = useState({});
    const colors = [primary, primary, primary, primary, primary, primary];
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const measures = JSON.parse(localStorage.getItem('measures')) || [];
    const [isMounted, setIsMounted] = useState(false);

    const [x, setX] = useState(xState);
    const [y, setY] = useState(yState);
    const [aggregator, setAggregator] = useState('sum');
    const [chartType, setChartType] = useState('bar');

    useEffect(() => {
        if (data['series']) {
            const series = data.series;
            const xAxis = data.x_axis;
            setSeries(series);
            setXAxis(xAxis);
        }
    }, [data]);

    useEffect(() => {
        if (chartState) {
            setChartType(chartState);
        }
        setIsMounted(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [options, setOptions] = useState({});

    const xChanged = (event, value) => {
        setX(value);
    };
    const yChanged = (event, value) => {
        setY(value);
    };
    const aggregatorChanged = (event, value) => {
        setAggregator(value);
    };

    useEffect(() => {
        if (isMounted) {
            if (x || y || aggregator) {
                fetch(`${config.endpoint}/update_chart_element?x=${x}&y=${y}&aggregator=${aggregator}`)
                    .then((response) => response.json())
                    .then((payload) => {
                        if (payload.series) {
                            const series = payload.series;
                            setSeries(series);
                        }
                        if (payload.x_axis) {
                            const x_axis = payload.x_axis;
                            setXAxis(x_axis);
                        }
                    })
                    .catch((error) => console.error(error));
            }
            const chartState = { [chartID]: { x: x, y: y, aggregator: aggregator, chartType: chartType } };
            localStorage.setItem(chartID, JSON.stringify(chartState));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [x, y, aggregator, chartType]);

    useEffect(() => {
        setOptions((prevState) => ({
            ...prevState,
            dataLabels: { enabled: false },
            colors: [successDark],
            grid: {
                borderColor: navType === 'dark' ? darkLight + 20 : grey200
            },
            tooltip: {
                theme: navType === 'dark' ? 'dark' : 'light'
            },
            legend: {
                labels: {
                    colors: 'grey.500'
                }
            }
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navType, primary, darkLight, grey200, successDark, data]);

    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={12} md={3}>
                    <Autocomplete
                        onChange={xChanged}
                        disableClearable
                        disablePortal
                        options={categories}
                        defaultValue={xState}
                        renderInput={(params) => <TextField {...params} label="X-Axis" />}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <Autocomplete
                        onChange={yChanged}
                        disableClearable
                        disablePortal
                        options={measures}
                        defaultValue={yState}
                        renderInput={(params) => <TextField {...params} label="Y-Axis" />}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <Autocomplete
                        onChange={aggregatorChanged}
                        disableClearable
                        disablePortal
                        options={aggregatorArray}
                        defaultValue={aggState}
                        renderInput={(params) => <TextField {...params} label="Aggregator" />}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <Grid container>
                        {Object.entries(chartTypeMap).map(([type, Icon]) => {
                            return (
                                <Tooltip title={type} key={type}>
                                    <IconButton
                                        color={type === chartType ? 'secondary' : 'primary'}
                                        size="small"
                                        onClick={() => {
                                            setChartType(type);
                                        }}
                                    >
                                        <Icon size="1.5rem" />
                                    </IconButton>
                                </Tooltip>
                            );
                        })}
                    </Grid>
                </Grid>
            </Grid>

            <ReactApexChart
                key={chartType}
                options={{
                    ...options,
                    xaxis: {
                        ...xAxis,
                        labels: {
                            style: {
                                colors: colors
                            }
                        }
                    }
                }}
                series={series}
                type={chartType}
            />
        </>
    );
};

export default LinearChart;
