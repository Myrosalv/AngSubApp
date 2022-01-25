import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}


@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public button_text: string;
    ngOnInit() {
        this.button_text = "SUBSCRIBE";
    }

    onSubscribe() {
        this.button_text = this.button_text === 'SUBSCRIBE' ? 'UNSUBSCRIBE' : 'SUBSCRIBE';

    }

}
