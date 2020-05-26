import { Request, Response } from 'express';
import fetch, { RequestInit } from 'node-fetch';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status-codes';

import models from '../db';
import { validationResult } from 'express-validator';
import { IUser } from '../models/user-model';

const Users = models.Users;
const saltRounds = process.env.SALT_ROUNDS || 10;

interface IApiUser {
    name: {
        title: string,
        first: string,
        last: string,
    },
    gender: string,
    email: string,
    picture: {
        large: string,
        medium: string,
        thumbnail: string
    },
    login: {
        password: string,
    },
}

function castApiUserToUser(apiUser: IApiUser): Partial<IUser> {
    return {
        name: apiUser.name,
        gender: apiUser.gender,
        email: apiUser.email,
        picture: apiUser.picture,
    }
}

const userController = {
    async generate(_req: Request, res: Response) {
        const options: RequestInit = {
            method: 'GET'
        };
        const newUser = (await fetch('https://randomuser.me/api/', options).then(res => res.json())).results[0] as IApiUser;
        const password = (await bcrypt.hash(newUser.login.password, saltRounds));
        let savedUser = new Users({ ...castApiUserToUser(newUser), password });
        savedUser = await savedUser.save();
        savedUser.password = undefined;
        res.send(savedUser);
    },
    async get(_req: Request, res: Response) {
        res.send(await Users.find({ removed: false }, '-password'));
    },
    async put(req: Request, res: Response) {
        const updates = req.body;
        if (updates.password) {
            updates.password = (await bcrypt.hash(updates.password, saltRounds));
        }
        try {
            res.send(await Users.findOneAndUpdate({_id: req.params.userId},
                updates,
                {new: true, projection: '-password'}));
        } catch (e) {
            res.status(httpStatus.BAD_REQUEST).send();
        }
    },
    async delete(req: Request, res: Response) {
        try {
            res.send(await Users.findOneAndUpdate({ _id: req.params.userId }, { removed: true }));
        } catch (e) {
            res.status(httpStatus.BAD_REQUEST).send();
        }
    },
    async login(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).send({ errors: errors.array() });
            return;
        }
        const maybeUser = await Users.findOne({ email: req.body.email });
        if (maybeUser && maybeUser.password) {
            const isValidPassword = await bcrypt.compare(req.body.password, maybeUser.password);
            if (isValidPassword) {
                res.send(maybeUser);
            } else {
                res.status(httpStatus.UNAUTHORIZED).send();
            }
        } else {
            res.status(httpStatus.UNAUTHORIZED).send();
        }
    }
}

export { userController };
