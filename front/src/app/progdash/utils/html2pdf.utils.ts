export const a4WidgetsStyles = {
  'svg-connections': {
    width: 746,
    height: 200,
  },
  'svg-mline-chart': {
    width: 700,
    height: 300,
  },
};


export const realStyle = function ( _elem, _style ) {
  let computedStyle;
  if ( typeof _elem.currentStyle !== 'undefined' ) {
    computedStyle = _elem.currentStyle;
  } else {
    computedStyle = document.defaultView.getComputedStyle( _elem, null );
  }
  return _style ? computedStyle[_style] : computedStyle;
};

export const copyComputedStyle = function ( src, dest ) {
  const s = realStyle( src, null );
  for ( const i in s ) {
    // Do not use `hasOwnProperty`, nothing will get copied
    if ( typeof i === 'string' && i !== 'cssText' && !/\d/.test( i )) {
      // The try is for setter only properties
      try {
        dest.style[i] = s[i];
        // `fontSize` comes before `font` If `font` is empty, `fontSize` gets
        // overwritten.  So make sure to reset this property. (hackyhackhack)
        // Other properties may need similar treatment
        if ( i === 'font' ) {
          dest.style.fontSize = s.fontSize;
        }
      } catch ( e ) {}
    }
  }
};
