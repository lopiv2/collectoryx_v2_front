import React, { useState, useEffect, useContext } from "react";
import { useTheme } from '@mui/material/styles';
import { Bar } from 'react-chartjs-2';
import { FormattedMessage, useIntl } from "react-intl";
import { Context } from "../Wrapper";
import { CurrencyChecker } from "../../utils/generic";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import ConfigService from "../../app/api/config.api";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function BarChartYearly(props) {
    const currency = CurrencyChecker();
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
        scales: {
            y: {
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function (value, index, ticks) {
                        return new Intl.NumberFormat(context.locale, { style: 'currency', currency: currency.currency }).format(value);
                    }
                }
            }
        },
        layout: {
            padding: {
                left: 5,
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';

                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat(context.locale, { style: 'currency', currency: currency.currency }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            },
            legend: {
                position: 'top',
            },
            title: {
                font: {
                    size: 20
                },
                display: true,
                text: intl.formatMessage({ id: "app.chart.year_paid_title" }) + " " + new Date().getFullYear(),
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
                label: intl.formatMessage({ id: "app.chart.purchases" }),
                data: collectionItemsGroup.map((item) => item.value),
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderWidth: 1,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(32, 150, 28, 0.8)'
                ],
            },
        ],
    };

    useEffect(() => {
        var priceCount = 0;
        const collections = ConfigService.getCollectionItemsPerYear(userData.id)
            .then((response) => {
                setCollectionItems(response.data);
                //console.log(response.data)
                for (var month = 1; month < 13; month++) {
                    var countfiltered = response.data.filter(function (element) {
                        var date = new Date(element.adquiringDate)
                        if (date.getMonth() + 1 == month) {
                            priceCount += element.price;
                        }
                        return date.getMonth() + 1 == month;
                    })
                    var index = collectionItemsGroup.findIndex(x => x.label == month);
                    let newItems = [...collectionItemsGroup];
                    newItems[index].value = priceCount;
                    setCollectionItemsGroup(newItems);
                    priceCount = 0;
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <Bar options={options} data={data} />
    );
}
