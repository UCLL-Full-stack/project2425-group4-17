type UserInput = {
    id?: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    password?: string;
};

type AuthenticationResponse = {
    token: string;
    username: string;
    fullname: string;
};

export {
    UserInput,
    AuthenticationResponse,
};