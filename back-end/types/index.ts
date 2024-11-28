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

type PaperInput = {
    date: Date;
    namePaper: string;
    namePublisher: string;
  };
  

export {
    UserInput,
    AuthenticationResponse,
    PaperInput,
};