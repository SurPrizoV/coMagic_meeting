/* eslint-disable react/prop-types */
import { Button, Card, Flex, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const cardStyle = {
  width: 620,
};
const imgStyle = {
  display: "block",
  width: 273,
  height: 500,
  objectFit: "cover",
};

export const UserCard = ({
  id,
  firstName,
  lastName,
  photo,
  age,
  gender,
  city,
}) => {
  const navigate = useNavigate()

  return (
    <Card
      key={id}
      hoverable
      style={cardStyle}
      styles={{
        body: {
          padding: 0,
          overflow: "hidden",
        },
      }}
    >
      <Flex justify="space-between">
        <img alt="avatar" src={photo} style={imgStyle} />
        <Flex
          vertical
          align="flex-end"
          justify="space-between"
          style={{
            padding: 32,
          }}
        >
          <Typography.Title level={3}>
            {firstName} {lastName}
          </Typography.Title>
          <Typography.Title level={5}>{age}</Typography.Title>
          <Typography.Title level={3}>
          </Typography.Title>
          <Typography.Title level={5}>
            {gender}
          </Typography.Title>
          <Typography.Title level={5}>{city}</Typography.Title>
          <Button type="primary" target="_blank" onClick={() => navigate(`user/${id}`)}>
            Открыть
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};
