import { MongoClient } from 'mongodb';

class DBClient {
    constructor() {
        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || 27017;
        const database = process.env.DB_DATABASE || 'files_manager';

        const uri = `mongodb://${host}:${port}/${database}`;

        this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        this.db = null;

        // Connect to MongoDB
        this.connect();
    }

    async connect() {
        try {
            await this.client.connect();
            this.db = this.client.db();
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('MongoDB connection error:', error);
        }
    }

    // Check if connection to MongoDB is alive
    isAlive() {
        return this.db !== null && this.client.isConnected();
    }

    // Get the number of documents in the users collection
    async nbUsers() {
        try {
            const count = await this.db.collection('users').countDocuments();
            return count;
        } catch (error) {
            console.error('Error counting users:', error);
            return -1;
        }
    }

    // Get the number of documents in the files collection
    async nbFiles() {
        try {
            const count = await this.db.collection('files').countDocuments();
            return count;
        } catch (error) {
            console.error('Error counting files:', error);
            return -1;
        }
    }
}

const dbClient = new DBClient();

export default dbClient;

