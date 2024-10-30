import React from 'react'
const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, background: '#010e36', borderRadius: '100%'}}
      onClick={onClick}
    />
  );
}
export default NextArrow