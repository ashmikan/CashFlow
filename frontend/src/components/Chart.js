import {Pie} from "react-chartjs-2";
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function ExpenseChart({transactions}){

let income = 0;
let expense = 0;

transactions.forEach(t=>{

if(t.amount > 0)
income += Number(t.amount);

else
expense += Number(t.amount);

});

const data = {

labels:["Income","Expense"],

datasets:[{

data:[income,Math.abs(expense)],

backgroundColor:[
"green",
"red"
]

}]

};

const options = {
responsive: true,
maintainAspectRatio: false,
};

return (
<div style={{ width: "400px", height: "400px", margin: "0 auto" }}>
<Pie data={data} options={options} />
</div>
);

}

export default ExpenseChart;