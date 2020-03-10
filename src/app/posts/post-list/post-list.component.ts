import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../posts.service';
import { Subscription } from 'rxjs';

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

constructor(public postService: PostService) {}

ngOnInit() {
  this.isLoading = true;
  this.postService.getPosts();
  this.postsSub = this.postService.getPostsUpdateListeneer()
  .subscribe((posts: Post[]) => {
    this.isLoading = false;
    this.posts = posts;
  });
}
ngOnDestroy() {
  this.postsSub.unsubscribe();
  }
  deletePost(id: string) {
    this.postService.deletePost(id);
  }
}
