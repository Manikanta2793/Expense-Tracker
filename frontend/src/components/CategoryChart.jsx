import React from "react";
import {PieChart,Pie,Cell,Tooltip,ResponsiveContainer} from "recharts";

const COLORS = ["#0088FE","#00C49F","#FFBB28","#FF8042","#A78BFA"];

const CategoryChart = ({categoryTotal})=>{

    const data = Object.entries(categoryTotal || {}).map(
        ([name, value], index) => ({
            name,
            value,
            color:COLORS[index % COLORS.length],
        })
    );




    return(
        <div className="bg-white rounded-2xl p-6 shadow-lg border
        border-gray-100">
            <h3 className = "text-xl font-bold text-gray-900 mb-6">Category Distribution</h3>
            <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                    <Pie
                    data ={data}
                    cx = "50%"
                    cy ="50%"
                    innerRadius = {60}
                    outerRadius = {90}
                    paddingAngle = {3}
                    dataKey = "value">
                        {data.map((entry,index)=>(
                            <Cell key= {`cell-${index}`} fill ={entry.color}/>
                        ))}

                    </Pie>
                    <Tooltip formatter={(value)=>` ₹${value.toFixed(2)}`}/>
                </PieChart>

            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-3 mt-6">
                {/* I will use map method*/}
                {data.map((item)=>{
                    return(
                        <div className = "flex items-center gap-2">
                    <div className = "w-3 h-4 rounded" style = {{backgroundColor:item.color}}></div>
                    <span className = "text-xs font-semibold text-gray-700">{item.name}</span>

                </div>
                    );


                })}
                

            </div>

            

        </div>
    )






}
export default CategoryChart