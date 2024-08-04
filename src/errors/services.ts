export class ServiceError extends Error {
    constructor(readonly err: Error | string) {
        super(function narrow(): string {
            if (err instanceof Error) {
                return err.message;
            }
            return err;
        }());
        this.name = "ServiceError";
    }
}
