import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  template: `<p class="text-muted">{{ text }}</p>`,
})
export class LoadingComponent {
  @Input() text = 'Loading...';
}
