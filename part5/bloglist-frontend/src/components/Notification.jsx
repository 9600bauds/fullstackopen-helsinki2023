import { useNotificationContext } from "../contexts/notificationContext";

const Notification = () => {

  const {message, type} = useNotificationContext();
  
  const style = {
    backgroundColor: `lightgrey`,
    margin: `10px`,
    padding: `10px`,
    border: `2px solid`,
    borderColor: type === `success` ? `green` : `red`,
    borderRadius: `5px`,
  };

  if(!message){
    return <></>;
  }

  return (
    <div style={style}>
      {message}
    </div>
  );
};

export default Notification;