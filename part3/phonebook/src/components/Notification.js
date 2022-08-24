const Notification = ({ message }) => {
  const successMessage = {
    color: 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  };

  const errorMessage = {
    color: 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  };
  if (message === null) {
    return null;
  }

  const isError = message.includes('ERROR');

  if (isError) {
    const cleanMessage = message.replace('ERROR:', '');
    return <div style={errorMessage}>{cleanMessage}</div>;
  } else {
    return <div style={successMessage}>{message}</div>;
  }
};

export default Notification;
