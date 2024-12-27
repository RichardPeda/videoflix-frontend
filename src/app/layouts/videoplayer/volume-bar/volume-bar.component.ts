import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, model, ViewChild } from '@angular/core';

@Component({
  selector: 'app-volume-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './volume-bar.component.html',
  styleUrl: './volume-bar.component.scss'
})
export class VolumeBarComponent {
  volume = model.required<number>()


  @ViewChild('volume') volumeControl!: ElementRef



  constructor() {

    
    
    
  }

  ngAfterViewInit(){
    console.log("this.volume()",this.volume());
    // this.setVolume()
   
    console.log("this.volumeControl", this.volumeControl);
    let control = this.volumeControl
    if(control){
      this.setVolume()
    }
  }

  setVolume(){
    
    this.volumeControl.nativeElement.value = this.volume()
  }

  logVolume(){
    this.volume.set(this.volumeControl.nativeElement.value)
   
  }
}
