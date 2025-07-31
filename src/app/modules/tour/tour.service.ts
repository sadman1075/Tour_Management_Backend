import { ITour } from "./tour.interface";
import { Tour } from "./tour.model";

const create = async (payload: ITour) => {
    console.log(payload);
    const existingTour = await Tour.findOne({ title: payload.title })
    if (existingTour) {
        throw new Error("A tour with this title already exists.");
    }
    

    const tour = await Tour.create(payload)

    return tour

}


const update = async (id: string, payload: ITour) => {
    const existingTour = await Tour.findById(id)
    if (!existingTour) {
        throw new Error("Tour not found.");
    }

    const updateTour = await Tour.findByIdAndUpdate(id, payload)

    return updateTour

}

const getAllTour = async () => {
    const allTour = await Tour.find({})
    return allTour
}

export const tourService = {
    create,
    update,
    getAllTour
}