import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta as StoryMeta } from "@storybook/react/types-6-0";
import { Button, Card, Avatar } from "antd";

const { Meta } = Card;
export default {
  title: "Example/ant d Card",
  component: Card,
} as StoryMeta;

const Template: Story = (args) => (
  <Card
    {...args}
    style={{ width: 300 }}
    cover={
      <img
        alt="example"
        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
      />
    }
    actions={[]}
  >
    <Meta
      avatar={
        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
      }
      title="Card title"
      description="This is the description"
    />
  </Card>
);

export const Default = Template.bind({});
