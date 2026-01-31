import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'database.json');

// Initialize DB if not exists
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], rides: [] }, null, 2));
}

const readDB = () => {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return { users: [], rides: [] };
    }
};

const writeDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

export const db = {
    getUsers: () => readDB().users,
    addUser: (user) => {
        const data = readDB();
        data.users.push(user);
        writeDB(data);
        return user;
    },
    findUser: (predicate) => readDB().users.find(predicate),
    findUsers: (predicate) => readDB().users.filter(predicate),
    updateUser: (id, updates) => {
        const data = readDB();
        const index = data.users.findIndex(u => u.id === id || u._id === id);
        if (index !== -1) {
            data.users[index] = { ...data.users[index], ...updates };
            writeDB(data);
            return data.users[index];
        }
        return null;
    },

    getRides: () => readDB().rides,
    addRide: (ride) => {
        const data = readDB();
        data.rides.push(ride);
        writeDB(data);
        return ride;
    },
    findRide: (predicate) => readDB().rides.find(predicate),
    findRides: (predicate) => readDB().rides.filter(predicate),
    updateRide: (id, updates) => {
        const data = readDB();
        const index = data.rides.findIndex(r => r.id === id || r._id === id);
        if (index !== -1) {
            data.rides[index] = { ...data.rides[index], ...updates };
            writeDB(data);
            return data.rides[index];
        }
        return null;
    }
};
