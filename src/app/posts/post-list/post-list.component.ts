import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

// @Input() posts: Post[] = [];
posts: Post[] = [];
private postsSub: Subscription;
isLoading = false;
totalPosts = 0;
postsPerPage = 2;
currentPage = 1;
pageSizeOptions = [1, 2, 5, 10];
private authStatusSubs: Subscription;
userIsAuthenticated = false;

constructor(public postService: PostService, private auth: AuthService) {}

ngOnInit() {
  this.isLoading = true;
  this.postService.getPosts(this.postsPerPage, this.currentPage);
  this.postsSub = this.postService.getPostsUpdateListeneer()
  .subscribe((postData: {posts: Post[], postCount: number}) => {
    this.isLoading = false;
    this.posts = postData.posts;
    this.totalPosts = postData.postCount;
  });

  this.userIsAuthenticated = this.auth.getIsAuth();
  this.authStatusSubs = this.auth.getAuthStateListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
}
ngOnDestroy() {
  this.postsSub.unsubscribe();
  this.authStatusSubs.unsubscribe();
  }

  deletePost(id: string) {
    this.isLoading = true;
    this.postService.deletePost(id)
      .subscribe(() => {
        this.postService.getPosts(this.postsPerPage, this.currentPage); // we will refetch the posts after deletion
      });
  }

  onChangedPage(ev: PageEvent) {
    this.isLoading = true;
    this.currentPage = ev.pageIndex + 1; // starts at 1 here and 0 at backend
    this.postsPerPage = ev.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }
}
