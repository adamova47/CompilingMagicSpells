import { Routes } from '@angular/router';
import { CncComponent } from './cnc/components/cnc/cnc.component';
import { ExportbibtexComponent } from './cnc/components/exportbibtex/exportbibtex.component';
import { LoginComponent } from './admin/components/login/login.component';
import { authGuard } from './admin/services/auth.guard';
import { AdminLayoutComponent } from './admin/components/admin-layout/admin-layout.component';

export const routes: Routes = [
    { 
        path: 'cnc', 
        component: CncComponent, 
        children: [
            {path: ':getname', component: CncComponent}
        ]
    },
    { path: 'cnc/exportBib/:id', component: ExportbibtexComponent},

    { path: 'admin/login', component: LoginComponent},
    { 
        path: 'admin', 
        component: AdminLayoutComponent, 
        canActivate: [authGuard], 
        children: [
            { 
                path: ':section', 
                component: AdminLayoutComponent, 
                children: [
                    {
                        path: ':part', 
                        component: AdminLayoutComponent
                    }
                ]
            }
        ]
    }
];
