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
//  posts = [
//    {title: 'First title', content: 'first content post'},
//    {title: 'Second title', content: 'Second content post'},
//    {title: 'Third title', content: 'Third content post'},
//  ];
// @Input() posts: Post[] = [];
posts: Post[] = [];
private postsSub: Subscription;

constructor(public postService: PostService) {}

ngOnInit() {
  this.postService.getPosts();
  this.postsSub = this.postService.getPostsUpdateListeneer()
  .subscribe((posts: Post[]) => {
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
