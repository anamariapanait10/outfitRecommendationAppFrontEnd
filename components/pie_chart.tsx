import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import { PieChart } from 'react-native-chart-kit';

export default function MyPieChart(props: { data: any[]; }) {
    return (
        <View>
        <PieChart
            data={props.data}
            width={Dimensions.get('window').width - 50}
            height={150}
            chartConfig={{
                color: (opacity = 3) => `rgba(255, 255, 255, ${opacity})`
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            />
        </View>
    )
}