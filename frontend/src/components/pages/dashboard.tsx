import React, { useEffect, useState } from 'react';
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsStock from 'highcharts/modules/stock';
import HighchartsBoost from 'highcharts/modules/boost';
import axios from 'axios';

HighchartsStock(Highcharts);
HighchartsBoost(Highcharts);

interface CompetitionDetails {
    code: number,
    name: string,
    description: string,
    initial_value: number,
    start_date: string,
    end_date: string
}

function Dashboard() {
    const { competition_id } = useParams();
    const [chartOptions, setChartOptions] = useState({});
    const [competitionDetails, setCompetitionDetails] = useState<CompetitionDetails | null>(null);
    const [stockData, setStockData] = useState([]);
    
    useEffect(() => {
        const fetchCompetitionDetails = async () => {
            const response = await axios.post('http://localhost:8080/getcompetition', {competition_id: Number(competition_id)});
            const check = await axios.get("http://localhost:8080/gethash")
            console.log(check)
            const data = response.data.competition;
            setCompetitionDetails(data);
        };

        fetchCompetitionDetails();
    }, [competition_id]);

    useEffect(() => {
        const socket = new WebSocket("wss://example.com/stockdata"); 
        const multicast_ip = "239.0.0.1" 
        const port = 6000 
        
        socket.onmessage = (event) => {
            const newData = JSON.parse(event.data);
            setStockData(prevData => [...prevData, newData]); 

            setChartOptions(prevOptions => ({
                ...prevOptions,
                series: [{
                    ...prevOptions.series[0],
                    data: [...prevOptions.series[0].data, [newData.timestamp, newData.value]]
                }]
            }));
        };

        return () => {
            socket.close();
        };
    }, []);

    useEffect(() => {
        if (stockData.length) {
            setChartOptions({
                chart: {
                    type: 'line',
                    zoomType: 'x',
                },
                title: {
                    text: 'Competition Stock Data',
                },
                series: [{
                    name: 'Stock Price',
                    data: stockData.map(item => [item.timestamp, item.value]), 
                    boostThreshold: 1000, 
                }],
                boost: {
                    useGPUTranslations: true, 
                },
                xAxis: {
                    type: 'datetime',
                },
                yAxis: {
                    title: {
                        text: 'Stock Price',
                    },
                },
                tooltip: {
                    valueDecimals: 2,
                    valueSuffix: ' USD',
                },
                credits: {
                    enabled: false
                },
            });
        }
    }, [stockData]);

    return (
        <Box>
            {competitionDetails ? (
                <Box>
                    <Typography variant='h3'>{competitionDetails.name} </Typography>
                    <Typography> Description: {competitionDetails.description} </Typography>
                    <Typography> Start Date: {competitionDetails.start_date} </Typography>
                    <Typography> End Date: {competitionDetails.end_date} </Typography>
                </Box>
            ) : (
                <Typography>Loading competition details...</Typography>
            )}

            <Typography variant="h6" sx={{ marginTop: 4 }}>
                Live Stock Data
            </Typography>
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />

            <Typography variant="h6" sx={{ marginTop: 4 }}>
                Embedded Jupyter Notebook
            </Typography>
            
        </Box>
    );
}

export default Dashboard;



