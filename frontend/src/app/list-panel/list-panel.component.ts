import { Component, OnInit, Input  } from '@angular/core';

@Component({
  selector: 'app-list-panel',
  templateUrl: './list-panel.component.html',
  styleUrls: ['./list-panel.component.scss']
})
export class ListPanelComponent implements OnInit {

  @Input("data") dataArr;
  @Input("isLoading") isLoadingProgress;
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    
    console.log(this.dataArr)
    console.log(this.isLoadingProgress)
  }
}
