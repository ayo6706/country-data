export default function failedPromise(data: any): Promise<any> {
    return Promise.reject(data);
}
