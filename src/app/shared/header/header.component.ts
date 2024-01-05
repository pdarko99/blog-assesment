import { Component, Injector, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { createBlogDialog } from '../../create-or-update-blog/create-or-update-blog.functions';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  protected readonly injector = inject(Injector);

  createPost() {
    createBlogDialog(this.injector).subscribe();
  }
}
