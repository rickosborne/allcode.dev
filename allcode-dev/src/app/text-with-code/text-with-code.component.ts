import {Component, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'text-with-code',
  templateUrl: './text-with-code.component.html',
  styleUrls: ['./text-with-code.component.scss']
})
export class TextWithCodeComponent implements OnInit {
  @Input("markdown")
  public markdown: string | null | undefined;

  @Output("html")
  public html: string | undefined;

  constructor() { }

  ngOnInit(): void {
    if (this.markdown == null) {
      this.html = undefined;
    } else {
      this.html = this.markdown.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/`(.+?)`/g, '<code>$1</code>');
    }
  }

}
