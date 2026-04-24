import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: `
    <div class="pagination-bar">
      <span class="pagination-meta text-muted">Page {{ page }} / {{ totalPages }}</span>
      <div class="pagination-actions">
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          [disabled]="page <= 1"
          (click)="change(page - 1)"
        >
          Prev
        </button>
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          [disabled]="page >= totalPages"
          (click)="change(page + 1)"
        >
          Next
        </button>
      </div>
    </div>
  `,
})
export class PaginationComponent {
  @Input() page = 1;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();

  change(next: number): void {
    this.pageChange.emit(next);
  }
}
