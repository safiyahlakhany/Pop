/*
 * A single line stacked bar chart for the main feed page. This chart displays the 
 * poll replies in a succinct way. 
 * 
 * @parameters: data object array with inner objects that have a string name and numerical data value. 
 * renders a div with a single line bar chart 
*/
// @ts-nocheck
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface ChartProps{
    data: { name: string; data: number; }[]
}

interface ChartState{
    options: {}
 }
 
export default class NarrowChart extends React.Component<ChartProps> {
    constructor(props: ChartProps, state: ChartState) {
        super(props, state);
          this.state = {
              options: {}
          };
     }
  
      componentDidMount() { 
          this.getOptions();
      }
  
      componentDidUpdate(prevProps: ChartProps) {
          if (this.props.data !== prevProps.data) {
              this.getOptions();
          }
      }
  
      render(){
          return(
              <div>
                  <HighchartsReact highcharts={Highcharts} options={this.state.options} />
              </div>
          )
      }
  
      private getOptions() {
          let formatted = this.formattedData();
          let categoryData = formatted.map((item) => {
              return item.name;
          })
  
          const updateOptions =  {
            chart: {
              type: 'bar',
              height: 110,
            },
            legend: {
                reversed: 'true'
            },
            title: {
              text: ''
            },
            plotOptions: {
              series: {
                stacking: 'normal',
                borderRadius: 5
              }
            },
            xAxis: {
                categories: categoryData
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + ': ' + this.y;
                }
            },
            colors: ["#ED7A70", "#BADEF8","#5799EE"],
            xAxis: {
                visible: false,
            },
            yAxis: {
                visible: false,
            },
            series: formatted
          };
  
          this.setState((state, props) => ({
              options: updateOptions
          }));
      }
  
      /*
       * formats data to fit into high charts series. 
       */ 
      private formattedData = () => {
        let newData: { name: string; data: number[]}[] = [];
        this.props.data.forEach((item) => {
            let numericalData = [item.data];
            let newItem = {
                name: item.name,
                data: numericalData
            }
            newData.push(newItem);
        })
        return newData;
      }
}