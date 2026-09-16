import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course-details',
  standalone: true,
  template: `
    <div class="p-4 text-white">
      <h2>Course Details</h2>
      <p>Course ID from URL: {{ courseId() }}</p>
    </div>
  `
})
// ✅ Routing (Router parameters)
export class CourseDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  courseId = signal<string | null>(null);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.courseId.set(params.get('id'));
    });
  }
}
