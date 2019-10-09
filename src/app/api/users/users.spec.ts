import '@test/index';
import { superAgent } from '@test/supertest';
import { createUser, deleteUser, UserFixture } from '@test/fixture';
import { Constants, NetworkStatus } from '@core/helpers';
import { Body } from '@lib/mongoose';
import { UsersSchema } from './users.model';

const ENDPOINT = `/api/${Constants.Endpoints.USERS}`;
let user: UserFixture = null;
beforeAll(async () => {
    user = await createUser();
});

afterAll(async () => {
    await deleteUser();
});

// NOTE test the fail, don't test the success
describe('CREATE USER', () => {
    test('Fail if the user exist before', async () => {
        const body = {
            email: 'test@create1.com',
            mobile: '0792807794',
            password: '123456789',
            username: 'testCreate1'
        } as Body<UsersSchema>;
        const req1 = (await superAgent).post(ENDPOINT);
        const res1 = await req1.send(body);

        const req2 = (await superAgent).post(ENDPOINT);
        const res2 = await req2.send(body);

        const deleteReq = await (await superAgent).delete(`${ENDPOINT}/${res1.body.id}`);
        expect(res2.status).toBe(NetworkStatus.BAD_REQUEST);
    });
    test('Special Char is not allowed', async () => {
        const body = {
            email: 'test@create2.com',
            mobile: '0792807794',
            password: '123456789',
            username: 'testCreate2#$'
        } as Body<UsersSchema>;
        const req = (await superAgent).post(ENDPOINT);
        const res = await req.send(body);
        const deleteReq = await (await superAgent).delete(`${ENDPOINT}/${res.body.id}`);
        expect(res.status).toBe(NetworkStatus.BAD_REQUEST);
    });
    test('Mobile number shouldn"t be wrong', async () => {
        const body = {
            email: 'test@create3.com',
            mobile: '079280779',
            password: '123456789',
            username: 'testCreate3'
        } as Body<UsersSchema>;
        const req = (await superAgent).post(ENDPOINT);
        const res = await req.send(body);
        const deleteReq = await (await superAgent).delete(`${ENDPOINT}/${res.body.id}`);
        expect(res.status).toBe(NetworkStatus.BAD_REQUEST);
    });
});

// STUB CREATE: user password should be hashed
// STUB CREATE: user should have an account
// STUB DELETE: remove associated account

// describe('GET BY ${id}/', () => {
//     test('Reject request without token', async () => {
//         const res = await (await superAgent).get(`${ENDPOINT}/${user.id}`);
//         expect(res.status).toBe(NetworkStatus.UNAUTHORIZED);
//     });

//     test('should fail if requested with id not of type ObjectId', async () => {
//         // this will rise cast error
//         const req = (await superAgent).get(`${ENDPOINT}/${undefined}`);
//         const res = await req.set('Authorization', user.token);
//         expect(res.status).toBe(NetworkStatus.BAD_REQUEST);
//     });

//     test('should fail if requested to non exist entity', async () => {
//         const req = (await superAgent).get(`${ENDPOINT}/${new Types.ObjectId()}`);
//         const res = await req.set('Authorization', user.token);
//         expect(res.status).toBe(NetworkStatus.NOT_ACCEPTABLE);
//     });

//     test('resposne body should equal to', async () => {
//         const req = (await superAgent).get(`${ENDPOINT}/${user.id}`);
//         const res = await req.set('Authorization', user.token);
//         const { data } = res.body;
//         expect(data).toHaveProperty('username');
//         expect(data).toHaveProperty('email');
//         expect(data).toHaveProperty('mobile');
//         expect(data).toHaveProperty('createdAt');
//         expect(data).toHaveProperty('updatedAt');
//         expect(data).toHaveProperty('_id');
//         // password return, even it returned without being hashing
//         expect(data).not.toHaveProperty('password');
//     });
// });

// describe('DELETE BY ${id}/', () => {
//     test('Reject request without token', async () => {
//         const res = await (await superAgent).delete(`${ENDPOINT}/${user.id}`);
//         expect(res.status).toBe(NetworkStatus.UNAUTHORIZED);
//     });

//     test('should fail if requested with id not of type ObjectId', async () => {
//         const req = (await superAgent).delete(`${ENDPOINT}/${undefined}`);
//         const res = await req.set('Authorization', user.token);
//         expect(res.status).toBe(NetworkStatus.BAD_REQUEST);
//     });

//     test('should fail if requested to non exist entity', async () => {
//         const req = (await superAgent).delete(`${ENDPOINT}/${new Types.ObjectId()}`);
//         const res = await req.set('Authorization', user.token);
//         expect(res.status).toBe(NetworkStatus.NOT_ACCEPTABLE);
//     });

//     test('resposne body should equal to', async () => {
//         const req = (await superAgent).delete(`${ENDPOINT}/${user.id}`);
//         const res = await req.set('Authorization', user.token);
//         const { data } = res.body;
//         expect(data).toBeNull();
//     });
// });

// tslint:disable-next-line: max-line-length
