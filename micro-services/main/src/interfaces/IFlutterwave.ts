import Request from 'request'

export interface FlutterOptions {
    public_key:string, 
    secret_key:string, 
    base_url?:null|string
}

export interface RequestOptions{
    uri:string,
    baseUrl:string,
    method:string,
    body?:Record<string,any>,
    qs?:Record<string,any>,
    json:boolean,
    headers:Record<string,any>

}

export interface FlutterResponse{
    res:Request.Response|undefined,
    body:any
}

export interface IFlutterwave {
    getPublicKey ():string;
    getSecretKey():string;
    getBaseUrl ():string;
    request (path:string, payload:Record<string,any>, callback:Function):Promise<FlutterResponse> | RequestOptions;
}
