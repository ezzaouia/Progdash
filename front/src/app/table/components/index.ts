import { CdkTableViewComponent } from './tableView';
import { CdkMColTableViewComponent } from './mColTableView';
import { SlopLinkComponent } from './slopLink';
import { TableViewManagerComponent } from './tableViewManager';
import { CellChartComponent } from './cellChart';
import { TableViewPageComponent } from '../containers';

export const fromComponents: any[] = [
  CdkTableViewComponent,
  CdkMColTableViewComponent,
  SlopLinkComponent,
  CellChartComponent,
  TableViewManagerComponent,
  TableViewPageComponent,
];

export * from './tableView';
export * from './cellChart';
export * from './tableViewManager';
export * from '../containers';
