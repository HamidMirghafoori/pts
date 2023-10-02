import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.scss']
})
export class ReviewFormComponent {
  reviewForm: FormGroup;
  rating: number = 0; // to manage star rating

  constructor(private fb: FormBuilder) {
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
      // Handle your form submission logic here
    }
  }
}
