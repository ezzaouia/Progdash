import { random  } from 'lodash';

export interface DummyData {
  id: string;
  nbr: number;
  nbr2: number;
  cat: string;
  cat2: string;
}


const data: DummyData[] = [];
export const cats = [ 'cat1', 'cat2', 'cat3', 'cat4', 'cat5' ];
for ( let i = 0; i < 130; ++i ) {
  data.push({
    id: 'Row ' + i,
    nbr: random( 0, 99 ),
    nbr2: random( 0, 99 ),
    cat: cats[Math.floor( Math.random() * 5 )],
    cat2: cats[Math.floor( Math.random() * 5 )],
  });
}

export const DUMMY_DATA: DummyData[] = data;
