import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt';
import { validateCPF } from '../common/validators'
import { environment } from '../common/environment'

export interface User extends mongoose.Document {
    name: string;
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 80,
        minlength: 3
    },
    email: {
        type: String,
        unique: true,
        required: true,        
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password: {
        type: String,
        select: false,
        required: true
    },
    gender: {
        type: String,
        required: false,
        enum: ['Male','Female']
    },
    cpf: {
        type: String,
        required: false,
        validate: {
            validator: validateCPF,
            message: '{PATH}: Invalid CPF ({VALUE})'
        }
    }
});


const hashPassword = (obj, next) => {
    bcrypt.hash(obj.password, environment.server.security.saltRounds)
               .then(hash => {
                    obj.password = hash
                    next();
               }).catch(next);
}

const saveMidlleware = function(next) {
    const user: any = this;

    if (!user.isModified('password'))
        next();
    else
        hashPassword(user, next);
}

const updateMidlleware = function(next) {
    if (!this.getUpdate().password) //Recupera o password do objeto de update
        next();
    else  
        hashPassword(this.getUpdate(), next);
}

userSchema.pre('save', saveMidlleware);
userSchema.pre('findOneAndUpdate', updateMidlleware);
userSchema.pre('update', updateMidlleware);

export const User = mongoose.model<User>('User', userSchema);