declare global {
    interface FormData {
        merge(data: any): this;
    }
    interface URLSearchParams {
        merge(data: any): this;
    }
    interface File {
        url: string;
    }
}
export {};
