import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-head',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss']
})
export class PageTitleComponent {
  @Input() title: string = '';
}
