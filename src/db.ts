import mongoose from 'mongoose'
import models from './models'

const uri = process.env.MONGOLAB_URI || 'mongodb+srv://test_unknown:123qwe@mytestdb-shqsn.mongodb.net/test?retryWrites=true&w=majority';

export async function connectDb() {
    await mongoose.connect(uri,  { useNewUrlParser: true });
    console.log('connected to mongoose');
}

export default models;
