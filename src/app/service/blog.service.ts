import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, filter, map, tap } from 'rxjs';
import { selectBlogDataSource$, setBlogs } from '../home/home.store';
import { Blog } from '../types';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private url = 'https://blogstack-eae12-default-rtdb.firebaseio.com/blogs';
  private http = inject(HttpClient);

  currentPage = signal(1);
  postsPerPage = signal(3);
  filteredValue = signal('');

  public readonly selectBlogs$ = selectBlogDataSource$.pipe(
    filter((data) => !data.loading),
    map((data) => data.blog)
  );
  blogs = toSignal(this.selectBlogs$, { initialValue: [] });

  filterBlog = computed(() => {});

  getBlogsByPagination = computed(() => {
    if (this.filteredValue()) {
      return this.blogs().filter(
        (blog) =>
          blog.title
            .toLowerCase()
            .indexOf(this.filteredValue().toLowerCase()) !== -1
      );
    }
    let start;
    if (this.currentPage() === 1) {
      start = 0;
    } else {
      start = (this.currentPage() - 1) * this.postsPerPage();
    }

    return this.blogs().slice(start, start + this.postsPerPage());
  });

  getAllBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.url + '.json').pipe(
      map((responseData) => {
        const blogArray = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            blogArray.push({ ...responseData[key], id: key });
          }
        }
        return blogArray;
      }),
      tap((x) => {
        setBlogs(x);
      })
    );
  }

  createBlog(data: Blog): Observable<{ name: string }> {
    data.createdAt = new Date();
    return this.http.post<{ name: string }>(this.url + '.json', data).pipe(
      tap((x) => {
        let newBlog = { ...data };
        newBlog.id = x.name;
        let blogs = [newBlog, ...this.blogs()];
        setBlogs(blogs);
      })
    );
  }

  updateBlog(blog: Blog): Observable<Blog> {
    return this.http.patch<Blog>(`${this.url}/${blog.id}.json`, {
      title: blog.title,
      content: blog.content,
      updatedAt: new Date(),
    });
  }

  deleteBlog(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.url}/${id}.json`);
  }
}
