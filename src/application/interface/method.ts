export interface Method {
    url: string;
    type: 'GET' | 'POST' | 'PUT' | 'DELETE',
    transformData?: any
}

export default Method;