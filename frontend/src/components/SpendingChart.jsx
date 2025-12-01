import { Line } from "recharts"
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const SpendingChart = ({expenses})=>{


    //last 7 days
    const last7days = [...Array(7)].map((_,i)=>{
        const date = new Date();
        date.setDate(date.getDate() - (6-i));

        return date.toISOString().split('T')[0];


    })
    const chartData = last7days.map((date)=>{
        const dayExpenses = (expenses || []).filter((e)=>{
            const d = e.date? String(e.date):"";
            return d.split('T')[0] === date || d === date
        });
        const total = dayExpenses.reduce((sum,e)=> sum + Number(e.amount || 0),0);

        return{
            date: new Date(date).toLocaleDateString("en-US", {weekday:"short"}),
            amount: parseFloat(total.toFixed(2)),
        };



    });

    return(
    <div className="bg-white rounded-2xl p-6 shadow-lg border-gray-100">
        <div className = "flex items-center justify-between mb-6">
            <div>
                <h3 className="text-xl font-bold text-gray-900">Weekly Spending</h3>
                <p className="text-sm text-gray-500 mt-1">Last 7 days trend</p>
            </div>
        </div>
        <ResponsiveContainer width ="100%" height={260}>
            <LineChart data = {chartData}>
                <defs>
                    <linearGradient id = "lineGradient" x1 = "0" y1 = "0" x2 = "1" y2 = "0">
                        <stop offset = "0%" stopColor = "#6366F1"/>
                        <stop offset = "100%" stopColor = "#8B5CF6"/>

                    </linearGradient>
                </defs>
                <CartesianGrid
                strokeDasharray = "3 3"
                stroke = "#f0f0f0"
                vertical = {false}
                />
                <XAxis
                dataKey = 'date'
                stroke="#9CA3AF"
                fontSize= {12}
                tickline = {false}
                
                />
                <YAxis stroke = "#9CA3AF" fontsize = {12} tickline={false}/>
                <Tooltip formatter ={(value)=>[`₹${value}`,"Spent"]}/>
                < Line
                type = "monotone"
                dataKey = "amount"
                stroke = "url(#lineGradient)"
                strokeWidth = {4}
                dot={{fill:"#6366F1",r:5,strokeWidth:3,stroke:"#fff"}}
                activeDot={{r:7}}
                
                />  
            </LineChart>
        </ResponsiveContainer>
    </div>)





}
export default SpendingChart