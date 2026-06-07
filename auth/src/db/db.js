import mongoose from 'mongoose'
import _config from '../config/config.js';
import  dns from 'dns';

dns.setServers(['8.8.8.8'])

export async function connectToDB() {
    try {
        await mongoose.connect(_config.MONGO_URI)
        console.log(' connected to db ✔');
    } catch (error) {
        console.error('error connecting to db ❌');
        
    }
}

export default connectToDB