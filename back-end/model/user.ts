export class User {
    private id?: number;
    private firstName: string;
    private lastName: string;
    private email: string;
    private username: string;
    private password: string;
    private role: string;

    constructor(user: { id?: number; firstName: string; lastName: string; email: string; username: string; password: string; role: string }) {
        this.validate(user);
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.username = user.username;
        this.password = user.password;
        this.role = user.role;
    }

    getId(): number | undefined {
        return this.id;
    }

    getFirstName(): string {
        return this.firstName;
    }

    getLastName(): string {
        return this.lastName;
    }

    getEmail(): string {
        return this.email;
    }

    getUsername(): string {
        return this.username;
    }

    getRole(): string {
        return this.role;
    }

    validate(user: { email: string; password: string }) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
            throw new Error('Invalid email address');
        }
        if (user.password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
    }

    equals(user: User): boolean {
        return this.id === user.getId() && 
        this.email === user.getEmail() && 
        this.username === user.getUsername();
    }
}