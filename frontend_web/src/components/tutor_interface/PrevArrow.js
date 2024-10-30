import React from 'react'
const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, background: '#010e36', borderRadius: '100%'}}
      onClick={onClick}
    />
  );
}
export default PrevArrow