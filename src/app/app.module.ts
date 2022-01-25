import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrModule } from "ngx-toastr";
import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AppRoutes } from './app.routing';
import { StoreModule } from "@ngrx/store";
import { Reducer } from "./store/reducer";


@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent
  ],
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes, {
      useHash: false
    }),
    StoreModule.forRoot({ reducer: Reducer }),
    SidebarModule,
    ToastrModule.forRoot(),
    FooterModule,
    //FixedPluginModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
