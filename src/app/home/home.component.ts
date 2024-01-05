import { Component, OnInit, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { BlogService } from '../service/blog.service';
import { HeaderComponent } from '../shared/header/header.component';
import { BlogComponent } from './blog/blog.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    BlogComponent,
    HeaderComponent,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private blogService = inject(BlogService);
  currentPage = this.blogService.currentPage();
  postsPerPage = this.blogService.postsPerPage();
  pageSizeOptions = [1, 2, 3, 5, 10];
  allBlogs = this.blogService.blogs;

  paginatedBlogs = this.blogService.getBlogsByPagination;

  ngOnInit(): void {
    if (!this.allBlogs().length) {
      this.blogService.getAllBlogs().subscribe();
    }
  }

  onChangedPage(pageData: PageEvent) {
    this.blogService.currentPage.set(pageData.pageIndex + 1);
    this.blogService.postsPerPage.set(pageData.pageSize);
  }

  onSearchKeyUp(val: string) {
    this.blogService.filteredValue.set(val);
  }
}
