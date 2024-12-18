import { Profile } from '../model/profile';
import profileDb from '../repository/profile.db';
import { ProfileInput } from '../types';
import categoryService from './category.service';
import locationService from './location.service';
import userService from './user.service';

const completeProfile = async (userName: string, profileInput: ProfileInput) => {
    const category = await categoryService.addCategory({
        name: profileInput.category.name,
        description: profileInput.category.description,
    });
    const user = await userService.getUserByUserName({ userName });

    const location = await locationService.addLocation({
        street: profileInput.location.street,
        number: profileInput.location.number,
        city: profileInput.location.city,
        country: profileInput.location.country,
    });
    const profile = new Profile({
        firstName: profileInput.firstName,
        lastName: profileInput.lastName,
        age: profileInput.age,
        category,
        location,
    });
    return await profileDb.addProfile(user.getId(), profile);
};

const getEventsByProfile = async (id: number) => {
    return await profileDb.getEventsByProfile(id);
};

export default { completeProfile, getEventsByProfile };
