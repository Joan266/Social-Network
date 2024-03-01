const DynamicTextarea = ({ setContent, ...rest }) => {

  function textAreaAdjust(event) {
    const element = event.target;
    setContent(element.value);
    element.style.height = (element.scrollHeight - 4) + "px";
  }

  return (
    <textarea
      onChange={textAreaAdjust}
      {...rest}
    />
  );
}

export default DynamicTextarea;
