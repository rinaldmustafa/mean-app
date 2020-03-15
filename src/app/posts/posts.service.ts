import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
// @Injectable({providedIn: 'root'}) -- nese do servisin me perdor global pa app.module insert to provoiders
@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(pageSize: number, currentPage: number) {
     const queryParams = `?pagesize=${pageSize}&page=${currentPage}`;
     this.http.get<{message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams)
    .pipe(map((postData) => {
        return {
          posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath
            };
        }),
         maxPosts: postData.maxPosts };
      }))
    .subscribe((postsTransformedData) => {
        this.posts = postsTransformedData.posts;
        this.postsUpdated.next({ posts: [...this.posts], postCount: postsTransformedData.maxPosts});
      });
  }

  getPostsUpdateListeneer() {
    return this.postsUpdated.asObservable(); // returns an object we can listen
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title); // title will be part of filename backend
    this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
      .subscribe(res => {
        this.router.navigate(['/']); // we navigate main after add post and ngONINT fetch data auto
      });
  }

  deletePost(postId: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + postId); // we subs to method
  }

  getPost(id: string) {
    // return {...this.posts.find((p) => p.id === id)};
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>('http://localhost:3000/api/posts/' + id);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
       // tslint:disable-next-line: object-literal-shorthand
      postData = { id: id, title: title, content: content, imagePath: image};
    }
    this.http.put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }
}
