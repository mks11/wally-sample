import React from 'react';

function ResponsivePhoto({ alt, desktopSrc, mobileSrc, style, ...rest }) {
  return (
    <img
      srcSet={`${mobileSrc} 450w,
                   ${desktopSrc} 600w`}
      sizes="(max-width: 767px) 450px,
                  600px"
      src={desktopSrc}
      alt={alt}
      style={{
        maxWidth: '100%',
        height: 'auto',
        ...style,
      }}
      {...rest}
    />
  );
}

export default ResponsivePhoto;
