import { Request, Response, NextFunction } from 'express';

/**
 * Interface for the standard response format.
 */
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    metadata?: Record<string, any>;
    error?: {
        message: T;
    };
}

// Extending the Express Response object
declare global {
    namespace Express {
        interface Response {
            /**
             * Sends a success response with the provided data.
             * @param data - The data to be sent in the response.
             * @param metadata - Additional metadata to include in the response.
             */
            success<T>(data: T, metadata?: Record<string, any>): void;
            
            template<T>(data: T, metadata?: Record<string, any>): void;

            /**
             * Sends an error response with the provided message and status code.
             * @param message - The error message to be sent in the response.
             * @param statusCode - The HTTP status code for the error response.
             */
            error<T>(message: T, statusCode?: number, render?:boolean): void;
        }
    }
}

/**
 * Middleware function to handle API responses.
 * This middleware enhances the response object with utility functions
 * for sending standardized success and error responses.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the chain.
 */
function handleResponse(req: Request, res: Response, next: NextFunction): void {
    /**
     * Sends a success response with the provided data.
     * @param data - The data to be sent in the response.
     * @param metadata - Additional metadata to include in the response.
     */
    res.success = function<T>(data: T, metadata?: Record<string, any>): void {
        const response: ApiResponse<T> = {
            success: true,
            data: data,
            metadata: metadata
        };
        if (req.isMain) {
         return  res.render(req.template!, { title: 'HKMCODE - Services',siteData:{
            name:'HKMService',
            framwork:"HKMCode"
        },layout:req.layout!,success:true,data:data,metadata:metadata});
        }
        res.status(200).json(response);
    };

    res.template = function<T>(data: T, metadata?: Record<string, any>): void {
        const response: ApiResponse<T> = {
            success: true,
            data: data,
            metadata: metadata
        };
        if (req.isMain) {
            var errors = req.flash('errors');
            var success = true;
            var error = null;
            if(errors){
                error = errors;
                success = false;
            }

         return  res.render(req.template!, { title: 'HKMCODE - Services',siteData:{
            name:'HKMService',
            framework:"HKMCode"
        },layout:req.layout!,success,error,data:data,metadata:metadata});
        }
        res.status(200).json(response);
    };


    /**
     * Sends an error response with the provided message and status code.
     * @param message - The error message to be sent in the response.
     * @param statusCode - The HTTP status code for the error response.
     */
    res.error = function<T>(message: T, statusCode: number = 500, render:boolean = true): void {
        const response: ApiResponse<T> = {
            success: false,
            error: {
                message: message
            }
        };
        
        if (render && req.isMain) {
            return  res.render(req.template!, { title: 'HKMCODE - Services',siteData:{
                name:'HKMService',
                framework:"HKMCode"
            },layout:req.layout!,success:false,error:message});
        }
        res.status(statusCode).json(response);
    };

    next(); // Call the next middleware in the chain
}

export default handleResponse;
