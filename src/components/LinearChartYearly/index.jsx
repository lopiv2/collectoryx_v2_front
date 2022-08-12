import React, { useState, useEffect, useContext } from "react";
import { useTheme } from '@mui/material/styles';
import { Line } from 'react-chartjs-2';
import { FormattedMessage, useIntl } from "react-intl";
import { Context } from "../Wrapper";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import ConfigService from "../../app/api/config.api";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function LinearChartYearly(props) {
    const theme = useTheme();
    const context = useContext(Context);
    const intl = useIntl();
    const [labels, setLabels] = useState([]);
    const [collectionItems, setCollectionItems] = useState([]);
    const [collectionItemsGroup, setCollectionItemsGroup] = useState([{
        label: "1",
        value: ""
    },
    {
        label: "2",
        value: ""
    },
    {
        label: "3",
        value: ""
    },
    {
        label: "4",
        value: ""
    },
    {
        label: "5",
        value: ""
    },
    {
        label: "6",
        value: ""
    },
    {
        label: "7",
        value: ""
    },
    {
        label: "8",
        value: ""
    },
    {
        label: "9",
        value: ""
    },
    {
        label: "10",
        value: ""
    },
    {
        label: "11",
        value: ""
    },
    {
        label: "12",
        value: ""
    },]);

    const options = {
        responsive: true,
        layout: {
            padding: {
                left: 5,
            }
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                font: {
                    size: 20
                },
                display: true,
                text: intl.formatMessage({ id: "app.chart.year_title" }) + " " + new Date().getFullYear(),
            },
        },
    };

    if (localStorage.getItem("user")) {
        var user = localStorage.getItem("user");
        var userData = JSON.parse(user);
    }

    function getAllMonths({ locale = context.locale, format = "long" } = {}) {
        const applyFormat = new Intl.DateTimeFormat(locale, { month: format }).format;
        return [...Array(12).keys()].map((m) => applyFormat(new Date(new Date().getFullYear(), m)).replace(/^\w/, (c) => c.toUpperCase()));
    }

    useEffect(() => {
        setLabels(getAllMonths());
    }, [context.locale])

    const data = {
        labels,
        datasets: [
            {
                label: intl.formatMessage({ id: "app.chart.acquisitions" }),
                data: collectionItemsGroup.map((item) => item.value),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    useEffect(() => {
        const collections = ConfigService.getCollectionItemsPerYear(userData.id)
            .then((response) => {
                setCollectionItems(response.data);
                for (var month = 1; month < 13; month++) {
                    var countfiltered = response.data.filter(function (element) {
                        var date = new Date(element.adquiringDate)
                        return date.getMonth() + 1 == month;
                    }).length
                    var index = collectionItemsGroup.findIndex(x => x.label == month);
                    let newItems = [...collectionItemsGroup];
                    collectionItemsGroup[index].value = countfiltered;
                    setCollectionItemsGroup(newItems);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <Line options={options} data={data} />
    );
}
