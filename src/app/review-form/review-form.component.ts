import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.scss']
})
export class ReviewFormComponent {
  reviewForm: FormGroup;
  rating: number = 0; // to manage star rating

  constructor(private fb: FormBuilder, private router:Router) {
    this.reviewForm = this.fb.group({
      comments: ['', Validators.required]
    });
  }

  setRating(value: number) {
    this.rating = value;
  }

  onSubmit() {
    if (this.reviewForm.valid && this.rating > 0) {
      console.log({
        rating: this.rating,
        comments: this.reviewForm.value.comments
      });
      this.router.navigate(['']);
      // Handle your form submission logic here
    }
  }
}
