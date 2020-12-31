import {Component, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'text-with-code',
  templateUrl: './text-with-code.component.html',
  styleUrls: ['./text-with-code.component.scss'],
})
export class TextWithCodeComponent implements OnInit {
  @Output("html")
  public html: string | undefined;

  constructor() {
  }

  ngOnInit(): void {
  }

  @Input("markdown")
  public set markdown(markdown: string | null | undefined) {
    if (markdown == null) {
      this.html = undefined;
    } else {
      this.html = markdown.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
      ;
    }
  }

}
