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


  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit(){
    
    const element: HTMLCanvasElement = this.canvas.nativeElement;
    this.context = element.getContext('2d');
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 10;
    element.onmousedown = (cord) =>{
      console.log('mousedown');
      this.mouseIsDown = true;
      this.context.beginPath();
      this.context.moveTo(cord.clientX,cord.clientY);
    }
    element.onmousemove = (cord) =>{
      if(this.mouseIsDown){
        this.context.lineTo(cord.clientX,cord.clientY);
        this.context.stroke();
      }
    }
    element.onmouseup = (cord) =>{
      console.log('mouseup');
      this.context.closePath();
      this.mouseIsDown = false;
    }
    console.log(this.canvas);
  }

  changeColor(change){
    this.context.strokeStyle= change.value;
  }
}
