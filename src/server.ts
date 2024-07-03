import app from './app';
import * as dotenv from 'dotenv';

const path = process.env.NODE_ENV !== 'development' ? `./config/.env.${process.env.NODE_ENV}` : `./config/.env`;
dotenv.config({ path });

app.listen(9009, () => {
    console.log(`server is running on http://localhost:9009`);
});
