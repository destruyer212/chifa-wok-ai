import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VoiceWidgetComponent } from './features/voice-widget/voice-widget.component';

@Component({
  selector: 'cw-root',
  standalone: true,
  imports: [RouterOutlet, VoiceWidgetComponent],
  template: `
    <router-outlet />
    <cw-voice-widget />
  `,
})
export class AppComponent {}
