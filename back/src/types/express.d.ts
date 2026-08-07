import type { UserProfileResponseDTO } from '../dtos/user.dto';

declare global {
    namespace Express {
        interface Request {
            user?: UserProfileResponseDTO;
    }
    }
}

export {};