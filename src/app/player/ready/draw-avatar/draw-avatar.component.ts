import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { GamePlayerService } from 'src/app/services/game-player.service';
@Component({
  selector: 'app-draw-avatar',
  templateUrl: './draw-avatar.component.html',
  styleUrls: ['./draw-avatar.component.scss']
})
export class DrawAvatarComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') canvas: ElementRef;
  private mouseIsDown = false;
  private context: CanvasRenderingContext2D;
  element: HTMLCanvasElement


  constructor(private game: GamePlayerService) { }

  ngOnInit() {

  }

  ngAfterViewInit() {

    this.element = this.canvas.nativeElement;
    this.context = this.element.getContext('2d');
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 4;
    this.element.onmousedown = (cord) => {
      //console.log('mousedown');
      this.mouseIsDown = true;
      this.context.beginPath();
      this.context.moveTo(this.getPointerPos(this.element, cord).x, this.getPointerPos(this.element, cord).y);
      //console.log('down');
    }
    this.element.onmousemove = (cord) => {
      if (this.mouseIsDown) {
        this.context.lineTo(this.getPointerPos(this.element, cord).x, this.getPointerPos(this.element, cord).y);
        this.context.stroke();
        //console.log('move');
      }
    };

    this.element.onmouseup = (cord) => {
      //console.log('mouseup');
      this.context.closePath();
      this.mouseIsDown = false;
      //console.log('up');
    }
    //console.log(this.canvas);



    this.element.ontouchstart = (cord) => {
      var touch = cord.touches[0];
      var mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      this.element.dispatchEvent(mouseEvent);
      }

  this.element.ontouchmove = (cord) => {
  var touch = cord.touches[0];
  var mouseEvent = new MouseEvent("mousemove", {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  this.element.dispatchEvent(mouseEvent);
  }

  this.element.ontouchend = (cord) => {
    var mouseEvent = new MouseEvent("mouseup", {});
    this.element.dispatchEvent(mouseEvent);
    }

    document.body.ontouchstart = (cord) => {
      if (cord.target == this.element) {
        cord.preventDefault();
        
      }
    }
    document.body.ontouchmove= (cord) => {
      if (cord.target == this.element) {
        cord.preventDefault();
        
      }
    }
    document.body.ontouchend = (cord) => {
      if (cord.target == this.element) {
        cord.preventDefault();
        
      }
    }
  }

  getPointerPos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }



  changeColor(change) {
    this.context.strokeStyle = change.value;
  }
  changeSize(change) {
    this.context.lineWidth = change.value;
  }
  saveImg() {
    const data = this.element.toDataURL();
    this.game.setAvatar(data);
  }
  clearCanvas() {
    this.context.clearRect(0, 0, this.element.width, this.element.height);
  }
}
