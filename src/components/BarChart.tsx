// @ts-nocheck
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface ChartProps{
    data: { name: string; data: number; }[]
    postOptions: any;
}

interface ChartState{
   options: {}
}

const colorOptionsArray = ["#5799EE", "#BADEF8","#ED7A70"];

const optionz = {
    chart: {
        type: 'column'
    },
    title: {
        text: ''
    },
    yAxis: {
        min: 0,
        title: {
            text: 'percentage (%)'
        }
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0,
            borderRadiusTop: 10,
            borderRadiusBottom: 0
        },
        series: {
            colorByPoint: true,
            allowPointSelect: false
        }
    }
}

export default class D3Chart extends React.Component<ChartProps, ChartState> {
   constructor(props: ChartProps, state: ChartState) {
        super(props, state);
        this.state = {
            options: {}
        };
        if(this.props.postOptions){
            Object.entries(this.props.postOptions).map((item) =>
            {
              let pushItem = (item[0])
              this.myArray.unshift(pushItem)
            });
        }
        
   }
   private finalColorArray:Array<string>=[];
   
   private myArray:Array<string> =[];
   // [op1,op2,op3]
   // [dark,light,pink]
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
        let seriesData = formatted.data;
        let categoryData = formatted.category;

        const updateOptions =  {
            ...optionz,
            xAxis: {
                categories: categoryData,
                crosshair: true
            },
            series: [ {data: seriesData, colors: this.finalColorArray, name: "percent"} ],      
            tooltip: {
                formatter: function () {
                    return '<b>' + this.y + '%';
                }
            }          
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
        let otherNewData: { name: string; data: number; }[] = [];
        let total: number = 0;
        let categoryData: string[] = [];
        this.finalColorArray = [];

        for(let i:Number = 0; i < this.myArray.length;  i+=1)
        {
            for(let j:Number = 0; j < this.props.data.length;  j+=1)
            {
                if(this.props.data[j].name === String(this.myArray[i]))
                {
                    otherNewData.push(this.props.data[j]);
                    if(this.props.data.length === 2)
                    {
                        this.finalColorArray.push(colorOptionsArray[i + 1]);
                    }
                    else if(this.props.data.length === 3)
                    {
                        this.finalColorArray.push(colorOptionsArray[i]);
                    }
                }
            }
        }
        
        if(otherNewData){
            otherNewData.forEach((item) => {
                total += item.data;
                categoryData.push(item.name);
                newData.push(item.data);
            });
        }

        let percentageData: number[] = newData.map((item) => {
            let result = ((item / total) * 100).toFixed(2)
            return parseInt(result);
        });

        let result = {
            data: percentageData,
            category: categoryData,
        }
        
        return result;
    }
}