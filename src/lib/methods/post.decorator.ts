import { AppUtils } from '../../app/core/utils';
import { RouterMethodDecorator } from '@lib/typing';
import { ErrorHandling } from '@core/helpers/errors';
import { RequestHandler } from 'express';

export function Post<T=any>(uri: string, ...middlewares: RequestHandler[]) {
    return function (target:RouterMethodDecorator & T, propertyKey: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value;
        descriptor.value = function () {
            //* any code here will be executed when the marked method get called 
            //* bind a router class instance
            return method.apply(target, arguments);

        }

        //* since the method decorator called before the class decorator we have no access to any of
        //* the method or properites that binded manually by the {Router} decorator
        //* and setTimeout solved this to us  
        setTimeout(() => {
            //* a way fix path to router slashes
            //* join router path and get path
            uri = AppUtils.joinPath(target.routeUri, '/', uri);

            //* assign the router
            target.post(uri, ErrorHandling.wrapRoute(...middlewares, function () {
                return target[propertyKey](...arguments);
            }));

        }, 0);
    }
}
