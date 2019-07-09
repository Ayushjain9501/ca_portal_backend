import { MONGODB_URI } from "./keys";

function mongooseConfig(mongoose: any) {
    mongoose.connect(MONGODB_URI, {useNewUrlParser: true});
    mongoose.connection.on( 'error', console.error.bind(console, '<====== Mongoose error: '));
    mongoose.connection.once( 'open', () => {
        console.log("<===== Connected to database ====>");
    })
}

export = mongooseConfig;