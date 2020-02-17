import { Post } from './post.model';
import { Subject, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
// @Injectable({providedIn: 'root'}) -- nese do servisin me perdor global pa app.module insert to provoiders
@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}
  getPosts() {
    // return [...this.posts];
     this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
          };
        });
      }))
    .subscribe((postsTransformed) => {
        this.posts = postsTransformed;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostsUpdateListeneer() {
    return this.postsUpdated.asObservable(); // returns an object we can listen
  }

  addPost(title: string, content: string) {
    // tslint:disable-next-line: object-literal-shorthand
    const post: Post = {id: null, title: title, content: content};
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
      .subscribe(res => {
        const id = res.postId; // we get the id of just created post
        post.id = id; // overwrote the const above with the real id from db
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
    // this.postsUpdated.next([...this.posts]); // emits whenever we add a post, and is a copy of my post
    // and it is a copy of posts after we updated them...dmth i merr mas pushit menjiher si te vjetra kete te riun
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
    // we pull out all the properties of an object and add them to a new object cuz not lose any data
  // to original one, we clone them with spread operator
  getPost(id: string) {
    return {...this.posts.find((p) => p.id === id)};
  }

  updatePost(id: string, title: string, content: string) {
    // tslint:disable-next-line: object-literal-shorthand
    const post: Post = {id: id, title: title, content: content};
  }
}
