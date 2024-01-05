import { createStore } from '@ngneat/elf';
import {
  getAllEntities,
  selectAllEntities,
  setEntities,
  withEntities,
} from '@ngneat/elf-entities';
import {
  createRequestDataSource,
  withRequestsCache,
  withRequestsStatus,
} from '@ngneat/elf-requests';

import { localStorageStrategy, persistState } from '@ngneat/elf-persist-state';
import { Blog } from '../types';

const blogStore = createStore(
  {
    name: 'blogStore',
  },
  withEntities<Blog>(),

  withRequestsCache(),
  withRequestsStatus()
);

// persistState(blogStore, {
//   key: 'blogStore',
//   storage: localStorageStrategy,
// });

export const getBlogs = blogStore.query(getAllEntities());

const blogDataSource = createRequestDataSource({
  data$: () => blogStore.pipe(selectAllEntities()),
  dataKey: 'blog',
  idleAsPending: true,
  requestKey: 'blog',
  store: blogStore,
});

export function setBlogs(blogs: Blog[]) {
  blogStore.update(
    setEntities(blogs),
    blogDataSource.setSuccess(),
    blogDataSource.setCached()
  );
}

export const selectBlogDataSource$ = blogDataSource.data$();
