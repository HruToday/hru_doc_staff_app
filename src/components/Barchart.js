import React from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import {greenColor, whiteColor} from '../common/Color';

const BarChartExample = ({mapdata}) => {
  const screenWidth = Dimensions.get('window').width;
  const yValues = mapdata.map(item => item.y);


  const data = {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
      'Dec',
    ],
    datasets: [
      {
        data: yValues,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: whiteColor,
    backgroundGradientFrom: whiteColor,
    backgroundGradientTo: whiteColor,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(93, 109, 126, ${opacity})`,

    strokeWidth: 1,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForLabels: {
      fontSize: 9,
     
     
    },
    propsForBackgroundLines: {
      strokeWidth: 0, // Removes the dotted background lines
      stroke: 'transparent', // Hides the lines completely
    },
  
    spacingInner: 0.3, // Decrease this value to reduce the width of the bars
    spacingOuter: 0.1, 
  };

  return (
   
      <BarChart
        data={data}
        width={screenWidth - 10}
        height={250}
        yAxisLabel=""
        chartConfig={chartConfig}
        barPercentage={0.5}
      />
  
  );
};




export default BarChartExample;
