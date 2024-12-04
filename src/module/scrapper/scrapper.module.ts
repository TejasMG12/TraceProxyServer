import mongoose from "mongoose";

const DataSchema = new mongoose.Schema({ keyword: String, results: Object });
const Data = mongoose.model('Data', DataSchema);

export default Data;