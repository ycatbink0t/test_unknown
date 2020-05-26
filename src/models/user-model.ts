import mongoose from 'mongoose';

export interface User extends mongoose.Document {
    name: {
        title: string;
        first: string;
        last: string;
    };
    gender: string;
    email: string;
    picture: {
        large: string;
        medium: string;
        thumbnail: string;
    };
    password?: string;
    removed?: boolean;
}

const user = new mongoose.Schema({
    name: {
        title: { type: 'String' },
        first: { type: 'String' },
        last: { type: 'String' },
    },
    gender: { type: 'String' },
    email: { type: 'String', unique: true },
    picture: {
        large: {
            type: 'String',
        },
        medium: {
            type: 'String',
        },
        thumbnail: {
            type: 'String',
        },
    },
    password: { type: 'String' },
    removed: { type: 'Boolean', default: false },
});

export default mongoose.model<User>('users', user);
