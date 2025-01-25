const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const ChartDataLabels = require('chartjs-plugin-datalabels');
const Chart = require('chart.js');

Chart.register(ChartDataLabels);

const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 1920, height: 780});

async function generateChart(config) {
  return chartJSNodeCanvas.renderToBuffer(config);
}

async function generateITSMInvestmentScoresChart(peopleAverages, processAverages, technologyAverages, overallScores, title) {
    const config = {
      type: 'bar',
      data: {
        labels: [
          'Standard',
          'Professional',
          'Enterprise'
        ],
        datasets: [
          {
            label: 'People',
            data: [peopleAverages.standardAvg, peopleAverages.professionalAvg, peopleAverages.enterpriseAvg],
            backgroundColor: '#455CFF',
          },
          {
            label: 'Process',
            data: [processAverages.standardAvg, processAverages.professionalAvg, processAverages.enterpriseAvg],
            backgroundColor: '#D9D9D9',
          },
          {
            label: 'Technology',
            data: [technologyAverages.standardAvg, technologyAverages.professionalAvg, technologyAverages.enterpriseAvg],
            backgroundColor: '#141414',
          },
          {
            label: 'Aggregated Score',
            data: [overallScores.standardOverall, overallScores.professionalOverall, overallScores.enterpriseOverall],
            backgroundColor: '#DEFF00',
          }
        ]
      },
      options: {
        plugins: {
          title: {
            color: '#000000',
            display: true,
            text: title,
            font: {
              size: 36,
            },
          },
          legend: { position: 'top', labels: { boxWidth: 30, padding: 10, font: { size: 34 }, color: '#000' } },
          datalabels: {
            display: true,
            anchor: 'end',
            align: 'top',
            color: 'black',
            font: {
              size: 30,
             
            },
            formatter: function(value) {
              return value.toFixed(2);
            },
          },
        },
        elements: {
          background: {
            color: '#54875' // Set the background color of the chart area
          }
        },
        scales: {
          y: {
            min: 0,
            max: 6,
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              font: {
                size: 24,
              },
              color: '#000000',
              padding: 10,
            },
          },
          x: {
            ticks: {
              font: {
                size: 32,
              },
              color: '#000000',
              padding: 10,
            },
          },
        },
      },
    };
    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(config);
    return imageBuffer;
}

// async function generateOverallITSMModuleChart(overallITSMModule, title) {
//     const configuration = {
//         type: 'bar',
//         data: {
//           labels: [
//              'People','Process','Technology','Aggregated Score'
//        ],
//             datasets: [
//                 {
//                     label: 'People',
//                     data: [overallITSMModule.overallPeople],
//                     backgroundColor: '#455CFF',
//                     barPercentage: 0.2, // Adjusts individual bar width
//                     categoryPercentage: 1, // Adjusts group width
//                 },
//                 {
//                     label: 'Process',
//                     data: [overallITSMModule.overallProcess],
//                     backgroundColor: '#D9D9D9',
//                     barPercentage: 0.2, // Adjusts individual bar width
//                     categoryPercentage: 1, // Adjusts group width
//                 },
//                 {
//                     label: 'Technology',
//                     data: [overallITSMModule.overallTechnology],
//                     backgroundColor: '#141414',
//                     barPercentage: 0.2, // Adjusts individual bar width
//                     categoryPercentage: 1, // Adjusts group width
//                 },
//                 {
//                     label: 'Aggregated Score',
//                     data: [overallITSMModule.overallScore],
//                     backgroundColor: '#DEFF00',
//                     barPercentage: 0.2, // Adjusts individual bar width
//                     categoryPercentage: 1, // Adjusts group width
//                 }
//             ]
//         },
//         plugins: [ChartDataLabels],
//         options: {
//             plugins: {
//                 title: {
//                     display: true,
//                     text: title,
//                     font: {
//                         color: '#000000',
//                         size: 46,
//                     },
//                 },
//                 legend: { position: 'top', labels: { boxWidth: 30, padding: 10, font: { size: 34 }, color: '#000' } },
//                 datalabels: {
//                     display: true,
//                     anchor: 'end',
//                     align: 'top',
//                     color: 'black',
//                     font: {
//                         size: 30,
                       
//                     },
//                     formatter: function(value){
//                         return value.toFixed(2);
//                     },
//                 },
//             },
//             scales: {
//                 y: {
//                     min: 0,
//                     max: 6,
//                     beginAtZero: true,
//                     ticks: {
//                         stepSize: 1,
//                         font: {
//                             size: 24,
//                         },
//                         color: '#000000',
//                         padding: 10,
//                     },
//                 },
//                 x: {
//                     ticks: {
//                         font: {
//                             size: 32,
//                         },
//                         color: '#000000',
                       
//                     },
//                 },
//             },
//         },
//     };

