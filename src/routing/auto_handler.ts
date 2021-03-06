import { NextFunction, Request, Response } from 'express';
import { HttpResponse, SuccessResponse } from 'response';
import { notNullOrUndefined } from 'utils';

export function autoHandler(...middlewares) {
    return middlewares.map((middleware) => async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await middleware(req, res, next);
            if (notNullOrUndefined(response)) {
                if (response instanceof HttpResponse) {
                    return send(response)
                } else {
                    return send(SuccessResponse.Ok(response))
                }
            }
            // if there's no response it means it just call to next()
        } catch (error) {
            next(error);
        }

        function send(response: HttpResponse) {
            return res.status(response.statusCode).json(response.toJson());
        }
    });
}
