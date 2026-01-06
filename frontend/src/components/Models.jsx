import { ReceiptIndianRupeeIcon } from "lucide-react";
import  { useEffect ,useState } from "react";
import { X } from "lucide-react";

const Model = ({isOpen, onClose , onSubmit , intialData})=>{

    const categories = ["Food", "Transportation", "Shopping", "Bills", "Healthcare", "Other"];
    
    const empty ={
        description:'',
        amount:"",
        category:"Food",
        date: new Date().toISOString().split("T")[0],
        notes:""

    }
    const [formData, setFormData] = useState(intialData || empty);
    useEffect(()=>{
        setFormData(intialData || empty);

    },[intialData]);
    if(!isOpen) return null;

    const handleSubmit = () =>{
        if(!formData.description || !formData.amount){
            alert("Please fill required field")
            return;
        }
        onSubmit({...formData,amount:parseFloat(formData.amount)});
    }
    return(
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-lg z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{intialData ? "Edit Expense": "Add Expense"}</h2>
                        <p className="text-sm text-gary-500 mt-1">Track you spending</p>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition"onClick ={onClose}>
                        <X className="w-5 h-5"  />

                    </button>

                </div>
                <div className= "space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            What did you buy?

                        </label>
                        <input type="text" placeholder="Enter description"
                        value={formData.description}
                            onChange={(e)=>setFormData({...formData,description:e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-20
                        rounded-xl focus:outline-none focus:border-indigo-500"/>

                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className= "block text-sm font-bold text-gray-700 mb-2">Amount</label>
                        
                        <div className="relative">
                            <ReceiptIndianRupeeIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"/>
                            <input type = "number" placeholder="0.00"
                            value={formData.amount}
                            onChange={(e)=>setFormData({...formData,amount:e.target.value})}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-online
                            focus:border-indigo-500"/>

                        </div>
                        </div>
                        <div>
                            <label className= "block text-sm font-bold text-gray-700 mb-2">Date</label>
                        
                        <div className="relative">
                            
                            <input type = "date" 
                            value={formData.date}
                            onChange={(e)=>setFormData({...formData,date:e.target.value})}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-online
                            focus:border-indigo-500"/>

                        </div>
                        </div>

                        <div>
                            <label className= "block text-sm font-bold text-gray-700 mb-2">Category</label>
                        
                        <div className="flex flex-wrap gap-2">
                            {/* {Iwill use map method} */}
                            {categories.map((cat)=>{
                                return(<button key={cat} type="button"
                                    onClick={()=> setFormData({...formData, category:cat})}
                                className ={`p-3 py-2.5 rounded-xl text-xs font-bold transition-all ${formData.category === cat? "bg-indigo-600 text-white scale-105 shadow-lg":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                                    {cat}
                                

                            </button>)
                            })}
                            
                            
                            

                        </div>
                        </div>
                         



                    </div>
                    
                    <div>
                            <label className= "block text-sm font-bold text-gray-700 mb-2">Note(optional)</label>
                        
                        <div className="relative">
                            
                            <textarea placeholder="Add notes...."
                            value={formData.notes}
                            rows ={2}
                            onChange={(e)=>setFormData({...formData,notes:e.target.value})}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none
                            focus:border-indigo-500"/>

                        </div>
                        <div className ="flex gap-3 mt-4">
                            <button onClick={handleSubmit} className="flex-1 bg-gray-700 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition">
                                {intialData ? "Update Expense" : "Add Expense"}
                            </button>
                            <button onClick={onClose} className=" px-4 py-3 rounded-xl border font-semibold hover:bg-gray-50 transition">
                                Cancel
                            </button>

                        </div>
                        </div>
                </div>



            </div>

        </div>
    )




}
export default Model