import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'lesson-ref',
  templateUrl: './lesson-ref.component.html',
  styleUrls: ['./lesson-ref.component.scss']
})
export class LessonRefComponent implements OnInit {
  @Input("slug")
  public slug!: string;

  @Input("readable")
  public readable!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