//     const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);
//     return imageBuffer;
// }
async function generateOverallITSMModuleChart(overallITSMModule, title) {
  const configuration = {
      type: 'bar',
      data: {
          labels: ['People', 'Process', 'Technology', 'Aggregated Score'], // X-axis labels
          datasets: [
              {
                  label: 'ITSM Module Score',
                  data: [
                      overallITSMModule.overallPeople, 
                      overallITSMModule.overallProcess, 
                      overallITSMModule.overallTechnology, 
                      overallITSMModule.overallScore
                  ], // Corresponding Y-axis values
                  backgroundColor: ['#455CFF', '#D9D9D9', '#141414', '#DEFF00'], // Color for each bar
                  barPercentage: 0.5, // Adjusts individual bar width
                  categoryPercentage: 0.8, // Adjusts group width
              },
          ],
      },
      plugins: [ChartDataLabels],
      options: {
          plugins: {
              title: {
                  display: true,
                  text: title,
                  font: {
                      size: 46,
                  },
                  color: '#000000',
              },
              legend: {
                  display: false, // Hide legend as it is redundant with one dataset
              },
              datalabels: {
                  display: true,
                  anchor: 'end',
                  align: 'top',
                  color: 'black',
                  font: {
                      size: 30,
                  },
                  formatter: function (value) {
                      return value.toFixed(2);
                  },
              },
          },
          scales: {
              y: {
                  min: 0,
                  max: 6,
                  beginAtZero: true,
                  ticks: {
                      stepSize: 1,
                      font: {
                          size: 24,
                      },
                      color: '#000000',
                      padding: 10,
                  },
              },
              x: {
                  ticks: {
                      font: {
                          size: 32,
                      },
                      color: '#000000',
                  },
              },
          },
      },
  };

  const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);
  return imageBuffer;
}


// async function generateCurrentlyImplementedITSMModulesChart(currentlyImplementedITSMModules, title) {
//     const configuration = {
//         type: 'bar',
//         data: {
//           labels: [
//             `         People                                    Process                               Technology                       Aggregated Score`
//        ],
//             datasets: [
//                 {
//                     label: 'People',
//                     data: [currentlyImplementedITSMModules.implementedPeople],
//                     backgroundColor: '#455CFF',
//                     barPercentage: 0.2, // Adjusts individual bar width
//                     categoryPercentage: 1, // Adjusts group width
//                 },
//                 {
//                     label: 'Process',
//                     data: [currentlyImplementedITSMModules.implementedProcess],
//                     backgroundColor: '#D9D9D9',
//                     barPercentage: 0.2, // Adjusts individual bar width
//                     categoryPercentage: 1, // Adjusts group width
//                 },
//                 {
//                     label: 'Technology',
//                     data: [currentlyImplementedITSMModules.implementedTechnology],
//                     backgroundColor: '#141414',
//                     barPercentage: 0.2, // Adjusts individual bar width
//                     categoryPercentage: 1, // Adjusts group width
//                 },
//                 {
//                     label: 'Aggregated Score',
//                     data: [currentlyImplementedITSMModules.implementedScore],
//                     backgroundColor: '#DEFF00',
//                     barPercentage: 0.2, // Adjusts individual bar width
//                     categoryPercentage: 1, // Adjusts group width
//                 }
//             ]
//         },
//         plugins: [ChartDataLabels],
//         options: {
//             plugins: {
//               legend: { position: 'top', labels: { boxWidth: 30, padding: 10, font: { size: 34 }, color: '#000' } },
//                 datalabels: {
//                     display: true,
//                     anchor: 'end',
//                     align: 'top',
//                     color: 'black',
//                     font: {
//                         size: 30,
                       
//                     },
//                     formatter: function(value) {
//                         return value.toFixed(2);
//                     },
//                 },
//             },
//             scales: {
//                 y: {
//                     min: 0,
//                     max: 6,
//                     beginAtZero: true,
//                     ticks: {
//                         stepSize: 1,
//                         font: {
//                             size: 24,
//                         },
//                         color: '#000000',
//                         padding: 10,
//                     },
//                 },
//                 x: {
//                     ticks: {
//                         font: {
//                             size: 32,
//                         },
//                         color: '#000000',
                     
//                     },
//                 },
//             },
//         },
//     };

//     const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);
//     return imageBuffer;
// }
async function generateCurrentlyImplementedITSMModulesChart(currentlyImplementedITSMModules, title) {
  const configuration = {
      type: 'bar',
      data: {
          labels: ['People', 'Process', 'Technology', 'Aggregated Score'], // X-axis labels
          datasets: [
              {
                  label: 'Currently Implemented ITSM Modules',
                  data: [
                      currentlyImplementedITSMModules.implementedPeople,
                      currentlyImplementedITSMModules.implementedProcess,
                      currentlyImplementedITSMModules.implementedTechnology,
                      currentlyImplementedITSMModules.implementedScore
                  ], // Corresponding Y-axis values
                  backgroundColor: ['#455CFF', '#D9D9D9', '#141414', '#DEFF00'], // Color for each bar
                  barPercentage: 0.5, // Adjusts individual bar width
                  categoryPercentage: 0.8, // Adjusts group width
              },
          ],
      },
      plugins: [ChartDataLabels],
      options: {
          plugins: {
              title: {
                  display: true,
                  text: title,
                  font: {
                      size: 46,
                  },
                  color: '#000000',
              },
              legend: {
                  display: false, // Hide legend since there's one dataset
              },
              datalabels: {
                  display: true,
                  anchor: 'end',
                  align: 'top',
                  color: 'black',
                  font: {
                      size: 30,
                  },
                  formatter: function (value) {
                      return value.toFixed(2);
                  },
              },
          },
          scales: {
              y: {
                  min: 0,
                  max: 6,
                  beginAtZero: true,
                  ticks: {
                      stepSize: 1,
                      font: {
                          size: 24,
                      },
                      color: '#000000',
                      padding: 10,
                  },
              },
              x: {
                  ticks: {
                      font: {
                          size: 32,
                      },
                      color: '#000000',
                  },
              },
          },
      },
  };

  const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);
  return imageBuffer;
}


module.exports = {
    generateITSMInvestmentScoresChart,
    generateOverallITSMModuleChart,
    generateCurrentlyImplementedITSMModulesChart,
};