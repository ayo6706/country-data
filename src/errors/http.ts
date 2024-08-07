export default class HttpError extends Error {
    constructor(readonly err: Error | string, public statusCode?: number) {
        super(function narrow(): string {
            if (err instanceof Error) {
                return err.message;
            }
            return err;
        }());
        this.name = "HttpError";
    }
}
