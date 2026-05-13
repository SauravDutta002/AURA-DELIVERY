import mongoose from "mongoose";

const DroneStatusSchema = new mongoose.Schema({
  droneId:{ type:String, required:true, unique:true },
  booked:{ type:Boolean, default:false },
  confirmed:{ type:Boolean, default:false },
  userLat:{ type:Number, default:null },
  userLng:{ type:Number, default:null }
},{ timestamps:true });

export default mongoose.model("DroneStatus", DroneStatusSchema);
