// import { Component, EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostService } from '../posts.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent {
  // enteredTitle = '';
  // enteredContent = '';
  // @Output() postCreated = new EventEmitter<Post>(); video 28 e heqim

  constructor(public postService: PostService) {}
  // newPost = 'No content';

  // onAddPost(userInput: HTMLTextAreaElement) {
  //   this.newPost = userInput.value;
  // }
  // onAddPost() {
    // this.newPost = this.enteredValue;
  //   const post: Post = {
  //     title: this.enteredTitle,
  //     content: this.enteredContent
  //   };
  //   this.postCreated.emit(post);
  // }
  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // const post: Post = {
    //  title: form.value.title,
    //   content: form.value.content
    //    };
    // this.postCreated.emit(post);
    this.postService.addPost(form.value.title, form.value.content);
    form.resetForm();
  }
}
