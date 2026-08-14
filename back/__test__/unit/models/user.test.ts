import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import db from '../../../src/config/database';
import { UserModel, UserRow } from '../../../src/models/user.model';
import { UserRole } from '../../../src/dtos/user.dto';

jest.mock('../../../src/config/database', () => ({
    __esModule: true,
    default: {
        query: jest.fn(),
        pool: {},
    },
}));

describe('User Model', () => {
    let userData!: { user: UserRow };
    let user!: UserModel;
    let profileResponse!: ReturnType<UserModel['toProfileResponse']>;
    const mockedDbQuery = db.query as any;
    
    beforeEach(() => {
        userData = {
            user: {
                id: 1,
                username: 'testuser',
                email: 'test@user.com',
                role: UserRole.TUTOR,
                pontuacao: 100,
                rankGlobal: 'A',
                password_hash: 'hashedpassword',
            },
        };
        jest.clearAllMocks();
        user = new UserModel(userData);
        profileResponse = user.toProfileResponse();
        mockedDbQuery.mockResolvedValue([userData.user]);
    });


    test('should create a user with valid properties', () => {
        expect(user.id).toBe(1);
        expect(user.username).toBe('testuser');
        expect(user.email).toBe('test@user.com');
        expect(user.role).toBe(UserRole.TUTOR);
        expect(user.pontuacao).toBe(100);
        expect(user.rankGlobal).toBe('A');
        expect(user.passwordHash).toBe('hashedpassword');
    });

    test('should return null for properties if user data is null', () => {
        const user = new UserModel({ user: null as any });
        expect(user.id).toBeNull();
        expect(user.username).toBeNull();
        expect(user.email).toBeNull();
        expect(user.role).toBeNull();
        expect(user.pontuacao).toBeNull();
        expect(user.rankGlobal).toBeNull();
        expect(user.passwordHash).toBeNull();
    });

    test('should turn the user to a profile response', () => {
        expect(profileResponse?.id).toBe(1);
        expect(profileResponse?.username).toBe('testuser');
        expect(profileResponse?.email).toBe('test@user.com');
        expect(profileResponse?.role).toBe(UserRole.TUTOR);
        expect(profileResponse?.pontuacao).toBe(100);
        expect(profileResponse?.rankGlobal).toBe('A');

    });

    test('should return null for profile response if user data is null', () => {
        const user = new UserModel({ user: null as any });
        const profileResponse = user.toProfileResponse();
        expect(profileResponse).toBeNull();
    });

    test('should handle missing optional properties in profile response', () => {
        const userDataWithoutOptional = {
            user: {
                id: 2,
                username: 'testuser2',
                email: 'test2@user.com',
                role: UserRole.CATSITTER,
                password_hash: 'hashedpassword2',
            },
        };
        const user = new UserModel(userDataWithoutOptional);
        const profileResponse = user.toProfileResponse();
        expect(profileResponse?.id).toBe(2);
        expect(profileResponse?.username).toBe('testuser2');
        expect(profileResponse?.email).toBe('test2@user.com');
        expect(profileResponse?.role).toBe(UserRole.CATSITTER);
        expect(profileResponse?.pontuacao).toBe(undefined);
        expect(profileResponse?.rankGlobal).toBe(undefined);
    });

    test('should find user by email', async () => {
        const result = await UserModel.findByEmail(userData.user.email);

        expect(mockedDbQuery).toHaveBeenCalledWith(
            'SELECT * FROM users WHERE email = ? LIMIT 1',
            [userData.user.email],
        );
        expect(result).toEqual(userData.user);
    });

    test('should find user by username', async () =>{
        const result = await UserModel.findByUsername(userData.user.username);

        expect(mockedDbQuery).toHaveBeenCalledWith(
            'SELECT * FROM users WHERE username = ? LIMIT 1',
            [userData.user.username],
        );
        expect(result).toEqual(userData.user);

    });

    test('should find user by id', async () =>{
        const result = await UserModel.findById(userData.user.id);

        expect(mockedDbQuery).toHaveBeenCalledWith(
            'SELECT id, username, email, role, pontuacao, rankGlobal, password_hash FROM users WHERE id = ? LIMIT 1',
            [userData.user.id],
        );
        expect(result).toEqual(userData.user);

    });

    test('should return null if user not found by email, username or id', async () =>{

        mockedDbQuery.mockResolvedValue([]);

        await expect(UserModel.findByEmail('missing@user.com')).resolves.toBeNull();
        await expect(UserModel.findByUsername('missing-user')).resolves.toBeNull();
        await expect(UserModel.findById(9999)).resolves.toBeNull();

    });

    test('should create a new user in the database', () =>{
        mockedDbQuery.mockImplementation(async () => ({ insertId: 99 }));

        const payload = {
            username: 'newuser',
            email: 'new@user.com',
            password_hash: 'hashed-password',
            role: UserRole.TUTOR,
        };

        return UserModel.create(payload).then((result: any) => {
            expect(mockedDbQuery).toHaveBeenCalledTimes(1);
            expect(mockedDbQuery).toHaveBeenCalledWith(
                'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
                [payload.username, payload.email, payload.password_hash, payload.role],
            );
            expect(result).toEqual({ insertId: 99 });
        });
    });

});