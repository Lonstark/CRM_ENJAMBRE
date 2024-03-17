import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './components/dashboard/header/header.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { HomeComponent } from './components/dashboard/home/home.component';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DocumentComponent } from './components/dashboard/document/document.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CreateDialogComponent } from './dialogs/create-dialog/create-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ClientComponent } from './components/dashboard/client/client.component';
import { CreateClientDialogComponent } from './dialogs/create-client-dialog/create-client-dialog.component';
import { CompanyComponent } from './components/dashboard/company/company.component';
import { HttpClientModule } from '@angular/common/http';
import { CreateCompanyDialogComponent } from './dialogs/create-company-dialog/create-company-dialog.component';
import { AreaComponent } from './components/dashboard/area/area.component';
import { CreateAreaDialogComponent } from './dialogs/create-area-dialog/create-area-dialog.component';
import { SubAreaComponent } from './components/dashboard/sub-area/sub-area.component';
import { ProfileComponent } from './components/dashboard/profile/profile.component';
import { CreateProfileComponent } from './dialogs/create-profile/create-profile.component';
import { CertificateComponent } from './components/dashboard/certificate/certificate.component';
import { CreateCertificateComponent } from './dialogs/create-certificate/create-certificate.component';
import { UserComponent } from './components/dashboard/user/user.component';
import { CreateUserComponent } from './dialogs/create-user/create-user.component';
import {MatTabsModule} from '@angular/material/tabs';
import { CreateSubareaComponent } from './dialogs/create-subarea/create-subarea.component';
import { UpdateAreaComponent } from './dialogs/update-area/update-area.component';
import { UpdateClientComponent } from './dialogs/update-client/update-client.component';
import { UpdateDocumentComponent } from './dialogs/update-document/update-document.component';
import { UpdateCompanyComponent } from './dialogs/update-company/update-company.component';
import { UpdateSubareaComponent } from './dialogs/update-subarea/update-subarea.component';
import { SaleComponent } from './components/dashboard/sale/sale.component';
import { UpdateCertificateComponent } from './dialogs/update-certificate/update-certificate.component';
import { CreateSaleComponent } from './dialogs/create-sale/create-sale.component';
import { UpdateProfileComponent } from './dialogs/update-profile/update-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HeaderComponent,
    HomeComponent,
    DocumentComponent,
    CreateDialogComponent,
    ClientComponent,
    CreateClientDialogComponent,
    CompanyComponent,
    CreateCompanyDialogComponent,
    AreaComponent,
    CreateAreaDialogComponent,
    SubAreaComponent,
    ProfileComponent,
    CreateProfileComponent,
    CertificateComponent,
    CreateCertificateComponent,
    UserComponent,
    CreateUserComponent,
    CreateSubareaComponent,
    UpdateAreaComponent,
    UpdateClientComponent,
    UpdateDocumentComponent,
    UpdateCompanyComponent,
    UpdateSubareaComponent,
    SaleComponent,
    UpdateCertificateComponent,
    CreateSaleComponent,
    UpdateProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatDividerModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogModule,
    MatTabsModule,
    MatSidenavModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
