import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { UserModel, UserRow } from '../../../src/models/user.model';
import { UserRole } from '../../../src/dtos/user.dto';

describe('User Model', () => {
    let userData!: { user: UserRow };
    let user!: UserModel;
    let profileResponse!: ReturnType<UserModel['toProfileResponse']>;
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

});