export default class DatabaseError extends Error {
    constructor(readonly err: Error | string) {
        super(function narrow(): string {
            if (err instanceof Error) {
                return err.message;
            }
            return err;
        }());
        this.name = "DatabaseError";
    }
}
