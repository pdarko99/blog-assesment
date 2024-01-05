import { Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Blog } from '../types';
import { CreateBlogComponent } from './create-or-update-blog.component';

export function createBlogDialog(injector: Injector, data?: Blog) {
  return injector
    .get(MatDialog)
    .open<CreateBlogComponent, Blog>(CreateBlogComponent, {
      data,
      minWidth: '350px',
    })
    .afterClosed();
}
