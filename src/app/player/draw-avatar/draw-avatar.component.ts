import { Component, OnInit,ViewChild, ElementRef, AfterViewInit  } from '@angular/core';
@Component({
  selector: 'app-draw-avatar',
  templateUrl: './draw-avatar.component.html',
  styleUrls: ['./draw-avatar.component.scss']
})
export class DrawAvatarComponent implements OnInit , AfterViewInit {
  @ViewChild('canvas') canvas: ElementRef;
  private mouseIsDown : boolean = false;
  private context: CanvasRenderingContext2D;
  element: HTMLCanvasElement


  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit(){
    
    this.element = this.canvas.nativeElement;
    this.context = this.element.getContext('2d');
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 10;
    this.element.onpointerdown = (cord) =>{
      //console.log('mousedown');
      this.mouseIsDown = true;
      this.context.beginPath();
      this.context.moveTo(cord.clientX,cord.clientY);
    }
    this.element.onpointermove = (cord) =>{
      if(this.mouseIsDown){
        this.context.lineTo(cord.clientX,cord.clientY);
        this.context.stroke();
      }
    }
    this.element.onpointerup = (cord) =>{
      //console.log('mouseup');
      this.context.closePath();
      this.mouseIsDown = false;
    }
    console.log(this.canvas);
  }

  changeColor(change){
    this.context.strokeStyle= change.value;
  }
  changeSize(change){
    this.context.lineWidth=change.value;
  }
  saveImg(){
      let dataURL = this.element.toDataURL('image/jpg');
      console.log(dataURL);
  }
  clearCanvas(){
    this.context.clearRect(0, 0, this.element.width, this.element.height);
  }
}
