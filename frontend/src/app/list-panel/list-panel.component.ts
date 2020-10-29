import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-list-panel',
  templateUrl: './list-panel.component.html',
  styleUrls: ['./list-panel.component.scss']
})
export class ListPanelComponent implements OnInit {

  @Input("data") dataArr;
  @Input("isLoading") isLoadingProgress;
  @Output() onInterestPicked = new EventEmitter<number>();
  @Input("currentSelectedIndex") currentSelectedIndex;
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {

  }

  showInterestOnMap = (evt, i) => {
    this.currentSelectedIndex = i
    this.onInterestPicked.emit(i);
  }
}
