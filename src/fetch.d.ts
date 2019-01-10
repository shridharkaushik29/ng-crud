declare const _default: "ngCrudFetch";
export default _default;
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
