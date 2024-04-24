import { Routes } from '@angular/router';
import { CncComponent } from './cnc/components/cnc/cnc.component';
import { ExportbibtexComponent } from './cnc/components/exportbibtex/exportbibtex.component';
import { LoginComponent } from './admin/components/login/login.component';
import { AdminComponent } from './admin/components/admin/admin.component';
import { authGuard } from './admin/services/auth.guard';

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
        component: AdminComponent, 
        canActivate: [authGuard], 
        children: []
    }
];
