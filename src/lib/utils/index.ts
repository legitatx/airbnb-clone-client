import { message, notification } from "antd";

export const iconColor = "#1890ff";

export const formatListingPrice = (price: number, round = true) => {
  const formatttedLisitingPrice = round ? Math.round(price / 100) : price / 100;
  return `$${formatttedLisitingPrice}`;
};

export const displaySuccessNotification = (
  message: string,
  description?: string
) => {
  return notification.success({
    message,
    description,
    placement: "topLeft",
    style: {
      marginTop: 50,
    },
  });
};

export const displayErrorMessage = (error: string) => {
  return message.error(error);
};
