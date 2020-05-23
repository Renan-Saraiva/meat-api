import * as mongoose from 'mongoose'
import { Restaurant } from '../restaurants/restaurants.model';
import { User } from '../users/users.model';


export interface Review extends mongoose.Document {
    date: Date;
    rating: number;
    comments: string;
    restaurant: mongoose.Types.ObjectId | Restaurant;
    user: mongoose.Types.ObjectId | User;
}

const reviewsSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comments: {
        type: String,
        required: true,
        maxlength: 500
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Restaurant'        
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

export const Review = mongoose.model<Review>('Review', reviewsSchema);