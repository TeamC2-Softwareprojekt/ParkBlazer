import axios from "axios";
import AuthService from "../utils/AuthService";

export interface review {
    review_id: number;
    parkingspot_id: number;
    username: number;
    rating: number;
    comment: string;
    created_date: string;
};

let reviews: review[] = [];

export async function initReviews() {
    if (reviews?.length > 0) return;

    try {
        const response = await axios.get('https://server-y2mz.onrender.com/api/get_reviews');
        setReviews(response.data);
    } catch (error) {
        console.error('Error while fetching reviews', error);
    }
}

export function getReviews() {
    return reviews;
}

function setReviews(newReviews: review[]) {
    reviews = newReviews;
}

export function getReviewsOfParkingspot(parkingspot_id: number) {
    return reviews.filter(r => r.parkingspot_id === parkingspot_id);
}

export function getAverageRatingOfParkingspot(parkingspot_id: number) {
    const parkingspotReviews = getReviewsOfParkingspot(parkingspot_id);

    if (!parkingspotReviews.length) return 0;

    const totalRating = parkingspotReviews.reduce((acc: any, curr: any) => acc + curr.rating, 0);

    return totalRating / parkingspotReviews.length;
}

export async function createReview(rating: number, comment: string, parkingspot_id: number) {
    try {
        const token = AuthService.getToken();
        await axios.post('https://server-y2mz.onrender.com/api/create_review', {
            rating: rating,
            comment: comment,
            parkingspot_id: parkingspot_id,
        },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        return true;
    } catch (error: any) {
        console.error("There was an error submitting the rating:", error);
        return false;
    }
}