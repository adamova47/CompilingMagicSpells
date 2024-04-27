import { Routes } from '@angular/router';
import { CncComponent } from './cnc/components/cnc/cnc.component';
import { ExportbibtexComponent } from './cnc/components/exportbibtex/exportbibtex.component';
import { LoginComponent } from './admin/components/login/login.component';
import { authGuard } from './admin/services/auth.guard';
import { CncHomeComponent } from './admin/components/cnc-home/cnc-home.component';
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
            { path: '', component: AdminLayoutComponent, data: { component: 'MyHomeComponent'}},
            { path: 'cnchome', component: AdminLayoutComponent, data: { component: 'CncHomeComponent'}},
            { path: 'cncprojects', component: AdminLayoutComponent, data: { component: 'CncProjectsComponent'}},
            { path: 'publications', component: AdminLayoutComponent, data: { component: 'PublicationsComponent'}},
            { path: 'bibtexchars', component: AdminLayoutComponent, data: { component: 'BibTexCharsComponent'}},
            { path: 'cogscihome', component: AdminLayoutComponent, data: { component: 'CogSciHomeComponent'}},
            { path: 'aiseminar', component: AdminLayoutComponent, data: { component: 'AiSeminarComponent'}}
        ]
    }
];
