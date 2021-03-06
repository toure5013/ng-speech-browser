import { Component, Injector, Inject, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { TransferState, makeStateKey } from '@angular/platform-browser';
const configKey = makeStateKey('CONFIG');
declare var webkitSpeechRecognition: any;
declare var SpeechRecognition: any;

interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title: string;
  public recordState: string = "play";
  public recordStoped = true;

  constructor(
    private injector: Injector,
    private state: TransferState,
    @Inject(PLATFORM_ID) private platformid: Object,
    private renderer: Renderer2
  ) {
    this.title = 'Voice Search Demo';
    if (isPlatformServer(this.platformid)) {
      const envJson = this.injector.get('CONFIG') ? this.injector.get('CONFIG') : {};
      this.state.set(configKey, envJson as any);
    }
  }


  public voiceSearch() {

    if ('webkitSpeechRecognition' in window) {
          //make toggle choise here to start and stop
      const recognition = new webkitSpeechRecognition() || new SpeechRecognition() ;
    

      if (this.recordStoped) {
          //begin the speech
          recognition.continuous = true;
          recognition.interimresults = false;
          recognition.lang = 'en-US';
          recognition.start();
          this.recordStoped = false;
          this.recordState = 'pause';
      }else {
        //stop the speech
        recognition.stop();
        this.recordStoped = true;
        this.recordState = 'play';
      }

      //---------------EVENT OF SPEECH RECOGNITION--------------------------
      recognition.onstart = function () {
        console.log('Speech recognition service has started');
      }

      recognition.onaudiostart = function () {
        console.log('Audio capturing started');
      }


      recognition.onend = function () {
        console.log('Speech recognition service disconnected');
        recognition.stop();
        this.recordState = 'play';
      }

      recognition.onerror = function (event) {
        console.log('Speech recognition error detected: ' + event.error);
        recognition.stop();
        this.recordState = 'play';
      }


      recognition.onresult = function (e) {
        const textSay = e.results[0][0].transcript;
        console.info(textSay);
        console.info(e);
        recognition.stop();
        this.recordState = 'play';
        //---------- call the backend here ---------
        //when getting the result transform to speech
      }
    } else {
      console.log(this.state.get(configKey, undefined as any));

    }


  }
}
