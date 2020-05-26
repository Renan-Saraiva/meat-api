import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt';
import { validateCPF } from '../common/validators'
import { environment } from '../common/environment'

export interface User extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    profiles: string[];
    matches(password: string): boolean;
    hasAny(...profiles: string[]): boolean;
}

export interface UserModel extends mongoose.Model<User> {
    findByEmail(email: string, projection?: string) : Promise<User>    
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
    },
    profiles: {
        type: [String],
        required: false
    }
});

userSchema.statics.findByEmail = function (email: string, projection?: string) {
    return this.findOne({email}, projection);
}

userSchema.methods.matches = function (password: string): boolean {
    return bcrypt.compareSync(password, this.password)
}

userSchema.methods.hasAny = function (...profiles: string[]): boolean {
    return profiles.some(profile => this.profiles.indexOf(profile) !== -1);
}

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

export const User = mongoose.model<User, UserModel>('User', userSchema);