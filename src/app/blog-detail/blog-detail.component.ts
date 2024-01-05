import { Component, Injector, Input, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { createBlogDialog } from '../create-or-update-blog/create-or-update-blog.functions';
import { setBlogs } from '../home/home.store';
import { BlogService } from '../service/blog.service';
import { HeaderComponent } from '../shared/header/header.component';
import { Blog } from '../types';
import { LoadingService } from '../shared/loading/loading.service';
import { NotificationService } from '../shared/notification/notification.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [HeaderComponent, MatCardModule, MatButtonModule],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss',
})
export class BlogDetailComponent implements OnInit {
  protected readonly injector = inject(Injector);
  private loadingService = inject(LoadingService);
  private noficationService = inject(NotificationService);

  showLoading = toSignal(this.loadingService.loading$);


  selectedBlog!: Blog;

  protected blogId!: string;

  @Input() set id(id: string) {
    this.blogId = id;
    this.selectedBlog = this.blogService.blogs().filter((i) => i.id === id)[0];
  }
  private blogService = inject(BlogService);
  private router = inject(Router);

  deleteBlog() {
    this.blogService.deleteBlog(this.blogId).subscribe((res) => {
      let blogs = this.blogService.blogs();
      let newBlog = blogs.filter((i) => i.id !== this.blogId);
      setBlogs(newBlog);
      this.noficationService.open('deleted blog successfully');
      this.router.navigate(['/home']);
    });
  }

  updateBlog() {
    createBlogDialog(this.injector, this.selectedBlog).subscribe();
  }

  ngOnInit(): void {
    if (!this.blogService.blogs().length) {
      this.blogService.getAllBlogs().subscribe((res) => {
        this.selectedBlog = res.filter((i) => i.id === this.blogId)[0];
      });
    }
  }
}
