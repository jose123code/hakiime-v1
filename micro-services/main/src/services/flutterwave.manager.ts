import { INTERFACE_TYPE, initDefaultValue } from "../utils";
import Request from 'request'
import querystring from 'querystring';
import { inject, injectable } from "inversify";
import { 
  ApplicationConfig, 
  IConfig ,
  FlutterResponse, 
  IFlutterwave, 
  RequestOptions
} from "../interfaces";


@injectable()
export class Flutterwave implements IFlutterwave {
    private public_key: string;
    private secret_key: string;
    private _base_url: string;
  
    constructor(
        @inject(INTERFACE_TYPE.ConfigurationManager) configManager: IConfig,
    ) {

      var config = (configManager.getConfig() as ApplicationConfig).flutterwave[process.env.ENVIRONMENT || 'dev'];

      this.public_key = config.public_key;
      this.secret_key = config.secret_key;

      this._base_url = initDefaultValue<string>(config.base_url,'https://api.flutterwave.com/');
    }

    getPublicKey ():string {
        return this.public_key;
    };

    getSecretKey():string {
        return this.secret_key;
    };

    getBaseUrl ():string {
        return this._base_url;
    };

    request (path:string, payload:Record<string,any>, callback:Function):Promise<FlutterResponse> | RequestOptions {
        var requestOptions:RequestOptions = {
            uri: "",
            baseUrl: "",
            method: "",
            json: false,
            headers: {}
        };
        var requestMethod = initDefaultValue<string>(
          payload.method,
          'POST' || 'PUT',
        );
        var datakey = requestMethod == 'POST' || 'PUT' ? 'body' : 'qs';
        var requestJSON = datakey == 'body' ? true : false;
        var includeQueryParams = initDefaultValue<boolean>(
          payload.excludeQuery,
          false,
        );
    
        if (requestMethod === 'GET') {
          delete payload.method;
          if (includeQueryParams == true) {
            delete payload.excludeQuery;
            requestOptions.uri = path;
          } else {
            const queryParams = querystring.stringify(payload);
            requestOptions.uri = path += `${queryParams}`;
          }
        } else {
          requestOptions.uri = path;
        }
    
        requestOptions.baseUrl = this.getBaseUrl();
        requestOptions.method = requestMethod;
        requestOptions[datakey] = initDefaultValue<object>(payload, {});
        requestOptions.json = requestJSON;
        requestOptions.headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getSecretKey()}`,
        };
    
        // console.log(requestOptions);
    
        if (callback) {
          this._makeRequest(requestOptions, callback);
          return requestOptions;
        } else {
          return this._makePromiseRequest(requestOptions);
        }
      };

    _makeRequest (requestOptions:RequestOptions, callback:Function) {
        Request(requestOptions, function (err:any, res:Request.Response|undefined, body:any) {
            var r:any = res;
            if (typeof res == 'undefined') {
                r = {};
            }

            if (typeof body == 'undefined') {
                body = {};
            }
            callback(err, res, body);
        });
      }
    

      _makePromiseRequest (requestOptions:RequestOptions):Promise<FlutterResponse> {
        var self = this;
        return new Promise(function (resolve, reject) {
          self._makeRequest(requestOptions, function (err:any, res:Request.Response|undefined, body:any) {
            if (err) {
              reject(err);
            } else {
              resolve({res, body});
            }
          });
        });
      };
}

