import { UserInput } from "@types";

const loginUser = (userInput: UserInput) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userInput),
    });
};

const UserService = {
    loginUser,
};

export default UserService;