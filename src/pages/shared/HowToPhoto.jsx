import React from 'react';

function HowToPhoto({ src450, src600, alt, style, ...rest }) {
  return (
    <img
      srcSet={`${src450} 450w,
                   ${src600} 600w`}
      sizes="(max-width: 767px) 450px,
                  600px"
      src={src600}
      alt={alt}
      style={{
        maxWidth: '90%',
        height: 'auto',
        // alignSelf: 'center',
        // margin: '0 auto',
        // width: '90%',
        ...style,
      }}
      {...rest}
    />
  );
}

export default HowToPhoto;
