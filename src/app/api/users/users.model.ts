import { HashService } from '@core/helpers';
import { BaseModel, Entity, Field } from '@lib/mongoose';
import { ValidationPatterns } from '@shared/common';

import { parsePhoneNumberFromString } from 'libphonenumber-js';

@Entity('users')
export class UsersSchema {
    @Field({ select: false }) public password: string;
    @Field({
        match: [ValidationPatterns.NoSpecialChar, 'Value contain special char'],
        unique: true,
    }) public username: string;
    @Field({
        match: [ValidationPatterns.EmailValidation, 'Please provide a valid email address'],
        unique: true,
    }) public email: string;

    @Field({
        validate: [(value) => {
            const phonenumber = parsePhoneNumberFromString(value);
            return phonenumber && phonenumber.isValid();
        }, 'Please enter correct phonenumber'],
        unique: true,
    }) public mobile: string;

    public async hashUserPassword() {
        this.password = await HashService.hashPassword(this.password);
        return this;
    }

    public async comparePassword(candidatePassword: string) {
        return HashService.comparePassword(candidatePassword, this.password);
    }
}

export const UsersModel = BaseModel<UsersSchema>(UsersSchema);

// export type OmitProperties<T, P> = Pick<T, { [K in keyof T]: T[K] extends P ? never : K }[keyof T]>;
// export type Body<T> = OmitProperties<T, () => Promise<any>>;
