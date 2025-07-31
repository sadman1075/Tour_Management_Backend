import AppError from "../../../error_helpers/AppError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import httpStatus from "http-status-codes"


const create = async (payload: IDivision) => {
    
    const isDivisionExist = await Division.findOne({ name: payload.name })
    if (isDivisionExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "division Already Exist")
    }

    const division = await Division.create(payload)
    return division;
}

const update = async (id: string, payload: IDivision) => {

    const existingDivision = await Division.findById(id);
    if (!existingDivision) {
        throw new Error("Division not found.");
    }

    const duplicateDivision = await Division.findOne({ name: payload.name, _id: { $ne: id } })

    if (duplicateDivision) {
        throw new Error("A division with this name already exists.");

    }
    const updateDivision = await Division.findByIdAndUpdate(id, payload)


    return updateDivision;
}

const getAllDivision = async () => {
    const allDivision = await Division.find({})
    const totalDivision = await Division.countDocuments();
    return {
        data: allDivision,
        meta: {
            total: totalDivision
        }
    }
}

const getSingleDivision = async (payload: IDivision) => {
    const { slug } = payload
    const singleDivision = await Division.findOne({ slug })
    return {
        singleDivision
    }
}

const updateDivision = async (id: string, payload: Partial<IDivision>) => {

    const existingDivision = await Division.findById(id);
    if (!existingDivision) {
        throw new Error("Division not found.");
    }

    const duplicateDivision = await Division.findOne({
        name: payload.name,
        _id: { $ne: id },
    });

    if (duplicateDivision) {
        throw new Error("A division with this name already exists.");
    }


    const updatedDivision = await Division.findByIdAndUpdate(id, payload, { new: true, runValidators: true })

    return updatedDivision

};


const deleteDivision = async (id: string) => {

    await Division.findByIdAndDelete(id)
    return null
}

export const divisionService = {
    create,
    update,
    deleteDivision,
    getAllDivision,
    getSingleDivision,
    updateDivision
}