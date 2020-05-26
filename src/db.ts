import mongoose from 'mongoose'
import models from './models'

const uri = process.env.MONGOLAB_URI || '';

export async function connectDb() {
    await mongoose.connect(uri,  { useNewUrlParser: true });
    console.log('connected to mongoose');
}

export default models;
