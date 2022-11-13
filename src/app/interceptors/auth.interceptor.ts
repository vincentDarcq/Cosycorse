import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const auth = sessionStorage.getItem('jwt');
        const token = sessionStorage.getItem('token');
        const urlGeo = req.url.match('geoapify');
        if (auth && urlGeo === null) {
            let authReq: HttpRequest<any>;
            authReq = req.clone({
                headers: token ? req.headers.set('authorization', auth).set('token', token) :
                                req.headers.set('authorization', auth),
            })
            return next.handle(authReq);
        } else {
            return next.handle(req);
        }
    }
}
