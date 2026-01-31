import mongoose from 'mongoose';

const connectDB = async () => {
    try {

        mongoose.connection.on('connected', () => console.log('database  connected '));
        await mongoose.connect(`${process.env.MONGODB_URI}/KISAN3`)
    }
    catch (error) {

       console.log(error.message) ;   }
}

export default connectDB;