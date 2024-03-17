import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DocumentComponent } from './components/dashboard/document/document.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/dashboard/home/home.component';
import { ClientComponent } from './components/dashboard/client/client.component';
import { CompanyComponent } from './components/dashboard/company/company.component';
import { AuthGuardService } from './services/Auth/auth.guard.service';
import { AreaComponent } from './components/dashboard/area/area.component';
import { SubAreaComponent } from './components/dashboard/sub-area/sub-area.component';
import { ProfileComponent } from './components/dashboard/profile/profile.component';
import { CertificateComponent } from './components/dashboard/certificate/certificate.component';
import { UserComponent } from './components/dashboard/user/user.component';
import { SaleComponent } from './components/dashboard/sale/sale.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'Documento', component: DocumentComponent },
      { path: 'Cliente', component: ClientComponent },
      { path: 'Empresa', component: CompanyComponent },
      { path: 'Area', component: AreaComponent },
      { path: 'Sub-Area', component: SubAreaComponent },
      { path: 'Perfiles', component: ProfileComponent },
      { path: 'Certificado', component: CertificateComponent },
      { path: 'Usuarios', component: UserComponent },
      { path: 'Ventas', component: SaleComponent },
    ]
  },
  // Otras rutas si las tienes definidas
  //{ path: '**', redirectTo: '/login' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
