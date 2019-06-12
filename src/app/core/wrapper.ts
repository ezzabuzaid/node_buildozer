import { AdminRouter } from '@api/admin';
import { ArtworksRouter } from '@api/artwork';
import { AuthRoutes } from '@api/portal';
import { ProductsRouter } from '@api/products';
import { UsersRouter } from '@api/users';
import { IExpressInternal, IExpressRouter } from '@lib/methods';
// import { CountriesRoutes } from '@api/countries';
// import { AuthorsRoutes } from '@api/authors/authors.routes';
// import { BooksRoutes } from '@api/books';
import 'reflect-metadata';
export class Wrapper {
    private static list = [];
    // ! #issue fix type any, the router should defined in RouterClass
    public static registerRouter(router, subRouter?) {
        // ...routerList: any[]
        // for (const { router } of routerList) {
        //     this.wrapRouter(router)
        // }
        if (!!subRouter) {
            this.wrapRouter(subRouter);
            this.assignRouterTo(subRouter, router);
        } else {
            this.wrapRouter(router);
        }
    }

    private static wrapRouter(Router: new () => IExpressInternal) {
        try {
            const router = new Router();
            const instance = router.__router();
            if (!instance.id) {
                throw new Error('please consider add @Router to the top of class');
            }
            this.list.push(instance);
        } catch (error) {
            throw new Error('The provided router is not constructor');
        }
    }

    private static assignRouterTo(subRouter, superRouter) {
        // * To check if the router is alredy registerd
        const parentRouter = this.getRouter(superRouter);
        if (!parentRouter) {
            throw new Error('Please register the parent router first, then try');
        }

        parentRouter.use(superRouter.routesPath, subRouter.router);
    }

    static get routerList(): IExpressRouter[] {
        return this.list;
    }

    public static getRouter({ id }) {
        const { router } = this.list.find(({ _router }) => _router.id === id);
        return router;
    }

    private static dispatchRouter({ router }: any) {
        this.list.splice(router);
        // tslint:disable-next-line: max-line-length
        // ? This is not done, we need to re init all the router again, or just remove this router from both router list and router bootstrap list
    }

}

Wrapper.registerRouter(UsersRouter);
Wrapper.registerRouter(AdminRouter);
Wrapper.registerRouter(ProductsRouter);
Wrapper.registerRouter(AuthRoutes);
Wrapper.registerRouter(ArtworksRouter);
// Wrapper.registerRouter(CountriesRoutes);
// Wrapper.registerRouter(AuthorsRoutes);
// Wrapper.registerRouter(BooksRoutes);
