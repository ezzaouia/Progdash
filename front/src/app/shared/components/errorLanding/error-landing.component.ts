import { Component, OnInit } from '@angular/core';

import { environment } from '../../../../environments/environment';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ErrorLanding',
  template: `
    <div class="container">
      <p class="info">
        Afin d’accèder au tableau de bord, merci de passer par le portail de suivi.
      </p>
      <span>
        <a target="_self" href="{{link}}">
          Accèder au portail de suivi
        </a>
      </span>
    </div>
  `,
  styles: [ `
    :host {
      width: 100%;
      height: 100%;
    }
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .info {
      height: 100px;
      display: flex;
      align-items: center;
      margin-bottom: 24px;
    }
    .info p {
      width: 80%;
      text-align: center;
    }
    .link {
      font-size: 14px;
      font-weight: 700;
      display: flex;
      align-items: center;
    }
  ` ],
})
export class ErrorLandingComponent implements OnInit {

  link = environment.SUIVI_STATS_URL;

  constructor () { }

  ngOnInit (): void {}
}
