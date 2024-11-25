import jwt from 'jsonwebtoken';

type JWTTokenPayload = {
    username: string;
    role: string;
};

const generateJWTToken = ({ username, role }: JWTTokenPayload): string => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_HOURS ? `${process.env.JWT_EXPIRES_HOURS}h` : '8h';

    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const options = {
        expiresIn,
        issuer: 'courses_app',
    };

    try {
        return jwt.sign({ username, role }, secret, options);
    } catch (err) {
        console.error('Error generating token:', err);
        throw new Error('Error generating token');
    }
};

export { generateJWTToken };
