import { Component, OnInit, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { setBlogs } from '../home/home.store';
import { BlogService } from '../service/blog.service';
import { LoadingService } from '../shared/loading/loading.service';
import { NotificationService } from '../shared/notification/notification.service';
import { Blog } from '../types';

@Component({
  selector: 'app-create-blog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './create-or-update-blog.component.html',
  styleUrl: './create-or-update-blog.component.scss',
})
export class CreateBlogComponent implements OnInit {
  private blogService = inject(BlogService);
  private loadingService = inject(LoadingService);
  private noficationService = inject(NotificationService);

  dialogRef = inject(MatDialogRef<CreateBlogComponent>);

  showLoading = toSignal(this.loadingService.loading$);

  blogData: Blog = {
    title: '',
    content: '',
    id: '',
  };
  protected readonly data = inject<Blog>(MAT_DIALOG_DATA);
  private router = inject(Router);

  ngOnInit(): void {
    if (this.data) {
      this.blogData.title = this.data.title;
      this.blogData.content = this.data.content;
      this.blogData.id = this.data.id;
      this.blogData.createdAt = this.data.createdAt;
    }
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      if (this.blogData.id) {
        if (form.dirty) {
          this.blogService.updateBlog(this.blogData).subscribe((res) => {
            this.noficationService.open('updated blog successfully');
            let allBlogs = this.blogService.blogs();
            allBlogs = allBlogs.map((t) =>
              t.id === this.blogData.id ? { ...res, id: this.blogData.id } : t
            );
            setBlogs(allBlogs);
            this.router.navigate(['/home']);
            this.dialogRef.close();
          });
        }
      } else {
        this.blogService.createBlog(this.blogData).subscribe((res) => {
          this.noficationService.open('created blog successfully');
          this.reset();
          this.router.navigate(['/home']);
          this.dialogRef.close();
        });
      }
    }
  }

  reset() {
    this.blogData.content = '';
    this.blogData.title = '';
    this.blogData.id = '';
  }
}
